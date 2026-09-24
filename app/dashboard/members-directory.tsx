"use client";

import { useEffect, useRef, useState } from "react";
import type { View } from "./sections";
import styles from "./dashboard.module.css";
import DataState from "./data-state";
import Icon from "./feather-icon";

export type MemberRecord = { id: number; name: string; email: string; role: "admin" | "member"; active: boolean };

export default function MembersDirectory({ loadMembers, deleteMember, onViewChange, onInvite }: {
  deleteMember: (id: number) => Promise<void>;
  onInvite: () => void; loadMembers: (signal: AbortSignal) => Promise<MemberRecord[]>; onViewChange: (view: View) => void;
}) {
  const [selected, setSelected] = useState<MemberRecord | null>(null);
  const [notice, setNotice] = useState("");
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchButton = useRef<HTMLButtonElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError("");
    loadMembers(controller.signal).then(rows => { if (!controller.signal.aborted) setMembers(rows); })
      .catch(err => { if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "Unable to load members."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [loadMembers, attempt]);

  const term = query.trim().toLocaleLowerCase();
  const visible = members.filter(member => `${member.name} ${member.email}`.toLocaleLowerCase().includes(term));
  function closeSearch() { setQuery(""); setSearchOpen(false); requestAnimationFrame(() => searchButton.current?.focus()); }

  return <section className={styles.membersDirectory} aria-label="Member directory">
    <div className={styles.membersToolbar}>
      <div className={styles.memberTabs} role="group" aria-label="Member management">
        <button type="button" aria-current="page">Members {!loading && !error && <span>{members.length}</span>}</button>
        <button type="button" onClick={() => onViewChange("applications")}>Applications</button>
        <button type="button" onClick={() => onViewChange("invitations")}>Invitations</button>
      </div>
      <div className={styles.memberActions}>
        {searchOpen ? <div className={styles.memberSearch}>
          <Icon kind="search" />
          <input ref={searchInput} type="search" aria-label="Search members" placeholder="Search members…" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); closeSearch(); } }} />
          <button type="button" aria-label="Close search" onClick={closeSearch}><Icon kind="close" /></button>
        </div> : <button ref={searchButton} className={styles.searchToggle} type="button" aria-label="Search members" onClick={() => { setSearchOpen(true); requestAnimationFrame(() => searchInput.current?.focus()); }}><Icon kind="search" /></button>}
        <button className={styles.primaryAction} type="button" aria-label="Invite member" onClick={onInvite}><Icon kind="plus" /> Invite</button>
      </div>
    </div>

      <div className={styles.memberTableScroll} role="region" aria-label="Members" tabIndex={0} aria-busy={loading}>
        <table className={styles.memberTable}>
          <caption className={styles.visuallyHidden}>Cooperative member accounts</caption>
          <thead><tr><th scope="col">Member</th><th scope="col">Role</th><th scope="col">Account status</th><th scope="col">Actions</th></tr></thead>
          <tbody>{!loading && !error && visible.map(member => <tr key={member.id}>
            <td><div className={styles.memberPerson}><span className={styles.memberAvatar} aria-hidden="true">{member.name.trim().split(/\s+/).slice(0, 2).map(part => Array.from(part)[0]).join("").toUpperCase()}</span><span><strong>{member.name}</strong><small>{member.email}</small></span></div></td>
            <td>{member.role === "admin" ? "Administrator" : "Member"}</td><td><span className={member.active ? styles.activeAccount : styles.inactiveAccount}>{member.active ? "Active" : "Inactive"}</span></td>
            <td>{member.role === "member" && <button className={styles.deleteMemberAction} type="button" aria-label={`Delete member ${member.name}`} onClick={() => { setNotice(""); setSelected(member); }}>Delete</button>}</td>
          </tr>)}</tbody>
        </table>
      </div>
    {loading ? <DataState state="loading" title="Loading members…" /> : error ? <DataState state="error" title="Could not load members" description={error}><button className={styles.secondaryAction} type="button" onClick={() => setAttempt(value => value + 1)}>Try again</button></DataState> : visible.length === 0 ? <DataState state="empty" title={term ? "No matching members" : "No member accounts yet"} description={term ? "0 members found. Try another name or email." : "Invite an approved member to get started."}>{term ? <button className={styles.secondaryAction} type="button" onClick={closeSearch}>Clear search</button> : <button className={styles.primaryAction} type="button" onClick={onInvite}>Invite a member</button>}</DataState> : <p className={styles.directoryMessage} role="status">{term ? `${visible.length} ${visible.length === 1 ? "member" : "members"} found.` : `${members.length} ${members.length === 1 ? "account" : "accounts"}`}</p>}

    {notice && <p className={styles.directoryMessage} role="status">{notice}</p>}
    {selected && <DeleteMemberDialog member={selected} deleteMember={deleteMember} onClose={() => setSelected(null)} onDeleted={() => {
      setMembers(rows => rows.filter(row => row.id !== selected.id));
      setNotice(`${selected.name}’s account has been deleted.`);
      setSelected(null);
      requestAnimationFrame(() => (searchInput.current || searchButton.current)?.focus());
    }} />}
  </section>;
}


function DeleteMemberDialog({ member, deleteMember, onClose, onDeleted }: {
  member: MemberRecord; deleteMember: (id: number) => Promise<void>; onClose: () => void; onDeleted: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const submitting = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const element = dialog.current;
    const trigger = document.activeElement as HTMLElement | null;
    element?.showModal();
    return () => { element?.close(); if (trigger?.isConnected) trigger.focus(); };
  }, []);

  return <dialog ref={dialog} className={styles.inviteDialog} aria-labelledby="delete-member-title" aria-describedby="delete-member-description" onCancel={event => { event.preventDefault(); if (!submitting.current) onClose(); }}>
    <div className={styles.inviteDialogHeading}><h2 id="delete-member-title">Delete member account?</h2></div>
    <p id="delete-member-description" className={styles.deleteMemberDescription}>Permanently delete <strong>{member.name}</strong> ({member.email})? They will be signed out and lose account access. This cannot be undone. Returning requires a new invitation.</p>
    <form aria-label="Delete member account" aria-busy={pending} onSubmit={async event => {
      event.preventDefault();
      if (submitting.current) return;
      submitting.current = true; setPending(true); setError("");
      try { await deleteMember(member.id); onDeleted(); }
      catch (err) { setError(err instanceof Error ? err.message : "Could not delete the account. Try again."); }
      finally { submitting.current = false; setPending(false); }
    }}>
      {error && <p className={styles.inlineError} role="alert">{error}</p>}
      <div className={styles.dialogActions}>
        <button autoFocus type="button" className={styles.secondaryAction} disabled={pending} onClick={onClose}>Cancel</button>
        <button type="submit" className={`${styles.primaryAction} ${styles.dangerAction}`} disabled={pending}>{pending && <span className={styles.spinner} aria-hidden="true" />}{pending ? "Deleting…" : "Delete account"}</button>
      </div>
    </form>
  </dialog>;
}
