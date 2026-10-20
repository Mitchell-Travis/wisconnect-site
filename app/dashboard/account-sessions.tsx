'use client';

import { useEffect, useRef, useState } from 'react';
import { accountRequest } from '../account-api';
import styles from './dashboard.module.css';

type Session = { id: string; client_name: string; created_at: string; last_seen_at: string; expires_at: string; current: boolean };
type Sessions = { items: Session[]; idle_minutes: number };

export default function AccountSessions({ request = accountRequest }: { request?: typeof accountRequest }) {
  const [data, setData] = useState<Sessions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirm, setConfirm] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [version, setVersion] = useState(0);
  const pending = useRef(false);
  const refresh = useRef<HTMLButtonElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useEffect(() => { if (confirm) cancel.current?.focus({ preventScroll: true }); }, [confirm]);
  function cancelConfirmation() {
    setConfirm(null);
    requestAnimationFrame(() => refresh.current?.focus({ preventScroll: true }));
  }
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(''); setConfirm(null);
    request('/sessions', 'GET', undefined, controller.signal)
      .then(value => { if (!controller.signal.aborted) setData(value); })
      .catch(err => { if (!controller.signal.aborted) setError(err.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [request, version]);

  async function revoke(target: string) {
    if (pending.current) return;
    pending.current = true; setBusy(true); setError(''); setNotice('');
    try {
      await request(target === 'others' ? '/sessions/revoke-others' : `/sessions/${target}`, target === 'others' ? 'POST' : 'DELETE');
      if (!alive.current) return;
      setData(previous => previous ? { ...previous, items: previous.items.filter(item => target === 'others' ? item.current : item.id !== target) } : previous);
      setConfirm(null);
      setNotice(target === 'others' ? 'Other sessions signed out. This session stays open.' : 'Session signed out.');
    } catch (err) {
      if (alive.current) setError(err instanceof Error ? err.message : 'Could not sign out the session. Try again.');
    } finally {
      pending.current = false;
      if (alive.current) {
        setBusy(false);
        requestAnimationFrame(() => refresh.current?.focus({ preventScroll: true }));
      }
    }
  }

  return <section className={`${styles.profileAccess} ${styles.profileFormPanel} ${styles.sessionPanel}`} aria-label="Signed-in sessions" aria-busy={loading || busy}>
    <header className={styles.profileActivityHeading}><h3>Signed-in sessions</h3><button ref={refresh} type="button" className={styles.textButton} disabled={loading || busy} onClick={() => { setNotice(''); setVersion(value => value + 1); }}>Refresh sessions</button></header>
    <div className={styles.profileFormBody}>
      <p>Sessions expire after {data?.idle_minutes ?? 30} minutes of inactivity or eight hours after sign-in.</p>
      <p className={styles.sessionHint}>Device labels are approximate. Sign out any session you don’t recognize, then reset your password.</p>
      {loading && <p role="status">Loading sessions…</p>}
      {!loading && data?.items.length === 0 && <p>No active sessions were returned. Refresh to check again.</p>}
      {error && <p className={styles.inlineError} role="alert">{error} Use Refresh sessions to check the latest state.</p>}
      <p role="status">{notice}</p>
    </div>
    {!loading && data && <ul className={styles.profileActivityList}>{data.items.map(item => <li key={item.id}>
      <div><strong>{item.client_name}{item.current ? ' · This session' : ''}</strong><small>Signed in {new Date(item.created_at).toLocaleString()}</small><small>Last active {new Date(item.last_seen_at).toLocaleString()}</small></div>
      {!item.current && <div className={styles.sessionActions}>{confirm === item.id ? <><span>Sign out this session?</span><button ref={cancel} disabled={busy} className={styles.secondaryAction} onClick={cancelConfirmation}>Cancel</button><button disabled={busy} className={styles.primaryAction} onClick={() => void revoke(item.id)}>{busy ? 'Signing out…' : 'Confirm sign out'}</button></> : <button disabled={busy} className={styles.secondaryAction} onClick={() => setConfirm(item.id)}>Sign out session<span className={styles.visuallyHidden}>: {item.client_name}, {new Date(item.created_at).toLocaleString()}</span></button>}</div>}
    </li>)}</ul>}
    {!loading && data?.items.some(item => !item.current) && <footer className={styles.profileFormFooter}>
      {confirm === 'others' ? <><p>Sign out every other session? This one stays open.</p><button ref={cancel} disabled={busy} className={styles.secondaryAction} onClick={cancelConfirmation}>Cancel</button><button disabled={busy} className={styles.primaryAction} onClick={() => void revoke('others')}>{busy ? 'Signing out…' : 'Confirm sign out others'}</button></> : <button disabled={busy} className={styles.secondaryAction} onClick={() => setConfirm('others')}>Sign out other sessions</button>}
    </footer>}
  </section>;
}
