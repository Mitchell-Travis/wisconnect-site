"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { assetPath } from "./assets";
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
    throw new Error("Cannot reach the local API. Start it with npm run dev:api, then reload.");
  }
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new ApiError(data.detail || "Something went wrong. Please try again.", response.status);
  return data;
}

const loadMembers = (signal: AbortSignal) => api("/members", "GET", undefined, signal);
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
  const token = useRef("");

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
    void action(async () => {
      if (mode === "signup") {
        if (data.get("password") !== data.get("confirm")) throw new Error("Your passwords do not match.");
        await api("/accept", "POST", { token: token.current, name: data.get("name"), password: data.get("password") });
        token.current = "";
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
    return <DashboardView user={user} busy={busy} error={error || sessionError} onSignOut={signOut} view={view} onViewChange={setView} loadMembers={loadMembers} loadInvitations={loadInvitations} sendInvitation={sendInvitation} revokeInvitation={revokeInvitation} onUpdateName={async name => {
      setUser(await api("/me", "PATCH", { name }));
    }} />;
  }

  const isLogin = mode === "login";
  const isAccountEntry = isLogin || mode === "signup";
  const title = mode === "signup" ? (created ? "Welcome to WisConnect." : "Your invitation. Your next chapter.")
    : mode === "admin" ? (user?.role === "admin" ? "Invite a member." : "Administrator access.")
    : user ? `Welcome, ${user.name}.` : isLogin ? "Welcome to WisConnect" : "Welcome back.";

  return <div className={`${styles.page} ${isAccountEntry ? styles.loginPage : ""}`}>
    <header className={styles.header}><div className={styles.frame}>
      <Link href="/" aria-label="WisConnect home"><img src={assetPath("logo-horizontal.webp")} alt="WisConnect" width="178" height="40" /></Link>
      <Link href="/">Back to website <span aria-hidden="true">↗</span></Link>
    </div></header>
    {!isAccountEntry && <div className={styles.textile} style={{ backgroundImage: `url("${assetPath("Royal Purple and Gold Ornamental Textile.png")}")` }} aria-hidden="true" />}
    <main className={styles.main}>
      <div className={styles.content}>
        {!isAccountEntry && <p className={styles.eyebrow}>Member access · Local test</p>}
        <h1>{title}</h1>
        <noscript><p>JavaScript is needed to use this local account flow.</p></noscript>
        {!ready ? <p role="status">Checking access…</p> : !local ? <p>This account flow is only available at localhost during development. It is not open for public registration.</p> : <>
          {(error || sessionError) && <p className={styles.notice} role="alert">{error || sessionError}</p>}
          {message && <p className={styles.notice} role="status">{message}</p>}
          {mode === "signup" ? <>
            {invitedEmail && !created && <>
              <p>Invited as <strong>{invitedEmail}</strong>. This invitation is for you only.</p>
              <form onSubmit={submit} aria-label="Create your member account">
              <label htmlFor="member-name"><span className={styles.inputLabel}>Your name</span><input id="member-name" name="name" placeholder="Your name" autoComplete="name" required maxLength={100} /></label>
              <label htmlFor="new-password"><span className={styles.inputLabel}>Choose a password</span><input id="new-password" name="password" type="password" placeholder="Choose a password" autoComplete="new-password" required minLength={15} maxLength={128} aria-describedby="password-help" /></label>
              <p id="password-help" className={styles.hint}>Use 15–128 characters. A long, unique passphrase works well.</p>
              <label htmlFor="confirm-password"><span className={styles.inputLabel}>Confirm password</span><input id="confirm-password" name="confirm" type="password" placeholder="Confirm password" autoComplete="new-password" required minLength={15} maxLength={128} /></label>
              <button type="submit" disabled={busy}>{busy ? "Creating your account…" : "Create my account"}</button>
              </form>
            </>}
            <Link className={styles.textLink} href="/login">{created ? "Sign in to your account →" : "Already activated your account? Sign in"}</Link>
          </> : !user ? <>
            <p>{mode === "admin" ? "Sign in to invite approved members. An administrator account must be created locally first." : isLogin ? "Sign in to your member account." : "Sign in with your invited member account. New accounts are created by invitation only."}</p>
            <form onSubmit={submit} aria-label="Sign in">
              <label htmlFor="email"><span className={isLogin ? styles.inputLabel : undefined}>Email address</span><input id="email" name="email" type="email" placeholder={isLogin ? "Email address" : undefined} autoComplete="username" required maxLength={254} /></label>
              <label htmlFor="password"><span className={isLogin ? styles.inputLabel : undefined}>Password</span><input id="password" name="password" type="password" placeholder={isLogin ? "Password" : undefined} autoComplete="current-password" required maxLength={128} /></label>
              <button type="submit" disabled={busy}>{busy ? "Signing in…" : isLogin ? "Sign in" : "Sign in →"}</button>
            </form>
            {mode === "admin" && <p className={styles.hint}>First local setup: run <code>npm run auth:admin</code> in your terminal to create your administrator account.</p>}
            {!isLogin && <p className={styles.hint}>Need an invitation or help accessing your account? Contact your cooperative administrator.</p>}
          </> : <>
            {isLogin ? <>
              <p>You’re already signed in as {user.email}.</p>
              <Link className={styles.continueLink} href="/dashboard">Continue to your account</Link>
            </> : <>
              <p>You’re signed in as {user.email}. Your account access has been verified by the API.</p>
              <p>This is the first protected account screen. Dashboard features and marketplace access are not built yet.</p>
              {user.role === "admin" && <Link className={styles.textLink} href="/admin">Manage invitations →</Link>}
            </>}
            <button type="button" className={styles.secondary} disabled={busy} onClick={signOut}>Sign out</button>
          </>}
          {!isAccountEntry && <p className={styles.footnote}>Local development only. No real emails or public signup.</p>}
        </>}
      </div>
    </main>
    {isAccountEntry && <footer className={styles.loginFooter}>
      <details>
        <summary>Help</summary>
        <p>Accounts are invitation-only. To activate yours, open the invitation from your cooperative administrator. For sign-in help, contact your administrator.</p>
      </details>
      <p>Member access by invitation · Local development</p>
    </footer>}
  </div>;
}
