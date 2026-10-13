"use client";

import Icon from "./site-icon";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import AccountShell from "./account-shell";
import AccountField from "./account-field";
import LoginForm from "./login/login-form";
import styles from "./member-access.module.css";
import DashboardView, { DashboardGate, View } from "./dashboard/dashboard-view";

type User = { name: string; email: string; role: "admin" | "member" };
type Mode = "login" | "signup" | "admin" | "dashboard";

class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

async function api(path: string, method = "GET", body?: object, signal?: AbortSignal) {
  let response: Response;
  const timeout = AbortSignal.timeout(15000);
  try {
    response = await fetch(`http://localhost:8001/auth${path}`, {
      method, signal: signal ? AbortSignal.any([signal, timeout]) : timeout, credentials: "include", cache: "no-store", referrerPolicy: "no-referrer",
      headers: { "Content-Type": "application/json", "X-WisConnect-Request": "1" },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (signal?.aborted) throw err;
    throw new Error("The account service is unavailable. Please try again in a moment.");
  }
  if (response.status >= 500) throw new ApiError("The account service is unavailable. Please try again in a moment.", response.status);
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new ApiError(data.detail || "Something went wrong. Please try again.", response.status);
  return data;
}

const loadMembers = (signal: AbortSignal) => api("/members", "GET", undefined, signal);
const deleteMember = (id: number) => api(`/members/${id}`, "DELETE");
const loadInvitations = (signal: AbortSignal) => api("/invitations", "GET", undefined, signal);
const sendInvitation = (email: string) => api("/invitations", "POST", { email });
const revokeInvitation = (id: number) => api(`/invitations/${id}`, "DELETE");
const loadInquiries = (signal: AbortSignal, before?: number) => api(`/contact-inquiries${before ? `?before=${before}` : ""}`, "GET", undefined, signal);
const retryInquiryEmail = (id: number) => api(`/contact-inquiries/${id}/retry-email`, "POST");

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
  const actionPending = useRef(false);

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
    if (actionPending.current) return;
    actionPending.current = true;
    setBusy(true); setError(""); setMessage("");
    try { await work(); }
    catch (err) { setError(err instanceof Error ? err.message : "Please try again."); }
    finally { actionPending.current = false; setBusy(false); }
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
    return <DashboardView user={user} busy={busy} error={error || sessionError} onSignOut={signOut} view={view} onViewChange={setView} loadMembers={loadMembers} deleteMember={deleteMember} loadInvitations={loadInvitations} sendInvitation={sendInvitation} revokeInvitation={revokeInvitation} loadInquiries={loadInquiries} retryInquiryEmail={retryInquiryEmail} onUpdateName={async name => {
      setUser(await api("/me", "PATCH", { name }));
    }} />;
  }

  const isSignup = mode === "signup";
  const invitationProblem = isSignup && ready && local && !invitedEmail && !!error;
  const title = isSignup ? (created ? "You’re part of WisConnect." : invitationProblem ? "Let’s get you connected." : "Activate your member account.")
    : user ? "You’re signed in." : "Log in to your account";
  const retryAccess = () => { if (isSignup) setReady(false); setError(""); setSessionError(""); setSessionAttempt(value => value + 1); };

  return <AccountShell title={title} busy={!ready || busy}>
        <noscript><p>Enable JavaScript to access your account, or <Link href="/contact">contact WisConnect</Link> for help.</p></noscript>
        {!ready ? <p className={styles.loading} role="status">{isSignup ? "Checking your invitation…" : "Checking your access…"}</p> : !local ? <>
          <p>Online member access is not available here yet. Contact the cooperative for help with your account or invitation.</p>
          <Link className={styles.continueLink} href="/contact">Contact WisConnect</Link>
          <Link className={styles.textLink} href="/join">Explore membership</Link>
        </> : <>
          {(error || sessionError) && (isSignup || !!user) && <p className={styles.notice} data-tone="error" role="alert">{error || sessionError}</p>}
          {message && <p className={styles.notice} data-tone="success" role="status">{message}</p>}
          {isSignup ? <>
            {invitedEmail && !created && <>
              <p className={styles.invitationEmail}>Your invitation is for <strong>{invitedEmail}</strong>.</p>
              <form className={styles.accountForm} onSubmit={submit} aria-label="Create your member account">
                <fieldset disabled={busy} className={styles.loginFields}>
                <legend className={styles.srOnly}>Activate your member account</legend>
                <AccountField id="member-name" label="Your name" name="name" autoComplete="name" required maxLength={100} onChange={event=>event.currentTarget.setCustomValidity("")} />
                <AccountField id="new-password" label="Choose a password" name="password" type={showPasswords ? "text" : "password"} autoComplete="new-password" required value={password} onChange={event => { setPassword(event.target.value); setError(""); }} onBlur={() => setPasswordBlurred(true)} aria-invalid={passwordBlurred && !passwordLengthValid} aria-describedby="password-help password-length">
                  <p id="password-help" className={styles.fieldHint}>Use 15–128 characters. Try four unrelated words or a password manager. Spaces are welcome.</p>
                  <p id="password-length" className={styles.fieldFeedback} data-invalid={passwordBlurred && !passwordLengthValid} role="status">{passwordLength === 0 ? "15–128 characters" : passwordLength > 128 ? "Too long — use no more than 128 characters." : passwordLength < 15 ? `${15 - passwordLength} more ${15 - passwordLength === 1 ? "character" : "characters"} needed` : <><Icon kind="check" size={16}/> Length requirement met</>}</p>
                </AccountField>
                <AccountField id="confirm-password" label="Confirm password" name="confirm" type={showPasswords ? "text" : "password"} autoComplete="new-password" required value={confirmation} onChange={event => { setConfirmation(event.target.value); setError(""); }} onBlur={() => setConfirmationBlurred(true)} aria-invalid={confirmationBlurred && confirmation !== password} aria-describedby="password-match">
                  <p id="password-match" className={styles.fieldFeedback} data-invalid={confirmationBlurred && confirmation !== password} role="status">{confirmation ? confirmation === password ? <><Icon kind="check" size={16}/> Passwords match</> : "Passwords do not match yet." : "Enter the same password again."}</p>
                </AccountField>
                <button className={styles.passwordToggle} type="button" aria-pressed={showPasswords} aria-controls="new-password confirm-password" onClick={()=>setShowPasswords(value=>!value)}>{showPasswords ? "Hide passwords" : "Show passwords"}</button>
                <button className={styles.accountSubmit} type="submit" disabled={busy}>{busy ? "Creating your account…" : "Create my account"}<Icon kind="arrow" size={16}/></button>
                </fieldset>
              </form>
            </>}
            {invitationProblem && <>
              <p>Open the invitation from your cooperative administrator. If it has expired or was already used, ask for a fresh link.</p>
              {token.current && <button className={styles.retryButton} type="button" onClick={retryAccess}>Check invitation again</button>}
              <Link className={styles.continueLink} href="/contact">Get help with your invitation</Link>
            </>}
            <Link className={created ? styles.continueLink : styles.textLink} href="/login">{created ? "Sign in to your account" : "Already activated? Sign in"}</Link>
            {!created && <details className={styles.accountHelp}><summary>Need help with your invitation?</summary><p>Use the invitation from your cooperative administrator to activate your account. <Link href="/contact">Contact WisConnect</Link> if you need help.</p></details>}
          </> : !user ? <>
            {sessionError && <button className={styles.retryButton} type="button" onClick={retryAccess}>Try connecting again</button>}
            <LoginForm busy={busy} error={error || sessionError} onEdit={() => setError("")} onSignIn={(email, password) => action(async () => {
              const result: User = await api("/login", "POST", { email, password });
              setSessionError("");
              setUser(result);
              if (mode === "login") location.assign("/dashboard/");
            })}/>
            <p className={styles.membershipPrompt}><span>New to WisConnect?</span><Link href="/join">Explore membership <Icon kind="arrow" size={16}/></Link></p>
          </> : <>
            <p>You’re already signed in as {user.email}.</p>
            <Link className={styles.continueLink} href="/dashboard">Open member workspace</Link>
            <button type="button" className={styles.secondary} disabled={busy} onClick={signOut}>{busy ? "Signing out…" : "Sign out"}</button>
          </>}
        </>}
  </AccountShell>;
}
