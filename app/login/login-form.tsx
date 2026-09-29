"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import styles from "../member-access.module.css";

export default function LoginForm({ busy, error, onEdit, onSignIn }: {
  busy: boolean;
  error: string;
  onEdit: () => void;
  onSignIn: (email: string, password: string) => Promise<void>;
}) {
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const summary = useRef<HTMLDivElement>(null);
  const serviceError = useRef<HTMLParagraphElement>(null);
  const submitting = useRef(false);

  useEffect(() => { if (error) serviceError.current?.focus(); }, [error]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || submitting.current) return;
    const form = event.currentTarget;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;
    const next = {
      email: !email.value.trim() ? "Enter your email address." : email.validity.typeMismatch ? "Enter an email address like maya@example.com." : undefined,
      password: !password.value ? "Enter your password." : undefined,
    };
    setErrors(next);
    onEdit();
    if (next.email || next.password) {
      requestAnimationFrame(() => summary.current?.focus());
      return;
    }
    submitting.current = true;
    try { await onSignIn(email.value.trim(), password.value); }
    finally { submitting.current = false; }
  }

  return <form className={styles.signInForm} onSubmit={submit} noValidate aria-label="Sign in" aria-busy={busy}>
    {(errors.email || errors.password) && <div className={styles.loginErrors} ref={summary} role="alert" tabIndex={-1}>
      <strong>Check your details.</strong>
      <ul>{(["email", "password"] as const).filter(key => errors[key]).map(key => <li key={key}><a href={'#' + key} onClick={event => { event.preventDefault(); document.getElementById(key)?.focus(); }}>{errors[key]}</a></li>)}</ul>
    </div>}
    {error && <p ref={serviceError} className={styles.loginErrors} role="alert" tabIndex={-1}>{error}</p>}
    <fieldset disabled={busy} className={styles.loginFields}>
      <legend className={styles.srOnly}>Sign in with your member account</legend>
      <div className={styles.loginField}>
        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" placeholder="e.g. maya@example.com" autoComplete="username" autoCapitalize="none" spellCheck={false} required maxLength={254} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'login-email-error' : undefined} onChange={() => { setErrors(previous => ({ ...previous, email: undefined })); onEdit(); }}/>
        {errors.email && <p className={styles.loginFieldError} id="login-email-error">{errors.email}</p>}
      </div>
      <div className={styles.loginField}>
        <label htmlFor="password">Password</label>
        <div className={styles.passwordControl}>
          <input id="password" name="password" type={show ? 'text' : 'password'} placeholder="Enter your password" autoComplete="current-password" required aria-invalid={!!errors.password} aria-describedby={errors.password ? 'login-password-error' : undefined} onChange={() => { setErrors(previous => ({ ...previous, password: undefined })); onEdit(); }}/>
          <button type="button" className={styles.revealPassword} aria-label={show ? 'Hide password' : 'Show password'} aria-controls="password" aria-pressed={show} onClick={() => setShow(value => !value)}>{show ? 'Hide' : 'Show'}</button>
        </div>
        {errors.password && <p className={styles.loginFieldError} id="login-password-error">{errors.password}</p>}
      </div>
      <Link className={styles.loginHelp} href="/contact">Need help signing in?</Link>
      <button type="submit" className={styles.signInButton}>{busy ? 'Signing in…' : 'Sign in'}<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
    </fieldset>
  </form>;
}
