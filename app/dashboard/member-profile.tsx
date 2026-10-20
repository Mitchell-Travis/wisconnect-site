'use client';
import { useEffect, useRef, useState } from 'react';
import { accountRequest } from '../account-api';
import styles from './dashboard.module.css';
import DataState from './data-state';
import Icon from './workspace-icon';

export type MemberRecord = { id: number; name: string; email: string; role: 'admin' | 'member'; active: boolean; capabilities?: string[]; phone: string; location: string; bio: string; version: number };
type Detail = MemberRecord & { events?: { id: number; action: string; actor_id: number | null; created_at: string }[] };
const activityLabels: Record<string, string> = { profile_updated: 'Profile updated', account_deactivated: 'Account deactivated', account_reactivated: 'Account reactivated', password_reset_requested: 'Password reset requested', password_reset_completed: 'Password reset completed', team_access_changed: 'Team access changed' };
Object.assign(activityLabels, { signed_in: 'Signed in', signed_out: 'Signed out', session_revoked: 'Session signed out', other_sessions_revoked: 'Other sessions signed out' });

export default function MemberProfile({ memberId, onSaved, request = accountRequest }: { memberId?: number; onSaved?: (member: MemberRecord) => void; request?: typeof accountRequest }) {
  const path = memberId === undefined ? '/profile' : `/members/${memberId}/profile`;
  const [record, setRecord] = useState<Detail | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [confirmAccess, setConfirmAccess] = useState(false);
  const pending = useRef(false);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(''); setNotice(''); setConfirmAccess(false);
    request(path, 'GET', undefined, controller.signal).then(data => { if (!controller.signal.aborted) setRecord(data); })
      .catch(err => { if (!controller.signal.aborted) setError(err.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [path, attempt, request]);
  async function save(body: object, endpoint = path) {
    if (pending.current) return;
    const trigger = document.activeElement as HTMLElement | null;
    pending.current = true; setSaving(true); setError(''); setNotice('');
    try {
      const updated = await request(endpoint, 'PATCH', body);
      setRecord(updated); setConfirmAccess(false); onSaved?.(updated);
      setNotice(endpoint.endsWith('/access') ? (updated.active ? 'Account reactivated. A fresh sign-in is required.' : 'Account deactivated. All sessions have been signed out.') : 'Profile saved.');
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not save this profile.'); }
    finally { pending.current = false; setSaving(false); requestAnimationFrame(() => { if (trigger?.isConnected) trigger.focus({preventScroll: true}); }); }
  }
  if (loading) return <ProfileLoading/>;
  if (!record) return <div className={styles.profileFormPanel}><DataState state="error" title="Could not load profile" description={error}><button className={styles.secondaryAction} onClick={() => setAttempt(value => value + 1)}>Try again</button></DataState></div>;
  const editable = memberId === undefined || record.role !== 'admin';
  return <div className={styles.profileEditor}>
    <form key={`${record.id}-${attempt}`} className={`${styles.accountForm} ${styles.profileFormPanel}`} aria-label="Edit member profile" aria-busy={saving} onSubmit={event => {
      event.preventDefault(); const data = new FormData(event.currentTarget);
      void save({name: data.get('name'), phone: data.get('phone'), location: data.get('location'), bio: data.get('bio'), version: record.version});
    }}>
      <header className={styles.profilePanelHeading}><h3>Personal details</h3><p>Visible only to the account holder and administrators.</p></header>
      <div className={styles.profileFormBody}>
        <fieldset disabled={saving || !editable} className={styles.profileFields}>
          <legend className={styles.visuallyHidden}>Personal details</legend>
          <label>Name<input name="name" required maxLength={100} defaultValue={record.name} autoComplete="name"/></label>
          <label>Email address<input type="email" value={record.email} readOnly/><small>Sign-in email cannot be changed here.</small></label>
          <label><span>Phone <small>(optional)</small></span><input type="tel" name="phone" maxLength={40} defaultValue={record.phone} autoComplete="tel"/></label>
          <label><span>Location <small>(optional)</small></span><input name="location" maxLength={160} defaultValue={record.location} placeholder="City and country"/></label>
          <label className={styles.profileBio}><span>About you <small>(optional)</small></span><textarea name="bio" rows={4} maxLength={2000} defaultValue={record.bio}/></label>
        </fieldset>
        {!editable && <p className={styles.profileReadOnly}><Icon kind="shield"/>Administrators edit their own profiles in Account settings.</p>}
        {error && <div className={`${styles.inlineError} ${styles.profileSaveError}`} role="alert"><p>{error}</p><button type="button" disabled={saving} className={styles.secondaryAction} onClick={() => setAttempt(value => value + 1)}>Reload saved profile</button><small>Reloading discards unsaved edits.</small></div>}
      </div>
      {editable && <footer className={styles.profileFormFooter}><p role="status">{notice}</p><button disabled={saving} className={styles.primaryAction} type="submit">{saving && <span className={styles.spinner} aria-hidden="true"/>}{saving ? 'Saving…' : 'Save profile'}</button></footer>}
    </form>
    <span className={styles.visuallyHidden} role="status">{saving ? 'Saving changes…' : ''}</span>
    {memberId !== undefined && record.role === 'member' && !record.capabilities?.length && <section className={styles.profileAccess} aria-label="Account access">
      <header className={styles.profilePanelHeading}><h3>Account access</h3></header><div className={styles.profileFormBody}><p>{record.active ? 'Active' : 'Inactive'} · This controls sign-in access, not membership approval or dues.</p>
      {confirmAccess ? <div><p>{record.active ? 'Deactivate this account? They will be signed out on every device. Their profile and records will be retained.' : 'Reactivate this account? They will be able to sign in again with their existing password.'}</p>
        <div className={styles.dialogActions}><button disabled={saving} className={styles.secondaryAction} onClick={() => setConfirmAccess(false)}>Cancel</button><button disabled={saving} className={styles.primaryAction} onClick={() => void save({active: !record.active, version: record.version}, `/members/${record.id}/access`)}>{saving ? 'Saving…' : record.active ? 'Confirm deactivation' : 'Confirm reactivation'}</button></div></div>
      : <button disabled={saving} className={styles.secondaryAction} onClick={() => setConfirmAccess(true)}>{record.active ? 'Deactivate account' : 'Reactivate account'}</button>}</div>
    </section>}
    {memberId !== undefined && <section className={styles.profileAccess} aria-label="Recent account activity">
      <header className={styles.profileActivityHeading}><h3>Recent account activity</h3><button type="button" className={styles.textButton} disabled={saving} onClick={() => setAttempt(value => value + 1)}>Refresh</button></header>
      {record.events?.length ? <ul className={styles.profileActivityList}>{record.events.map(item => <li key={item.id}><div><strong>{activityLabels[item.action] || item.action}</strong><small>{item.actor_id ? `Account #${item.actor_id}` : item.action === 'password_reset_requested' ? 'Account recovery request' : 'Former account'}</small></div><time dateTime={item.created_at}>{new Date(item.created_at).toLocaleString()}</time></li>)}</ul> : <p className={styles.profileActivityEmpty}>No recent activity to display.</p>}
      <p className={styles.profileActivityNote}>Refreshing reloads the saved profile and discards unsaved edits.</p>
    </section>}
  </div>;
}
function ProfileLoading() {
  return <div className={`${styles.profileFormPanel} ${styles.profileLoading}`} role="status"><span className={styles.visuallyHidden}>Loading profile…</span><div aria-hidden="true"><header className={styles.profilePanelHeading}><i/><i/></header><div className={styles.profileFormBody}><div className={styles.profileFields}>{[0,1,2,3,4].map(index => <div key={index} className={index === 4 ? styles.profileBio : undefined}><i/><i/></div>)}</div></div><div className={styles.profileFormFooter}><i/></div></div></div>;
}
