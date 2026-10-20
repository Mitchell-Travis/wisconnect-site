"use client";

import { useEffect, useRef, useState } from "react";
import { accountRequest } from "../account-api";
import { reportCsv, type Report } from "./reports-api";
import DataState from "./data-state";
import styles from "./dashboard.module.css";

const displayDate = (value: string) => new Date(`${value}T00:00:00Z`).toLocaleDateString(undefined, {month: "short", day: "numeric", year: "numeric", timeZone: "UTC"});
const number = (value: number) => value.toLocaleString();

function Metrics({items}: {items: [string, number][]}) {
  return <dl className={styles.reportMetrics}>{items.map(([label, count]) => <div key={label}><dt>{label}</dt><dd>{number(count)}</dd></div>)}</dl>;
}

export default function Reports({request = accountRequest, exportCsv = reportCsv}: {request?: typeof accountRequest; exportCsv?: typeof reportCsv}) {
  const [data, setData] = useState<Report | null>(null);
  const [dates, setDates] = useState({start: "", end: ""});
  const [query, setQuery] = useState({start: "", end: ""});
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exportError, setExportError] = useState("");
  const [notice, setNotice] = useState("");
  const [exporting, setExporting] = useState(false);
  const download = useRef<AbortController | null>(null);
  useEffect(() => () => download.current?.abort(), []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setData(null); setError(""); setExportError(""); setNotice("");
    request(`/reports${query.start ? `?${new URLSearchParams(query)}` : ""}`, "GET", undefined, controller.signal)
      .then((result: Report) => {if (!controller.signal.aborted) {setData(result); setDates(result.period);}})
      .catch(reason => {if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "Could not load the report.");})
      .finally(() => {if (!controller.signal.aborted) setLoading(false);});
    return () => controller.abort();
  }, [query.start, query.end, attempt, request]);

  const changed = data && (dates.start !== data.period.start || dates.end !== data.period.end);
  function apply(value = dates) {setQuery(value); setAttempt(value => value + 1);}
  function preset(days: number | "month") {
    const end = new Date(); const start = new Date(end);
    if (days === "month") start.setUTCDate(1); else start.setUTCDate(start.getUTCDate() - days + 1);
    const range = {start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10)};
    setDates(range); apply(range);
  }
  async function exportReport() {
    if (!data || download.current) return;
    const controller = new AbortController(); download.current = controller;
    setExporting(true); setExportError(""); setNotice("");
    try {
      const blob = await exportCsv(data.period.start, data.period.end, controller.signal);
      if (controller.signal.aborted) return;
      const url = URL.createObjectURL(blob); const link = document.createElement("a");
      link.href = url; link.download = `wisconnect-report-${data.period.start}-to-${data.period.end}.csv`;
      document.body.append(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice("CSV download started. It contains a fresh snapshot for the displayed date range.");
    } catch (reason) {
      if (!controller.signal.aborted) setExportError(reason instanceof Error ? reason.message : "Could not export the report.");
    } finally {download.current = null; if (!controller.signal.aborted) setExporting(false);}
  }

  return <section className={styles.reports} aria-label="Operational reports">
    <form className={styles.reportFilters} onSubmit={event => {event.preventDefault(); apply();}}>
      <fieldset disabled={loading || exporting}>
        <legend>Activity dates</legend>
        <div className={styles.reportPresets} role="group" aria-label="Date presets">
          <button type="button" onClick={() => preset(7)}>Last 7 days</button><button type="button" onClick={() => preset(30)}>Last 30 days</button><button type="button" onClick={() => preset("month")}>This month</button>
        </div>
        <div className={styles.reportDates}>
          <label>From<input type="date" required value={dates.start} max={dates.end || undefined} onChange={event => setDates(old => ({...old, start: event.target.value}))}/></label>
          <label>Through<input type="date" required value={dates.end} min={dates.start || undefined} onChange={event => setDates(old => ({...old, end: event.target.value}))}/></label>
          <button className={styles.primaryAction} type="submit">Apply dates</button>
        </div>
      </fieldset>
      <p>UTC calendar days · Up to 366 days, through today.</p>
      {changed && <p role="status">Apply dates to update the report and export.</p>}
    </form>
    {loading ? <DataState state="loading" title="Preparing your report…"/> : error ? <DataState state="error" title="Could not load the report" description={error}><button className={styles.secondaryAction} onClick={() => setAttempt(value => value + 1)}>Try again</button></DataState> : data && <>
      <header className={styles.reportHeading}>
        <div><h2>{displayDate(data.period.start)} – {displayDate(data.period.end)}</h2><p>Generated {new Date(data.generated_at).toLocaleString(undefined, {timeZone: "UTC"})} UTC</p></div>
        <div className={styles.reportActions}><button className={styles.secondaryAction} disabled={exporting || Boolean(changed)} onClick={() => apply(data.period)}>Refresh</button><button className={styles.secondaryAction} disabled={exporting || Boolean(changed)} onClick={exportReport}>{exporting ? "Preparing CSV…" : "Export CSV"}</button></div>
      </header>
      {exportError && <p className={styles.error} role="alert">{exportError} <button className={styles.textButton} disabled={exporting || Boolean(changed)} onClick={exportReport}>Retry export</button></p>}
      {notice && <p className={styles.reportNote} role="status">{notice}</p>}
      <p className={styles.reportNote}>Date filters cover submissions and directory actions. Statuses show their current state.</p>
      <div className={styles.reportGrid}>
        <section className={styles.reportPanel} aria-labelledby="report-applications"><h3 id="report-applications">Applications received</h3><p className={styles.reportTotal}>{number(data.applications.total)}<span> introductions in this period</span></p><Metrics items={[["New", data.applications.new], ["Reviewing", data.applications.reviewing], ["Waiting for information", data.applications.waiting]]}/>{data.applications.total === 0 && <p>No introductions received in this period.</p>}</section>
        <section className={styles.reportPanel} aria-labelledby="report-inquiries"><h3 id="report-inquiries">Inquiries received</h3><p className={styles.reportTotal}>{number(data.inquiries.total)}<span> messages in this period</span></p><Metrics items={[["Open", data.inquiries.open], ["In progress", data.inquiries.in_progress], ["Closed", data.inquiries.closed]]}/>{data.inquiries.total === 0 && <p>No inquiries received in this period.</p>}</section>
        <section className={styles.reportPanel} aria-labelledby="report-directory-actions"><h3 id="report-directory-actions">Directory activity</h3><p>Actions recorded in this period, including repeat edits.</p><Metrics items={[["New drafts", data.directory_activity.created], ["Draft saves", data.directory_activity.saved], ["Publishes", data.directory_activity.publish], ["Archives", data.directory_activity.archive], ["Restores", data.directory_activity.restore], ["Existing listings imported", data.directory_activity.imported]]}/></section>
      </div>
      <header className={styles.reportHeading}><div><h2>Current snapshot</h2><p>All dates · These totals are independent of the date filter.</p></div></header>
      <section className={styles.reportPanel} aria-labelledby="report-workload"><h3 id="report-workload">Inquiry follow-up</h3><Metrics items={[["Open and in progress", data.workload.active], ["Due today or earlier", data.workload.due], ["Overdue", data.workload.overdue], ["Unassigned", data.workload.unassigned]]}/>
        {data.workload.rows.length ? <><div className={styles.reportTable}><table><caption>Outstanding inquiries by assignee</caption><thead><tr><th scope="col">Assignee</th><th scope="col">Active</th><th scope="col">Due</th></tr></thead><tbody>{data.workload.rows.map(row => <tr key={row.id ?? "unassigned"}><th scope="row">{row.name ?? "Unassigned"}{row.id !== null && !row.active_account && <small>Inactive account</small>}</th><td>{number(row.active)}</td><td>{number(row.due)}</td></tr>)}</tbody></table></div><p>Showing {data.workload.rows.length} of {data.workload.groups} assignee groups · Ordered by due, then active count.</p></> : <p>No outstanding inquiries.</p>}
      </section>
      <div className={styles.reportGrid}>
        <section className={styles.reportPanel} aria-labelledby="report-directory"><h3 id="report-directory">Business directory</h3><Metrics items={[["Published", data.directory.published], ["Draft", data.directory.draft], ["Archived", data.directory.archived]]}/></section>
        <section className={styles.reportPanel} aria-labelledby="report-accounts"><h3 id="report-accounts">Account access</h3><p>Sign-in access, separate from cooperative membership.</p><Metrics items={[["Active administrators", data.accounts.admin_active], ["Inactive administrators", data.accounts.admin_inactive], ["Active staff", data.accounts.staff_active], ["Inactive staff", data.accounts.staff_inactive], ["Active member accounts", data.accounts.member_active], ["Inactive member accounts", data.accounts.member_inactive]]}/></section>
      </div>
      <p className={styles.reportNote}>CSV includes these summaries and the displayed assignee groups, freshly generated at download time. Private messages, notes and contact details are excluded.</p>
    </>}
  </section>;
}
