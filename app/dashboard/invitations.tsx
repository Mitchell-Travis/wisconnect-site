"use client";
import LocalInboxLink from '../local-inbox-link';

import { useEffect, useRef, useState } from "react";
import Icon from "./workspace-icon";
import DataState from "./data-state";
import styles from "./dashboard.module.css";

export type Invitation = { id: number; email: string; expires_at: string; status: string; source_application_id?: number | null };

export function InviteDialog({ sendInvitation, onSent, onClose }: {
  sendInvitation: (email: string) => Promise<{ message: string }>; onSent: () => void; onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const submitting = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const doneButton = useRef<HTMLButtonElement>(null);

  useEffect(() => { if (success) doneButton.current?.focus(); }, [success]);

  useEffect(() => {
    const element = dialog.current;
    const trigger = document.activeElement as HTMLElement | null;
    element?.showModal();
    element?.querySelector<HTMLInputElement>("input")?.focus();
    return () => { element?.close(); if (trigger?.isConnected) trigger.focus(); };
  }, []);

  return <dialog ref={dialog} className={`${styles.inviteDialog} ${styles.inviteMemberDialog}`} aria-labelledby="invite-dialog-title" aria-describedby="invite-dialog-description" onCancel={event => { event.preventDefault(); if (!submitting.current) onClose(); }} onClick={event => {
    if (event.target !== event.currentTarget || submitting.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
  }}>
    <header className={styles.inviteMemberHeader}>
      <div className={styles.inviteDialogHeading}><h2 id="invite-dialog-title">Invite member</h2><button type="button" aria-label="Close invitation" disabled={pending} onClick={onClose}><Icon kind="close" /></button></div>
      <p id="invite-dialog-description">Invite someone to create a workspace account. Cooperative membership is decided separately.</p>
    </header>
    {success ? <>
      <div className={styles.inviteMemberBody}>
        <div className={styles.inviteMemberSuccess} role="status"><span><Icon kind="email" /></span><div><h3>Invitation sent</h3><p>{success}</p></div></div>
        <p className={styles.inviteMemberHint}>The link can be used once and expires after 24 hours.</p>
      </div>
      <footer className={styles.inviteMemberFooter}><LocalInboxLink className={styles.textButton}>Local email inbox <Icon kind="external" /></LocalInboxLink><button ref={doneButton} className={styles.primaryAction} type="button" onClick={onClose}>Done</button></footer>
    </> : <form aria-label="Invite a workspace account" aria-busy={pending} onSubmit={async event => {
      event.preventDefault();
      if (submitting.current) return;
      const email = String(new FormData(event.currentTarget).get("email") || "").trim();
      submitting.current = true; setPending(true); setError("");
      try { const result = await sendInvitation(email); setSuccess(result.message); onSent(); }
      catch (err) { setError(err instanceof Error ? err.message : "Could not send the invitation. Try again."); }
      finally { submitting.current = false; setPending(false); }
    }}>
      <div className={styles.inviteMemberBody}>
        <label htmlFor="invite-email">Email address<input autoFocus id="invite-email" name="email" type="email" placeholder="name@example.com" autoComplete="off" autoCapitalize="none" spellCheck={false} required maxLength={254} disabled={pending} aria-describedby="invite-link-help" /></label>
        <p id="invite-link-help" className={styles.inviteMemberHint}>The invitation link can be used once and expires after 24 hours.</p>
        <dl className={styles.inviteMemberRole}><dt>Account role</dt><dd>Member</dd></dl>
        <div className={styles.inviteMemberDelivery}><Icon kind="email" /><div><strong>Local email delivery</strong><p>Invitations go to the local test inbox. No real email is sent.</p></div></div>
        {error && <div className={`${styles.inlineError} ${styles.inviteMemberError}`} role="alert"><strong>Invitation not sent</strong><p>{error}</p></div>}
      </div>
      <footer className={styles.inviteMemberFooter}><button className={styles.secondaryAction} type="button" disabled={pending} onClick={onClose}>Cancel</button><button className={styles.primaryAction} type="submit" disabled={pending}>{pending && <span className={styles.spinner} aria-hidden="true" />}{pending ? "Sending…" : "Send invitation"}</button></footer>
    </form>}
    <span className={styles.visuallyHidden} role="status">{pending ? "Sending invitation…" : ""}</span>
  </dialog>;
}

export function InvitationsList({ loadInvitations, revokeInvitation, version, onInvite }: {
  loadInvitations: (signal: AbortSignal) => Promise<Invitation[]>; revokeInvitation: (id: number) => Promise<void>; version: number; onInvite: () => void;
}) {
  const records = useRef<HTMLDivElement>(null);
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
    setLoading(true); setError(""); setActionError(""); setNotice("");
    loadInvitations(controller.signal).then(rows => { if (!controller.signal.aborted) setInvitations(rows); })
      .catch(err => { if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "Could not load invitations."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [loadInvitations, version, attempt]);

  const ready = !loading && !error;
  return <section className={`${styles.membersDirectory} ${styles.invitationsDirectory}`} aria-label="Recent invitations">
    <div className={styles.directoryPanel}>
      <header className={`${styles.directoryPanelHeading} ${styles.invitationPanelHeading}`}><h2>Recent invitations{ready && <span>{invitations.length}</span>}</h2><button className={styles.secondaryAction} type="button" disabled={loading || revoking !== null} onClick={() => setAttempt(value => value + 1)}>Refresh</button></header>
      <div ref={records} className={styles.directoryResults} aria-busy={loading}>
        {loading ? <InvitationsLoading/> : error ? <DataState state="error" title="Could not load invitations" description={error}><button className={styles.secondaryAction} type="button" onClick={() => setAttempt(value => value + 1)}>Try again</button></DataState> : invitations.length === 0 ? <DataState state="empty" icon="email" title="No invitations yet" description="Invite someone to create a workspace account. Membership is decided separately."><button className={styles.primaryAction} type="button" onClick={onInvite}>Invite member</button></DataState> : <div className={styles.memberTableScroll} role="region" aria-label="Invitation records" tabIndex={0}>
          <table className={styles.memberTable}><caption className={styles.visuallyHidden}>Up to 50 most recent invitations</caption><InvitationColumns/>
            <tbody>{invitations.map(invitation => <tr key={invitation.id} tabIndex={-1} data-invitation-id={invitation.id}>
              <td><div className={styles.memberPerson}><span className={styles.memberAvatar}><Icon kind="email"/></span><strong className={styles.invitationEmail}>{invitation.email}</strong></div>{invitation.source_application_id&&<small>Introduction #{invitation.source_application_id}</small>}</td>
              <td><span className={styles.invitationStatus} data-status={invitation.status}>{({pending:"Pending",used:"Accepted",revoked:"Revoked",expired:"Expired"} as Record<string,string>)[invitation.status] || invitation.status}</span></td>
              <td><span className={styles.invitationExpiry}>Expires </span><time dateTime={invitation.expires_at}>{new Date(invitation.expires_at).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}</time></td>
              <td>{invitation.status === "pending" && <button className={styles.textButton} type="button" disabled={revoking !== null} aria-label={`Revoke invitation for ${invitation.email}`} onClick={async () => {
                if (revokeInFlight.current) return;
                revokeInFlight.current = true; setRevoking(invitation.id); setActionError(""); setNotice("");
                try {
                  await revokeInvitation(invitation.id);
                  setInvitations(rows => rows.map(row => row.id === invitation.id ? { ...row, status: "revoked" } : row));
                  setNotice("Invitation revoked. Its link can no longer be used.");
                  requestAnimationFrame(() => records.current?.querySelector<HTMLElement>(`[data-invitation-id="${invitation.id}"]`)?.focus({preventScroll: true}));
                } catch (err) { setActionError(err instanceof Error ? err.message : "Could not revoke the invitation. Try again."); }
                finally { revokeInFlight.current = false; setRevoking(null); }
              }}>{revoking === invitation.id ? "Revoking…" : "Revoke invitation"}</button>}</td>
            </tr>)}</tbody>
          </table>
        </div>}
      </div>
      {ready && <div className={`${styles.directoryPagination} ${styles.invitationFooter}`}><p>{invitations.length === 50 ? "Showing the 50 most recent invitations" : `${invitations.length} ${invitations.length === 1 ? "invitation" : "invitations"}`}<span>New invitations appear first</span></p><LocalInboxLink className={styles.textButton}>Local email inbox<Icon kind="external"/></LocalInboxLink></div>}
      {actionError && <p className={`${styles.inlineError} ${styles.invitationNotice}`} role="alert">{actionError}</p>}
      {notice && <p className={`${styles.directoryMessage} ${styles.invitationNotice}`} role="status">{notice}</p>}
    </div>
    <p className={styles.profileExplanation}>Invitation links can be used once and expire after 24 hours.</p>
  </section>;
}
function InvitationColumns() {
  return <thead><tr><th scope="col">Recipient</th><th scope="col">Status</th><th scope="col">Expires</th><th scope="col"><span className={styles.visuallyHidden}>Actions</span></th></tr></thead>;
}
function InvitationsLoading() {
  return <div role="status"><span className={styles.visuallyHidden}>Loading invitations…</span><div className={styles.memberTableScroll} aria-hidden="true"><table className={`${styles.memberTable} ${styles.directorySkeleton}`}><InvitationColumns/><tbody>{[0,1,2].map(row => <tr key={row}><td><div className={styles.skeletonPerson}><i/><span><i/></span></div></td><td><i/></td><td><i/></td><td><i/></td></tr>)}</tbody></table></div></div>;
}
