"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./feather-icon";
import DataState from "./data-state";
import styles from "./dashboard.module.css";

export type Invitation = { id: number; email: string; expires_at: string; status: string };

export function InviteDialog({ sendInvitation, onSent, onClose }: {
  sendInvitation: (email: string) => Promise<{ message: string }>; onSent: () => void; onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const submitting = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const element = dialog.current;
    const trigger = document.activeElement as HTMLElement | null;
    element?.showModal();
    element?.querySelector<HTMLInputElement>("input")?.focus();
    return () => { element?.close(); if (trigger?.isConnected) trigger.focus(); };
  }, []);

  return <dialog ref={dialog} className={styles.inviteDialog} aria-labelledby="invite-dialog-title" aria-describedby="invite-dialog-description" onCancel={event => { event.preventDefault(); if (!submitting.current) onClose(); }} onClick={event => {
    if (event.target !== event.currentTarget || submitting.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
  }}>
    <div className={styles.inviteDialogHeading}><h2 id="invite-dialog-title">Invite a member</h2><button type="button" aria-label="Close invitation" disabled={pending} onClick={onClose}><Icon kind="close" /></button></div>
    <p id="invite-dialog-description">Invite someone whose cooperative membership has been approved.</p>
    {success ? <>
      <div className={styles.inviteSuccess} role="status"><Icon kind="email" /><h3>Invitation sent</h3><p>{success}</p></div>
      <a className={styles.textButton} href="http://localhost:8025" target="_blank" rel="noreferrer">Open local email inbox <Icon kind="external" /></a>
      <div className={styles.dialogActions}><button autoFocus className={styles.primaryAction} type="button" onClick={onClose}>Done</button></div>
    </> : <form aria-label="Invite an approved member" aria-busy={pending} onSubmit={async event => {
      event.preventDefault();
      if (submitting.current) return;
      const email = String(new FormData(event.currentTarget).get("email") || "").trim();
      submitting.current = true; setPending(true); setError("");
      try { const result = await sendInvitation(email); setSuccess(result.message); onSent(); }
      catch (err) { setError(err instanceof Error ? err.message : "Could not send the invitation. Try again."); }
      finally { submitting.current = false; setPending(false); }
    }}>
      <label htmlFor="invite-email">Email<input autoFocus id="invite-email" name="email" type="email" placeholder="name@example.com" autoComplete="off" required maxLength={254} disabled={pending} /></label>
      <div className={styles.inviteRole}><span>Account role</span><strong>Member</strong></div>
      <p className={styles.inviteDelivery}>One-use link, valid for 24 hours. Delivered to the local test inbox; no real email is sent.</p>
      {error && <p className={styles.inlineError} role="alert">{error}</p>}
      <div className={styles.dialogActions}><button className={styles.secondaryAction} type="button" disabled={pending} onClick={onClose}>Cancel</button><button className={styles.primaryAction} type="submit" disabled={pending}>{pending && <span className={styles.spinner} aria-hidden="true" />}{pending ? "Sending invitation…" : "Send invitation"}</button></div>
    </form>}
  </dialog>;
}

export function InvitationsList({ loadInvitations, revokeInvitation, version, onInvite }: {
  loadInvitations: (signal: AbortSignal) => Promise<Invitation[]>; revokeInvitation: (id: number) => Promise<void>; version: number; onInvite: () => void;
}) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [revoking, setRevoking] = useState<number | null>(null);
  const revokeInFlight = useRef(false);
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError("");
    loadInvitations(controller.signal).then(rows => { if (!controller.signal.aborted) setInvitations(rows); })
      .catch(err => { if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "Could not load invitations."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [loadInvitations, version, attempt]);

  return <section aria-label="Recent invitations">
    {loading ? <DataState state="loading" title="Loading invitations…" /> : error ? <DataState state="error" title="Could not load invitations" description={error}><button className={styles.secondaryAction} type="button" onClick={() => setAttempt(value => value + 1)}>Try again</button></DataState> : invitations.length === 0 ? <DataState state="empty" title="No invitations yet" description="Invite an approved member to join your cooperative workspace."><button className={styles.primaryAction} type="button" onClick={onInvite}>Invite a member</button></DataState> : <div className={styles.memberTableScroll} role="region" aria-label="Invitation records" tabIndex={0}>
      <table className={styles.memberTable}><caption className={styles.visuallyHidden}>Recent invitations</caption><thead><tr><th scope="col">Email</th><th scope="col">Status</th><th scope="col">Expires</th><th scope="col"><span className={styles.visuallyHidden}>Actions</span></th></tr></thead>
        <tbody>{invitations.map(invitation => <tr key={invitation.id}><td>{invitation.email}</td><td>{invitation.status}</td><td>{new Date(invitation.expires_at).toLocaleDateString()}</td><td>{invitation.status === "pending" && <button className={styles.textButton} type="button" disabled={revoking !== null} aria-label={`Revoke invitation for ${invitation.email}`} onClick={async () => {
          if (revokeInFlight.current) return;
          revokeInFlight.current = true; setRevoking(invitation.id); setActionError(""); setNotice("");
          try { await revokeInvitation(invitation.id); setInvitations(rows => rows.map(row => row.id === invitation.id ? { ...row, status: "revoked" } : row)); setNotice("Invitation revoked. Its link can no longer be used."); }
          catch (err) { setActionError(err instanceof Error ? err.message : "Could not revoke the invitation. Try again."); }
          finally { revokeInFlight.current = false; setRevoking(null); }
        }}>{revoking === invitation.id ? "Revoking…" : "Revoke"}</button>}</td></tr>)}</tbody>
      </table>
    </div>}
    {actionError && <p className={styles.inlineError} role="alert">{actionError}</p>}
    {notice && <p className={styles.directoryMessage} role="status">{notice}</p>}
  </section>;
}
