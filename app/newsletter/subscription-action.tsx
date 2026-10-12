'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { newsletterAvailable, newsletterRequest } from './api';
import styles from './signup.module.css';

export default function NewsletterAction() {
  const [link, setLink] = useState<{ action: 'confirm' | 'unsubscribe'; token: string } | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'sending' | 'done' | 'invalid'>('loading');
  const [error, setError] = useState('');
  useEffect(() => {
    const readLink = () => {
      setError('');
      const params = new URLSearchParams(window.location.hash.slice(1));
      const action = params.has('confirm') ? 'confirm' : 'unsubscribe';
      const token = params.get(action) || '';
      // Fragments are not sent to the web server. Keep the link until the user acts so refresh is safe.
      if (!newsletterAvailable() || !/^[A-Za-z0-9_-]{43}$/.test(token)) setState('invalid');
      else { setLink({ action, token }); setState('ready'); }
    };
    readLink();
    window.addEventListener('hashchange', readLink);
    return () => window.removeEventListener('hashchange', readLink);
  }, []);
  async function act() {
    if (!link || state === 'sending') return;
    setState('sending'); setError('');
    try { await newsletterRequest(link.action, { token: link.token }); setState('done'); window.history.replaceState(null, '', window.location.pathname); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Please try again.'); setState('ready'); }
  }
  const removing = link?.action === 'unsubscribe';
  return <>
    <h1>{state === 'done' ? (removing ? 'You’re unsubscribed.' : 'You’re on the list.') : state === 'invalid' ? 'Check your email link.' : removing ? 'Time to say goodbye?' : 'A little more connected.'}</h1>
    <p>{state === 'loading' ? 'Checking your link…' : state === 'invalid' ? 'Open the full link from your latest WisConnect email. Email signup is currently available in the local preview only.' : state === 'done' ? (removing ? 'You won’t receive WisConnect updates. You’re welcome back anytime.' : 'Thanks for confirming. You’ve signed up for WisConnect stories, news and opportunities. Keep your confirmation email to unsubscribe anytime.') : removing ? 'Choose below to stop WisConnect email updates or cancel a pending signup.' : 'Confirm that you’d like stories, news and opportunities from WisConnect by email. You can unsubscribe anytime.'}</p>
    {(state === 'ready' || state === 'sending') && <button className={styles.action} onClick={act} disabled={state === 'sending'}>{state === 'sending' ? 'Saving…' : removing ? 'Unsubscribe' : 'Confirm subscription'}</button>}
    <p role="status" className={styles.error}>{error}</p>
    <Link href="/#join">Back to WisConnect</Link>
  </>;
}
