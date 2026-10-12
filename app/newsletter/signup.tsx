'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { newsletterAvailable, newsletterRequest } from './api';
import styles from './signup.module.css';

export function NewsletterSignup() {
  const [available, setAvailable] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  useEffect(() => { setAvailable(newsletterAvailable()); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'sending') return;
    setState('sending'); setError('');
    try { await newsletterRequest('subscribe', { email, consent: true }); setState('sent'); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Please try again.'); setState('error'); }
  }
  return <div className={styles.signup}>
    <h3>Stay connected.</h3>
    <p className={styles.description}>Stories, news and opportunities from WisConnect, straight to your inbox.</p>
    {state === 'sent' ? <div role="status" className={styles.success}><strong>Check your inbox.</strong><p>If this address needs confirmation, you’ll receive a link. Click it to join the list.</p><p className={styles.note}>Local preview: confirmation emails appear in the <a href="http://localhost:8025" target="_blank" rel="noreferrer">test inbox ↗</a>.</p><button type="button" className={styles.reset} onClick={() => {setState('idle'); setEmail('');}}>Use another email</button></div> : <form onSubmit={submit}>
      <label htmlFor="newsletter-email">Email address</label>
      <div className={styles.controls}><input id="newsletter-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" maxLength={254} required value={email} onChange={event => setEmail(event.target.value)} disabled={!available || state === 'sending'} aria-describedby="newsletter-note newsletter-feedback"/><button disabled={!available || state === 'sending'} type="submit">{state === 'sending' ? 'Sending…' : 'Subscribe'}<span aria-hidden="true">↗</span></button></div>
      <p id="newsletter-note" className={styles.note}>{available ? 'By subscribing, you agree to receive WisConnect updates by email. Confirm in your inbox. Unsubscribe anytime.' : 'Email signup is coming soon. Check back for stories and updates from WisConnect.'}</p>
      <p id="newsletter-feedback" role="status" className={styles.error}>{error}</p>
    </form>}
  </div>;
}
