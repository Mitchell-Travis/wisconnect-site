'use client';

import Icon from "../site-icon";
import LocalInboxLink from '../local-inbox-link';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import AccountShell from '../account-shell';
import AccountField from '../account-field';
import { accountAvailable, accountRequest } from '../account-api';
import styles from '../member-access.module.css';

export default function RecoveryForm() {
  const token = useRef('');
  const pending = useRef(false);
  const [mode, setMode] = useState<'loading'|'request'|'reset'|'unavailable'|'invalid'|'done'>('loading');
  const [busy, setBusy] = useState(false);
  const [linkVersion, setLinkVersion] = useState(0);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  useEffect(() => {
    const read = () => {
      setError(''); setMessage(''); setShowPasswords(false); setLinkVersion(value => value + 1);
      if (!accountAvailable()) {setMode('unavailable');return;}
      const hash = window.location.hash;
      if (hash) {
        token.current = new URLSearchParams(hash.slice(1)).get('token') || '';
        history.replaceState(null, '', location.pathname);
      }
      setMode(token.current || hash ? (/^[A-Za-z0-9_-]{43}$/.test(token.current) ? 'reset' : 'invalid') : 'request');
    };
    read(); window.addEventListener('hashchange', read);return () => window.removeEventListener('hashchange', read);
  }, []);
  const requestFreshLink = () => { token.current=''; setMode('request'); setError(''); setMessage(''); setShowPasswords(false); };
  return <AccountShell title={mode === 'reset' ? 'Choose a new password.' : mode === 'done' ? 'Your password is updated.' : 'Reset your password.'} busy={mode === 'loading' || busy}>
    {mode === 'loading' ? <p className={styles.loading} role="status">Checking access…</p> : mode === 'unavailable' ? <>
      <p>Online password recovery is not available here yet. Contact the cooperative for help with your account.</p>
      <Link className={styles.continueLink} href="/contact">Contact WisConnect</Link>
    </> : mode === 'invalid' ? <>
      <p className={styles.notice} data-tone="error" role="alert">This reset link is incomplete. Request a new link to continue.</p>
      <button className={styles.accountSubmit} type="button" onClick={requestFreshLink}>Request a new link <Icon kind="arrow" size={16}/></button>
    </> : mode === 'done' ? <p>Your previous sessions have been signed out. Sign in using your new password.</p> : <>
      <p>{mode === 'request' ? 'Enter your member email and we’ll help you get back into your account.' : 'Choose a strong password to protect your member account.'}</p>
      <form className={styles.accountForm} key={`${mode}-${linkVersion}`} aria-label={mode === 'reset' ? 'Choose new password' : 'Request password reset'} onSubmit={async event => {
      event.preventDefault(); if(pending.current)return;
      const form=event.currentTarget; const data=new FormData(form); const currentToken=token.current;
      const resetting=mode==='reset';
      if(resetting && data.get('password')!==data.get('confirm')) {setError('Your passwords do not match.');return;}
      pending.current=true;setBusy(true);setError('');setMessage('');
      try {
        const result=await accountRequest(resetting?'/password-reset/confirm':'/password-reset/request','POST',resetting?{token:currentToken,password:data.get('password')}:{email:data.get('email')});
        if(currentToken!==token.current)return;
        if(resetting){form.reset();token.current='';setMode('done');}else{setMessage(result.message);}
      }catch(err){if(currentToken===token.current)setError(err instanceof Error?err.message:'Please try again.');}
      finally{pending.current=false;setBusy(false);}
    }}>
      <fieldset disabled={busy} className={styles.loginFields}>
        <legend className={styles.srOnly}>{mode === 'reset' ? 'Set your new password' : 'Request a reset link'}</legend>
        {mode==='request'?<AccountField id="recovery-email" label="Enter your email" aria-label="Email address" name="email" type="email" maxLength={254} required autoComplete="email" autoCapitalize="none" spellCheck={false}/>:<>
          <AccountField id="reset-password" label="New password" name="password" type={showPasswords ? 'text' : 'password'} minLength={15} maxLength={128} required autoComplete="new-password" aria-describedby="reset-password-help">
            <p id="reset-password-help" className={styles.fieldHint}>Use 15–128 characters. Try unrelated words or a password manager.</p>
          </AccountField>
          <AccountField id="reset-confirm" label="Confirm password" name="confirm" type={showPasswords ? 'text' : 'password'} minLength={15} maxLength={128} required autoComplete="new-password"/>
          <button className={styles.passwordToggle} type="button" aria-pressed={showPasswords} aria-controls="reset-password reset-confirm" onClick={() => setShowPasswords(value => !value)}>{showPasswords ? 'Hide passwords' : 'Show passwords'}</button>
        </>}
        <button className={styles.accountSubmit} type="submit">{busy?'Saving…':mode==='reset'?'Update password':'Send reset link'}<Icon kind="arrow" size={16}/></button>
      </fieldset>
    </form></>}
    {error&&<p className={styles.notice} data-tone="error" role="alert">{error}</p>}{message&&<p className={styles.notice} data-tone="success" role="status">{message}</p>}
    {mode==='reset'&&<button className={styles.accountTextButton} type="button" disabled={busy} onClick={requestFreshLink}>Request a fresh link</button>}
    {message&&<p><LocalInboxLink>Open local test inbox <Icon kind="external" size={16}/></LocalInboxLink></p>}
    <Link className={mode === 'done' ? styles.continueLink : styles.accountBackLink} href="/login">{mode !== 'done' && <Icon kind="arrowLeft" size={16}/>}Back to sign in</Link>
  </AccountShell>;
}
