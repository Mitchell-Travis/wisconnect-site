"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import EntryHeader from "./entry-header";
import styles from "./member-access.module.css";
import DashboardView, { DashboardGate, View } from "./dashboard/dashboard-view";

type User = { name: string; email: string; role: "admin" | "member" };
type Mode = "login" | "signup" | "admin" | "dashboard";

class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

async function api(path: string, method = "GET", body?: object, signal?: AbortSignal) {
  let response: Response;
  try {
    response = await fetch(`http://localhost:8001/auth${path}`, {
      method, signal, credentials: "include", cache: "no-store", referrerPolicy: "no-referrer",
      headers: { "Content-Type": "application/json", "X-WisConnect-Request": "1" },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (signal?.aborted) throw err;
    throw new Error("The account service is unavailable. Please try again in a moment.");
  }
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new ApiError(data.detail || "Something went wrong. Please try again.", response.status);
  return data;
}

const loadMembers = (signal: AbortSignal) => api("/members", "GET", undefined, signal);
const deleteMember = (id: number) => api(`/members/${id}`, "DELETE");
const loadInvitations = (signal: AbortSignal) => api("/invitations", "GET", undefined, signal);
const sendInvitation = (email: string) => api("/invitations", "POST", { email });
const revokeInvitation = (id: number) => api(`/invitations/${id}`, "DELETE");

export default function MemberAccess({ mode }: { mode: Mode }) {
  const [view, setView] = useState<View>(mode === "admin" ? "invitations" : "home");
  const [ready, setReady] = useState(false);
  const [local, setLocal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [invitedEmail, setInvitedEmail] = useState("");
  const [sessionError, setSessionError] = useState("");
  const [sessionAttempt, setSessionAttempt] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [created, setCreated] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [passwordBlurred, setPasswordBlurred] = useState(false);
  const [confirmationBlurred, setConfirmationBlurred] = useState(false);
  const passwordLength = Array.from(password).length;
  const passwordLengthValid = passwordLength >= 15 && passwordLength <= 128;
  const token = useRef("");

  useEffect(() => {
    if (mode !== "signup") return;
    const openInvitation = () => {
      token.current = "";
      setPassword(""); setConfirmation(""); setPasswordBlurred(false); setConfirmationBlurred(false);
      setInvitedEmail(""); setCreated(false); setShowPasswords(false); setError(""); setMessage(""); setReady(false);
      setSessionAttempt(value => value + 1);
    };
    window.addEventListener("hashchange", openInvitation);
    return () => window.removeEventListener("hashchange", openInvitation);
  }, [mode]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const enabled = location.origin === "http://localhost:3000" && !process.env.NEXT_PUBLIC_BASE_PATH;
    setLocal(enabled);
    if (!enabled) { setReady(true); return; }
    if (mode === "signup") {
      token.current ||= new URLSearchParams(location.hash.slice(1)).get("token") || "";
      // Keep the bearer token out of URLs/history after reading it; never persist it.
      history.replaceState(null, "", location.pathname);
      if (!/^[A-Za-z0-9_-]{43}$/.test(token.current)) {
        setError("You need a valid invitation. Open the link in your invitation email.");
        setReady(true);
        return;
      }
      api("/invitation", "POST", { token: token.current })
        .then(data => { if (mounted) setInvitedEmail(data.email); })
        .catch(err => { if (mounted) setError(err.message); })
        .finally(() => { if (mounted) setReady(true); });
    } else {
      // A missing session is normal on first visit; other failures remain visible.
      let checking = false;
      const check = async () => {
        if (checking) return;
        checking = true;
        try { const data = await api("/me", "GET", undefined, controller.signal); if (mounted) { setUser(data); setSessionError(""); } }
        catch (err) {
          if (!mounted) return;
          if (err instanceof ApiError && err.status === 401) { setUser(null); setSessionError(""); }
          else setSessionError(err instanceof Error ? err.message : "Could not check your access.");
        } finally { checking = false; if (mounted) setReady(true); }
      };
      void check();
      window.addEventListener("focus", check);
      return () => { mounted = false; controller.abort(); window.removeEventListener("focus", check); };
    }
    return () => { mounted = false; };
  }, [mode, sessionAttempt]);

  async function action(work: () => Promise<void>) {
    if (busy) return;
    setBusy(true); setError(""); setMessage("");
    try { await work(); }
    catch (err) { setError(err instanceof Error ? err.message : "Please try again."); }
    finally { setBusy(false); }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (mode === "signup") {
      const name = form.elements.namedItem("name") as HTMLInputElement;
      name.setCustomValidity(name.value.trim() ? "" : "Please enter your name.");
      if (!form.reportValidity()) return;
      const field = form.elements.namedItem("password") as HTMLInputElement;
      const length = Array.from(field.value).length;
      if (length < 15 || length > 128) {
        setPasswordBlurred(true);
        setError(length < 15 ? "Use at least 15 characters for your password." : "Use no more than 128 characters for your password.");
        field.focus(); return;
      }
      if (data.get("password") !== data.get("confirm")) {
        setConfirmationBlurred(true); setError("Your passwords do not match.");
        (form.elements.namedItem("confirm") as HTMLInputElement).focus(); return;
      }
    }
    void action(async () => {
      if (mode === "signup") {
        const invitation = token.current;
        await api("/accept", "POST", { token: invitation, name: String(data.get("name")).trim(), password: data.get("password") });
        if (token.current !== invitation) return;
        token.current = "";
        setPassword(""); setConfirmation("");
        setCreated(true);
        setMessage("Your account is ready. Sign in with your email and the password you just chose.");
      } else {
        const result: User = await api("/login", "POST", { email: data.get("email"), password: data.get("password") });
        form.reset();
        setUser(result);
        if (mode === "login") location.assign("/dashboard/");
      }
    });
  }

  function signOut() {
    void action(async () => {
      await api("/logout", "POST");
      location.replace("/login/");
    });
  }

  if ((mode === "dashboard" || mode === "admin") && (!ready || (local && !user && sessionError))) {
    return <DashboardGate error={ready ? sessionError : ""} onRetry={() => { setReady(false); setSessionAttempt(value => value + 1); }} />;
  }

  if ((mode === "dashboard" || mode === "admin") && ready && local && user) {
    return <DashboardView user={user} busy={busy} error={error || sessionError} onSignOut={signOut} view={view} onViewChange={setView} loadMembers={loadMembers} deleteMember={deleteMember} loadInvitations={loadInvitations} sendInvitation={sendInvitation} revokeInvitation={revokeInvitation} onUpdateName={async name => {
      setUser(await api("/me", "PATCH", { name }));
    }} />;
  }

  const isSignup = mode === "signup";
  const invitationProblem = isSignup && ready && local && !invitedEmail && !!error;
  const title = isSignup ? (created ? "You’re part of WisConnect." : invitationProblem ? "Let’s get you connected." : "Activate your member account.")
    : user ? `Welcome back, ${user.name}.` : "Welcome to WisConnect";
  const retryAccess = () => { setReady(false); setError(""); setSessionError(""); setSessionAttempt(value => value + 1); };

  return <div className={`${styles.page} ${styles.loginPage}`}>
    <EntryHeader/>
    <main className={styles.main}>
      <div className={styles.content} aria-busy={!ready || busy}>
        <p className={styles.entryEyebrow}>People. Capital. Communities.</p>
        <h1>{title}</h1>
        <noscript><p>Enable JavaScript to access your account, or <Link href="/contact">contact WisConnect</Link> for help.</p></noscript>
        {!ready ? <p className={styles.loading} role="status">{isSignup ? "Checking your invitation…" : "Checking your access…"}</p> : !local ? <>
          <p>Online member access is not available here yet. Contact the cooperative for help with your account or invitation.</p>
          <Link className={styles.continueLink} href="/contact">Contact WisConnect</Link>
          <Link className={styles.textLink} href="/join">Explore membership</Link>
        </> : <>
          {(error || sessionError) && <p className={styles.notice} data-tone="error" role="alert">{error || sessionError}</p>}
          {message && <p className={styles.notice} data-tone="success" role="status">{message}</p>}
          {isSignup ? <>
            {invitedEmail && !created && <>
              <p className={styles.invitationEmail}>Your invitation is for <strong>{invitedEmail}</strong>.</p>
              <form onSubmit={submit} aria-label="Create your member account">
                <label htmlFor="member-name">Your name<input id="member-name" name="name" placeholder="Full name" autoComplete="name" required maxLength={100} onChange={event=>event.currentTarget.setCustomValidity("")} /></label>
                <label htmlFor="new-password">Choose a password<input id="new-password" name="password" type={showPasswords ? "text" : "password"} placeholder="Create a password" autoComplete="new-password" required value={password} onChange={event => { setPassword(event.target.value); setError(""); }} onBlur={() => setPasswordBlurred(true)} aria-invalid={passwordBlurred && !passwordLengthValid} aria-describedby="password-help password-length" /></label>
                <p id="password-help" className={styles.hint}>Use at least 15 characters. Try four unrelated words or a password manager. Spaces are welcome; numbers and symbols are optional.</p>
                <p id="password-length" className={styles.passwordFeedback} data-invalid={passwordBlurred && !passwordLengthValid} role="status">{passwordLength === 0 ? "15–128 characters" : passwordLength > 128 ? "Too long — use no more than 128 characters." : passwordLength < 15 ? `${15 - passwordLength} more ${15 - passwordLength === 1 ? "character" : "characters"} needed` : "✓ Length requirement met"}</p>
                <label htmlFor="confirm-password">Confirm password<input id="confirm-password" name="confirm" type={showPasswords ? "text" : "password"} placeholder="Repeat your password" autoComplete="new-password" required value={confirmation} onChange={event => { setConfirmation(event.target.value); setError(""); }} onBlur={() => setConfirmationBlurred(true)} aria-invalid={confirmationBlurred && confirmation !== password} aria-describedby="password-match" /></label>
                <p id="password-match" className={styles.passwordFeedback} data-invalid={confirmationBlurred && confirmation !== password} role="status">{confirmation ? confirmation === password ? "✓ Passwords match" : "Passwords do not match yet." : "Enter the same password again."}</p>
                <button className={styles.passwordToggle} type="button" aria-pressed={showPasswords} aria-controls="new-password confirm-password" onClick={()=>setShowPasswords(value=>!value)}>{showPasswords ? "Hide passwords" : "Show passwords"}</button>
                <button type="submit" disabled={busy}>{busy ? "Creating your account…" : "Create my account"}</button>
              </form>
            </>}
            {invitationProblem && <>
              <p>Open the invitation from your cooperative administrator. If it has expired or was already used, ask for a fresh link.</p>
              {token.current && <button className={styles.retryButton} type="button" onClick={retryAccess}>Check invitation again</button>}
              <Link className={styles.continueLink} href="/contact">Get help with your invitation</Link>
            </>}
            <Link className={created ? styles.continueLink : styles.textLink} href="/login">{created ? "Sign in to your account" : "Already activated? Sign in"}</Link>
          </> : !user ? <>
            <p>Sign in to your member account.</p>
            {sessionError && <button className={styles.retryButton} type="button" onClick={retryAccess}>Try connecting again</button>}
            <form onSubmit={submit} aria-label="Sign in">
              <label htmlFor="email">Email address<input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="username" required maxLength={254} /></label>
              <label htmlFor="password">Password<input id="password" name="password" type={showPasswords ? "text" : "password"} placeholder="Your password" autoComplete="current-password" required /></label>
              <button className={styles.passwordToggle} type="button" aria-pressed={showPasswords} aria-controls="password" onClick={()=>setShowPasswords(value=>!value)}>{showPasswords ? "Hide password" : "Show password"}</button>
              <button type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
            </form>
            <div className={styles.entryLinks}><Link href="/contact">Need sign-in help?</Link><Link href="/join">Explore membership</Link></div>
          </> : <>
            <p>You’re already signed in as {user.email}.</p>
            <Link className={styles.continueLink} href="/dashboard">Open member workspace</Link>
            <button type="button" className={styles.secondary} disabled={busy} onClick={signOut}>{busy ? "Signing out…" : "Sign out"}</button>
          </>}
        </>}
      </div>
    </main>
    <footer className={styles.loginFooter}>
      <details><summary>Help</summary><p>Accounts are invitation-only. To activate yours, use the link from your cooperative administrator. <Link href="/contact">Contact WisConnect</Link> if you need help.</p></details>
      <p>Member access by invitation</p>
    </footer>
  </div>;
}
