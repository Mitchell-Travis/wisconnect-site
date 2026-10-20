"""Permission-checked operational reports. Current state is never presented as historical state."""
import csv
import io
import re
import unicodedata
from datetime import date, datetime, time, timedelta, timezone

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy import func, select, text
from sqlalchemy.exc import SQLAlchemyError

from .auth import ReportReader, DB, now, throttle
from .models import Business, BusinessEvent, ContactInquiry, Introduction, User

router = APIRouter(prefix="/auth/reports")
MAX_DAYS = 366
WORKLOAD_LIMIT = 50


def period(start, end, today):
    if (start is None) != (end is None):
        raise HTTPException(422, "Choose both a start and an end date.")
    if start is None:
        return today - timedelta(days=29), today
    try:
        if not all(re.fullmatch(r"[0-9]{4}-[0-9]{2}-[0-9]{2}", value) for value in (start, end)):
            raise ValueError
        first, last = date.fromisoformat(start), date.fromisoformat(end)
        if first > last or last > today or (last - first).days >= MAX_DAYS:
            raise ValueError
    except ValueError:
        raise HTTPException(422, "Choose valid dates in YYYY-MM-DD order, up to today and at most 366 days apart (inclusive).") from None
    return first, last


def count(model, *conditions):
    return select(func.count()).select_from(model).where(*conditions).scalar_subquery()


def report(db, start, end):
    stamp = now()
    first, last = period(start, end, stamp.date())
    lower = datetime.combine(first, time.min, timezone.utc)
    upper = datetime.combine(last + timedelta(days=1), time.min, timezone.utc)

    def during(column):
        return column >= lower, column < upper

    active = ContactInquiry.status != "closed"
    due = ContactInquiry.follow_up_on <= stamp.date()
    metrics = {}
    for key, model, statuses in [
        ("applications", Introduction, ("new", "reviewing", "waiting")),
        ("inquiries", ContactInquiry, ("open", "in_progress", "closed")),
    ]:
        metrics[key + "_total"] = count(model, *during(model.created_at))
        for status in statuses:
            metrics[key + "_" + status] = count(model, *during(model.created_at), model.status == status)
    for status in ("draft", "published", "archived"):
        metrics["directory_" + status] = count(Business, Business.status == status)
    for action in ("imported", "created", "saved", "publish", "archive", "restore"):
        metrics["activity_" + action] = count(BusinessEvent, *during(BusinessEvent.created_at), BusinessEvent.action == action)
    for role in ("admin", "staff", "member"):
        for enabled in (True, False):
            conditions = [User.role == ("member" if role == "staff" else role), User.active.is_(enabled)]
            if role != "admin": conditions.append(User.capabilities != [] if role == "staff" else User.capabilities == [])
            metrics[f"accounts_{role}_{'active' if enabled else 'inactive'}"] = count(User, *conditions)
    metrics.update({
        "workload_active": count(ContactInquiry, active),
        "workload_due": count(ContactInquiry, active, due),
        "workload_overdue": count(ContactInquiry, active, ContactInquiry.follow_up_on < stamp.date()),
        "workload_unassigned": count(ContactInquiry, active, ContactInquiry.assignee_id.is_(None)),
    })
    workload = select(
        ContactInquiry.assignee_id.label("id"), User.name.label("name"), User.active.label("active_account"),
        func.count().label("active"), func.count().filter(due).label("due"),
    ).outerjoin(User, User.id == ContactInquiry.assignee_id).where(active).group_by(
        ContactInquiry.assignee_id, User.name, User.active,
    ).subquery()
    # Bound the detail payload. Totals include everyone; coverage is explicit in UI/export.
    limited = select(workload).order_by(workload.c.due.desc(), workload.c.active.desc(), workload.c.id.asc().nullsfirst()).limit(WORKLOAD_LIMIT).subquery()
    metrics["workload_groups"] = select(func.count()).select_from(workload).scalar_subquery()
    metrics["workload_rows"] = select(func.json_agg(func.row_to_json(limited.table_valued()))).scalar_subquery()
    try:
        db.execute(text("SET LOCAL statement_timeout = '5s'"))
        # One SELECT gives all counts and workload groups the same PostgreSQL snapshot.
        values = dict(db.execute(select(*(value.label(key) for key, value in metrics.items()))).mappings().one())
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(503, "The report is unavailable. Try again in a moment.") from None

    def section(prefix):
        return {key.removeprefix(prefix + "_"): value for key, value in values.items() if key.startswith(prefix + "_")}

    return {"generated_at": stamp.isoformat(), "period": {"start": first.isoformat(), "end": last.isoformat()},
            "applications": section("applications"), "inquiries": section("inquiries"),
            "directory": section("directory"), "directory_activity": section("activity"),
            "accounts": section("accounts"), "workload": {**section("workload"), "rows": values["workload_rows"] or []}}


def csv_cell(value):
    if not isinstance(value, str):
        return value
    normalized = unicodedata.normalize("NFKC", value).lstrip()
    controls = any(unicodedata.category(char) in {"Cc", "Cf"} for char in value)
    if controls or normalized.startswith(("=", "+", "-", "@")):
        # A visible text prefix survives spreadsheet re-saving better than quote-only escapes.
        value = "Text: " + "".join(" " if unicodedata.category(char) in {"Cc", "Cf"} else char for char in value)
    return value


def csv_report(data):
    output = io.StringIO(newline="")
    writer = csv.writer(output, quoting=csv.QUOTE_ALL)
    writer.writerow(["Section", "Metric", "Count", "Scope", "From (UTC)", "Through (UTC)", "Generated (UTC)"])

    def row(section, label, value, scope):
        writer.writerow([csv_cell(item) for item in (section, label, value, scope,
            data["period"]["start"] if scope == "Selected dates" else "",
            data["period"]["end"] if scope == "Selected dates" else "", data["generated_at"])])

    definitions = [
        ("applications", "Applications received — current status", "Selected dates", {"total": "Received", "new": "New", "reviewing": "Reviewing", "waiting": "Waiting for information"}),
        ("inquiries", "Inquiries received — current status", "Selected dates", {"total": "Received", "open": "Open", "in_progress": "In progress", "closed": "Closed"}),
        ("directory_activity", "Directory actions", "Selected dates", {"imported": "Imported existing listings", "created": "Created drafts", "saved": "Saved drafts", "publish": "Published", "archive": "Archived", "restore": "Restored"}),
        ("directory", "Directory snapshot", "Current, all dates", {"draft": "Draft", "published": "Published", "archived": "Archived"}),
        ("accounts", "Account access, not membership", "Current, all dates", {"admin_active": "Active administrators", "admin_inactive": "Inactive administrators", "staff_active": "Active staff", "staff_inactive": "Inactive staff", "member_active": "Active member accounts", "member_inactive": "Inactive member accounts"}),
        ("workload", "Inquiry workload", "Current, all dates", {"active": "Open and in progress", "due": "Due today or earlier", "overdue": "Overdue", "unassigned": "Unassigned"}),
    ]
    for key, title, scope, labels in definitions:
        for field, label in labels.items():
            row(title, label, data[key][field], scope)
    for group in data["workload"]["rows"]:
        name = group["name"] if group["id"] is not None else "Unassigned"
        title = f"Assignee #{group['id']}" if group["id"] is not None else "Unassigned"
        row(title + " — open and in progress", name, group["active"], "Current, all dates")
        row(title + " — due today or earlier", name, group["due"], "Current, all dates")
    row("Workload coverage", "Assignee groups shown, ordered by due then active count", len(data["workload"]["rows"]), "Current, all dates")
    row("Workload coverage", "Total assignee groups", data["workload"]["groups"], "Current, all dates")
    return "\ufeff" + output.getvalue()


@router.get("")
def overview(user: ReportReader, db: DB, start: str | None = Query(None, max_length=10), end: str | None = Query(None, max_length=10)):
    throttle("reports:" + str(user.id), 60, 60)
    return report(db, start, end)


@router.get("/export")
def export(user: ReportReader, db: DB, start: str | None = Query(None, max_length=10), end: str | None = Query(None, max_length=10)):
    throttle("report-export:" + str(user.id), 20)
    data = report(db, start, end)
    filename = f"wisconnect-report-{data['period']['start']}-to-{data['period']['end']}.csv"
    return Response(csv_report(data), media_type="text/csv; charset=utf-8",
                    headers={"Content-Disposition": f'attachment; filename="{filename}"'})
