"use client";

import { useEffect, useRef, useState } from "react";
import type { View } from "./sections";
import styles from "./dashboard.module.css";
import DataState from "./data-state";
import Icon from "./feather-icon";

export type MemberRecord = { id: number; name: string; email: string; role: "admin" | "member"; active: boolean };

export default function MembersDirectory({ loadMembers, onViewChange, onInvite }: {
  onInvite: () => void; loadMembers: (signal: AbortSignal) => Promise<MemberRecord[]>; onViewChange: (view: View) => void;
}) {
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
          <thead><tr><th scope="col">Member</th><th scope="col">Role</th><th scope="col">Account status</th></tr></thead>
          <tbody>{!loading && !error && visible.map(member => <tr key={member.id}>
            <td><div className={styles.memberPerson}><span className={styles.memberAvatar} aria-hidden="true">{member.name.trim().split(/\s+/).slice(0, 2).map(part => Array.from(part)[0]).join("").toUpperCase()}</span><span><strong>{member.name}</strong><small>{member.email}</small></span></div></td>
            <td>{member.role === "admin" ? "Administrator" : "Member"}</td><td><span className={member.active ? styles.activeAccount : styles.inactiveAccount}>{member.active ? "Active" : "Inactive"}</span></td>
          </tr>)}</tbody>
        </table>
      </div>
    {loading ? <DataState state="loading" title="Loading members…" /> : error ? <DataState state="error" title="Could not load members" description={error}><button className={styles.secondaryAction} type="button" onClick={() => setAttempt(value => value + 1)}>Try again</button></DataState> : visible.length === 0 ? <DataState state="empty" title={term ? "No matching members" : "No member accounts yet"} description={term ? "0 members found. Try another name or email." : "Invite an approved member to get started."}>{term ? <button className={styles.secondaryAction} type="button" onClick={closeSearch}>Clear search</button> : <button className={styles.primaryAction} type="button" onClick={onInvite}>Invite a member</button>}</DataState> : <p className={styles.directoryMessage} role="status">{term ? `${visible.length} ${visible.length === 1 ? "member" : "members"} found.` : `${members.length} ${members.length === 1 ? "account" : "accounts"}`}</p>}

  </section>;
}
