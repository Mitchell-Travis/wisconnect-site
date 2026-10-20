"""Explicit staff grants. Full administrators retain all implemented capabilities."""
from .models import User

CAPABILITIES = {
    "businesses.edit": ("Edit businesses", "Read private business details and create or edit drafts."),
    "businesses.publish": ("Publish businesses", "Publish, archive and restore listings. Requires business editing."),
    "applications.review": ("Review applications", "Read introductions, assign reviewers and add private review notes."),
    "invitations.manage": ("Manage invitations", "Invite workspace accounts and revoke pending invitations. Does not grant membership."),
    "inquiries.manage": ("Manage inquiries", "Read contact messages, assign follow-up, add notes and retry notifications."),
    "reports.view": ("View and export reports", "Read operational summaries and staff workload; download their CSV reports."),
}


def capabilities(user):
    return sorted(CAPABILITIES) if user.role == "admin" else sorted(set(user.capabilities or []) & CAPABILITIES.keys())


def allowed(user, capability):
    return bool(user and user.active and capability in capabilities(user))


def eligible(capability):
    return User.active.is_(True) & ((User.role == "admin") | User.capabilities.contains([capability]))
