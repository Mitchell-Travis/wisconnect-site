'use client';
import {accessLabel} from '../workspace-access';
import { useEffect, useRef, useState } from 'react';
import { accountRequest } from '../account-api';
import styles from './dashboard.module.css';
import DataState from './data-state';
import Icon from './workspace-icon';
import MemberProfile, { MemberRecord } from './member-profile';
export type { MemberRecord } from './member-profile';
type Directory = {items: MemberRecord[]; total: number; page: number; page_size: number};

export default function MembersDirectory({ onInvite }: { onInvite: () => void }) {
  const searchInput = useRef<HTMLInputElement>(null);
  const restoreFocus = useRef<number | null>(null);
  const directoryElement = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<MemberRecord | null>(null);
  const [directory, setDirectory] = useState<Directory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setError('');
    const params = new URLSearchParams({q: search, status, page: String(page)});
    accountRequest(`/member-directory?${params}`, 'GET', undefined, controller.signal).then(data => { if (!controller.signal.aborted) setDirectory(data); })
      .catch(err => { if (!controller.signal.aborted) setError(err.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [search, status, page, attempt]);
  useEffect(() => {
    if (loading || selected || restoreFocus.current === null) return;
    const button = directoryElement.current?.querySelector<HTMLButtonElement>(`button[data-member-id="${restoreFocus.current}"]`);
    (button || directoryElement.current)?.focus({preventScroll: true});
    restoreFocus.current = null;
  }, [loading, selected, directory]);
  const filtered = Boolean(search || status !== 'all');
  const ready = !loading && !error;
  const clearFilters = () => {setQuery('');setSearch('');setStatus('all');setPage(1);requestAnimationFrame(() => searchInput.current?.focus({preventScroll: true}));};
  return <section ref={directoryElement} tabIndex={-1} className={styles.membersDirectory} aria-label="Member directory">
    <div className={styles.directoryPanel}>
    <header className={styles.directoryPanelHeading}><h2>Member accounts{ready && directory && <span>{directory.total}</span>}</h2><span>{filtered ? 'Filtered results' : 'All accounts'}</span></header>
    <form className={styles.directoryFilters} aria-label="Search members" onSubmit={event => { event.preventDefault(); setSearch(query.trim()); setPage(1); }}>
      <label className={styles.directorySearch}><span className={styles.visuallyHidden}>Search members</span><Icon kind="search"/><input ref={searchInput} type="search" maxLength={100} placeholder="Search by name or email…" value={query} onChange={event => setQuery(event.target.value)}/></label>
      <label><span className={styles.visuallyHidden}>Account status</span><select value={status} onChange={event => {setStatus(event.target.value); setPage(1);}}><option value="all">All accounts</option><option value="active">Active</option><option value="inactive">Inactive</option></select></label>
      <button className={styles.secondaryAction} type="submit">Search</button>
      {(search || status !== 'all') && <button className={styles.textButton} type="button" onClick={clearFilters}>Clear filters</button>}
    </form>
    <div className={styles.directoryResults} aria-busy={loading}>
    {loading ? <DirectoryLoading/> : error ? <DataState state="error" title="Could not load members" description={error}><button className={styles.secondaryAction} onClick={() => setAttempt(value => value + 1)}>Try again</button></DataState> : <>
      {directory?.items.length ? <div className={styles.memberTableScroll} role="region" aria-label="Members" tabIndex={0}><table className={styles.memberTable}><caption className={styles.visuallyHidden}>Cooperative accounts</caption>
        <DirectoryColumns/>
        <tbody>{directory.items.map(member => <tr key={member.id}><td><div className={styles.memberPerson}><span className={styles.memberAvatar} aria-hidden="true">{member.name.trim().split(/\s+/).slice(0, 2).map(part => Array.from(part)[0]).join('').toUpperCase()}</span><span><strong>{member.name}</strong><small>{member.email}</small></span></div></td><td><span className={styles.roleBadge}>{accessLabel(member)}</span></td><td><span className={member.active ? styles.activeAccount : styles.inactiveAccount}>{member.active ? 'Active' : 'Inactive'}</span></td><td><button data-member-id={member.id} className={styles.textButton} aria-label={`View profile for ${member.name}`} onClick={() => setSelected(member)}>View profile<Icon kind="chevron"/></button></td></tr>)}</tbody>
      </table></div> : <DirectoryEmpty filtered={filtered} page={page} onClear={clearFilters} onInvite={onInvite} onFirstPage={() => setPage(1)}/> }
      <div className={styles.directoryPagination}><p role="status">{directory?.total || 0} {directory?.total === 1 ? 'account' : 'accounts'}{Boolean(directory?.total) && <> · Page {page} of {Math.max(1, Math.ceil((directory?.total || 0) / (directory?.page_size || 25)))}</>}</p>{(Boolean(directory?.total) || page > 1) && <div className={styles.paginationActions}><button className={styles.secondaryAction} disabled={page === 1} onClick={() => setPage(value => value - 1)}>Previous</button><button className={styles.secondaryAction} disabled={!directory || page * directory.page_size >= directory.total} onClick={() => setPage(value => value + 1)}>Next</button></div>}</div>
    </>}
    </div>
    </div>
    <p className={styles.profileExplanation}>Account access is separate from membership approval and dues.</p>
    {selected && <ProfileDialog member={selected} onClose={() => {restoreFocus.current = selected.id;setLoading(true);setSelected(null);setAttempt(value => value + 1);}}/>}
  </section>;
}
function DirectoryColumns() {
  return <thead><tr><th scope="col">Member</th><th scope="col">Role</th><th scope="col">Account status</th><th scope="col"><span className={styles.visuallyHidden}>Actions</span></th></tr></thead>;
}
export function DirectoryLoading() {
  return <div role="status">
    <span className={styles.visuallyHidden}>Loading members…</span>
    <div className={styles.memberTableScroll} aria-hidden="true"><table className={`${styles.memberTable} ${styles.directorySkeleton}`}><DirectoryColumns/><tbody>{[0,1,2].map(row => <tr key={row}>
      <td><div className={styles.skeletonPerson}><i/><span><i/><i/></span></div></td><td><i/></td><td><i/></td><td><i/></td>
    </tr>)}</tbody></table></div>
  </div>;
}
export function DirectoryEmpty({filtered, page, onClear, onInvite, onFirstPage}: {filtered: boolean; page: number; onClear: () => void; onInvite: () => void; onFirstPage: () => void}) {
  const pastEnd = page > 1;
  return <DataState state="empty" icon={filtered ? 'search' : 'people'} title={pastEnd ? 'No accounts on this page' : filtered ? 'No matching accounts' : 'No accounts yet'} description={pastEnd ? 'The directory has changed. Return to the first page to see current accounts.' : filtered ? 'Try another name or email, or clear your filters to see all accounts.' : 'Invite an approved member to give them access to the workspace.'}>
    <button className={filtered || pastEnd ? styles.secondaryAction : styles.primaryAction} type="button" onClick={pastEnd ? onFirstPage : filtered ? onClear : onInvite}>{pastEnd ? 'Back to first page' : filtered ? 'Clear filters' : 'Invite member'}</button>
  </DataState>;
}
function ProfileDialog({member, onClose}: {member: MemberRecord; onClose: () => void}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {const element = dialog.current; const trigger = document.activeElement as HTMLElement; element?.showModal(); return () => {element?.close(); if (trigger?.isConnected) trigger.focus();};}, []);
  return <dialog ref={dialog} className={`${styles.inviteDialog} ${styles.profileDialog}`} aria-labelledby="member-profile-title" onCancel={event => {event.preventDefault();onClose();}}>
    <header className={styles.inviteMemberHeader}><div className={styles.inviteDialogHeading}><h2 id="member-profile-title">Member profile</h2><button autoFocus type="button" aria-label="Close member profile" onClick={onClose}><Icon kind="close"/></button></div><p>Personal details and account access.</p></header>
    <MemberProfile memberId={member.id}/>
  </dialog>;
}
