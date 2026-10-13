"use client";

import Icon from "../site-icon";

import Link from "next/link";
import { assetPath } from "../assets";
import AccountField from "../account-field";
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
      <AccountField id="email" label="Enter your email" name="email" type="email" aria-label="Email address" autoComplete="username" autoCapitalize="none" spellCheck={false} required maxLength={254} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'login-email-error' : undefined} onChange={() => { setErrors(previous => ({ ...previous, email: undefined })); onEdit(); }}>
        {errors.email && <p className={styles.loginFieldError} id="login-email-error">{errors.email}</p>}
      </AccountField>
      <AccountField id="password" label="Password" name="password" type={show ? 'text' : 'password'} autoComplete="current-password" required aria-invalid={!!errors.password} aria-describedby={errors.password ? 'login-password-error' : undefined} onChange={() => { setErrors(previous => ({ ...previous, password: undefined })); onEdit(); }} control={<button type="button" className={styles.revealPassword} aria-label={show ? 'Hide password' : 'Show password'} aria-controls="password" aria-pressed={show} onClick={() => setShow(value => !value)}>{show ? 'Hide' : 'Show'}</button>}>
        {errors.password && <p className={styles.loginFieldError} id="login-password-error">{errors.password}</p>}
      </AccountField>
      <Link className={styles.loginHelp} href="/reset-password">Forgot your password?</Link>
      <button type="submit" className={styles.signInButton}>{busy ? 'Signing in…' : 'Sign in'}<Icon kind="arrow" size={16}/></button>
    </fieldset>
    <div className={styles.socialSignIn}>
      <div className={styles.signInDivider} aria-hidden="true"><span>or</span></div>
      <button className={styles.googleButton} type="button" disabled aria-label="Continue with Google" aria-describedby="google-coming-soon">
        <img src={assetPath("google-g-logo.png")} alt="" width="20" height="20" aria-hidden="true"/>
        <span className={styles.googleButtonLabel}><span>Continue with Google</span><span className={styles.comingSoon} id="google-coming-soon">Coming soon</span></span>
      </button>
    </div>
  </form>;
}
