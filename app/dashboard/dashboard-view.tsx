"use client";

import Link from "next/link";
import localFont from "next/font/local";
import { useEffect, useRef, useState } from "react";
import { assetPath } from "../assets";
import styles from "./dashboard.module.css";
import SectionPreview from "./section-preview";
import Icon from "./feather-icon";
import DataState from "./data-state";
import ThemeToggle from "./theme-toggle";
import { InviteDialog, InvitationsList, Invitation } from "./invitations";
import MembersDirectory, { MemberRecord } from "./members-directory";
import { adminItems, memberItems, sections, SectionKey, View } from "./sections";

const inter = localFont({ src: "./fonts/InterVariable.woff2", weight: "100 900", style: "normal", display: "swap" });

export type { View } from "./sections";
type User = { name: string; email: string; role: "admin" | "member" };

export default function DashboardView({ user, busy, error, onSignOut, view, onViewChange, onUpdateName, loadMembers, deleteMember, loadInvitations, sendInvitation, revokeInvitation }: {
  user: User; busy: boolean; error: string; onSignOut: () => void;
  view: View; onViewChange: (view: View) => void;
  onUpdateName: (name: string) => Promise<void>;
  deleteMember: (id: number) => Promise<void>;
  loadMembers: (signal: AbortSignal) => Promise<MemberRecord[]>;
  loadInvitations: (signal: AbortSignal) => Promise<Invitation[]>;
  sendInvitation: (email: string) => Promise<{ message: string }>;
  revokeInvitation: (id: number) => Promise<void>;
}) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invitationsVersion, setInvitationsVersion] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const workspace = useRef<HTMLElement>(null);
  const accountButton = useRef<HTMLButtonElement>(null);
  const accountMenu = useRef<HTMLDivElement>(null);
  const notificationsButton = useRef<HTMLButtonElement>(null);
  const notificationsPanel = useRef<HTMLDivElement>(null);
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState("");
  const [profileNotice, setProfileNotice] = useState("");
  const moreButton = useRef<HTMLButtonElement>(null);
  const moreMenu = useRef<HTMLDivElement>(null);
  const mobileItems = user.role === "admin" ? (["home", "members", "payments", "projects"] as const) : (["home", "membership", "myBusiness", "documents"] as const);
  const moreItems = user.role === "admin" ? (["businesses", "documents", "reports", "team"] as const) : [];
  const preview = view in sections ? sections[view as SectionKey] : null;
  const memberArea = ["members", "applications", "invitations"].includes(view);
  const financeArea = ["payments", "investments"].includes(view);
  const activeItem = memberArea ? "members" : financeArea ? "payments" : view;
  const firstName = user.name.trim().split(/\s+/)[0];
  const initials = user.name.trim().split(/\s+/).slice(0, 2).map(part => Array.from(part)[0]).join("").toUpperCase();
  const role = user.role === "admin" ? "Administrator" : "Member";
  const pageTitle = preview ? preview.title : view === "home" ? "Home" : view === "account" ? "Settings" : view === "invitations" ? "Invitations" : "Support";

  useEffect(() => {
    const close = () => { accountMenu.current?.hidePopover(); notificationsPanel.current?.hidePopover(); moreMenu.current?.hidePopover(); };
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  function selectView(next: View) {
    accountMenu.current?.hidePopover();
    notificationsPanel.current?.hidePopover();
    moreMenu.current?.hidePopover();
    if (next === "account") { setNameError(""); setProfileNotice(""); }
    onViewChange(next);
    requestAnimationFrame(() => { workspace.current?.scrollTo(0, 0); if (innerWidth < 640) window.scrollTo(0, 0); heading.current?.focus({ preventScroll: true }); });
  }

  return <div className={`${inter.className} ${styles.dashboard}`} data-dashboard-view={view}>
    <a className={styles.skip} href="#dashboard-content">Skip to dashboard</a>
    <aside className={styles.sidebar} aria-label="Member workspace">
      <Link className={styles.brand} href="/" aria-label="WisConnect home"><img src={assetPath("logo-horizontal.webp")} alt="WisConnect" width="154" height="36" /></Link>
      <div className={styles.workspaceIdentity}><span className={styles.workspaceMark} aria-hidden="true">W</span><span><strong>WisConnect</strong><small>{user.role === "admin" ? "Cooperative workspace" : "Member workspace"}</small></span></div>
      <nav id="dashboard-navigation" className={styles.navigation} aria-label="Dashboard navigation">
        <button type="button" aria-current={view === "home" ? "page" : undefined} onClick={() => selectView("home")}><Icon kind="home" />Home</button>
        {(user.role === "admin" ? adminItems : memberItems).map(key => <button key={key} type="button" aria-current={activeItem === key ? "page" : undefined} onClick={() => selectView(key)}><Icon kind={sections[key].icon} />{key === "payments" ? "Finance" : sections[key].title}</button>)}
        {user.role === "admin" && <div className={styles.navigationGroup}>
          <button type="button" aria-current={view === "team" ? "page" : undefined} onClick={() => selectView("team")}><Icon kind="shield" />Team & access</button>
        </div>}
      </nav>
      <div className={styles.sidebarAccount}>
        <button ref={accountButton} className={styles.identity} type="button" popoverTarget="account-menu" aria-label={`Account menu for ${user.name}`} aria-haspopup="menu" aria-expanded="false" onKeyDown={event => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); accountMenu.current?.showPopover(); }
        }}>
          <span className={styles.avatar} aria-hidden="true">{initials}</span>
          <span className={styles.identityText}><strong title={user.name}>{user.name}</strong></span>
          <Icon kind="more" />
        </button>
        <div ref={accountMenu} id="account-menu" className={styles.accountMenu} popover="auto" role="menu" aria-label="Account" onBeforeToggle={event => {
          if (event.newState !== "open" || !accountButton.current) return;
          const rect = accountButton.current.getBoundingClientRect();
          const menu = event.currentTarget;
          menu.style.left = `${Math.max(8, Math.min(rect.left, innerWidth - 288))}px`;
          menu.style.maxHeight = `${Math.max(120, innerWidth < 640 ? innerHeight - rect.bottom - 12 : rect.top - 12)}px`;
          menu.style.top = innerWidth < 640 ? `${rect.bottom + 4}px` : "auto";
          menu.style.bottom = innerWidth < 640 ? "auto" : `${innerHeight - rect.top + 4}px`;
        }} onToggle={event => {
          accountButton.current?.setAttribute("aria-expanded", String(event.newState === "open"));
          if (event.newState === "open") event.currentTarget.querySelector<HTMLButtonElement>("button")?.focus();
        }} onBlur={event => {
          if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget) && event.relatedTarget !== accountButton.current) event.currentTarget.hidePopover();
        }} onKeyDown={event => {
          const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"));
          const index = items.indexOf(document.activeElement as HTMLButtonElement);
          const next = event.key === "ArrowDown" ? (index + 1) % items.length : event.key === "ArrowUp" ? (index - 1 + items.length) % items.length : event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : -1;
          if (next >= 0) { event.preventDefault(); items[next]?.focus(); }
        }}>
          <div className={styles.accountMenuIdentity} role="presentation"><span className={styles.accountBadge}>{role}</span><span className={styles.avatar} aria-hidden="true">{initials}</span><strong>{user.name}</strong><small>{user.email}</small></div>
          <div className={styles.accountMenuGroup} role="group" aria-label="Settings">
            <button type="button" role="menuitem" tabIndex={-1} onClick={() => selectView("account")}><Icon kind="settings" />Account settings</button>
            {user.role === "admin" && <button type="button" role="menuitem" tabIndex={-1} onClick={() => selectView("team")}><Icon kind="shield" />Team & access</button>}
          </div>
          <div className={styles.accountMenuGroup} role="group" aria-label="Workspace">
            <button type="button" role="menuitem" tabIndex={-1} onClick={() => selectView("home")}><span className={styles.workspaceMark}>W</span>WisConnect<small>Workspace</small></button>
          </div>
          <div className={styles.accountMenuGroup} role="group" aria-label="Resources">
            <button type="button" role="menuitem" tabIndex={-1} onClick={() => selectView("documents")}><Icon kind="book" />Documents</button>
            <button type="button" role="menuitem" tabIndex={-1} onClick={() => selectView("help")}><Icon kind="help" />Support</button>
          </div>
          <div className={styles.accountMenuFooter}><ThemeToggle onSelect={() => { accountMenu.current?.hidePopover(); accountButton.current?.focus(); }} /><button type="button" role="menuitem" tabIndex={-1} disabled={busy} onClick={onSignOut}>{busy ? <span className={styles.spinner} aria-hidden="true" /> : <Icon kind="logout" />}{busy ? "Signing out…" : "Sign out"}</button></div>
        </div>
      </div>
    </aside>

    <header className={styles.workspaceHeader} aria-label="Workspace context">
      <span>WisConnect</span><span aria-hidden="true">/</span><strong>{pageTitle}</strong>
      <button ref={notificationsButton} className={styles.notificationsButton} type="button" popoverTarget="notifications-panel" aria-label="Notifications" aria-haspopup="dialog" aria-expanded="false"><Icon kind="bell" /></button>
    </header>
    <nav className={styles.mobileNavigation} aria-label="Mobile dashboard navigation">
      {mobileItems.map(key => <button key={key} type="button" aria-label={key === "home" ? "Home" : key === "payments" ? "Finance" : sections[key].title} aria-current={activeItem === key ? "page" : undefined} onClick={() => selectView(key)}><Icon kind={key === "home" ? "home" : sections[key].icon} /><span>{key === "home" ? "Home" : key === "payments" ? "Finance" : key === "membership" ? "Membership" : key === "myBusiness" ? "Business" : sections[key].title}</span></button>)}
      <button ref={moreButton} className={styles.mobileMoreButton} type="button" popoverTarget="mobile-more-menu" aria-label="More sections" aria-haspopup="menu" aria-expanded="false" data-active={moreItems.some(key => key === view) || view === "account" || view === "help"}><Icon kind="more" /><span>More</span></button>
    </nav>
    <div ref={moreMenu} id="mobile-more-menu" className={`${styles.accountMenu} ${styles.mobileMoreMenu}`} popover="auto" role="menu" aria-label="More sections" onBeforeToggle={event => {
      if (event.newState !== "open" || !moreButton.current) return;
      const rect = moreButton.current.getBoundingClientRect();
      event.currentTarget.style.left = `${Math.max(16, Math.min(rect.right - 220, innerWidth - 236))}px`;
      event.currentTarget.style.bottom = `${innerHeight - rect.top + 8}px`;
      event.currentTarget.style.maxHeight = `${Math.max(0, rect.top - 24)}px`;
    }} onToggle={event => {
      moreButton.current?.setAttribute("aria-expanded", String(event.newState === "open"));
      if (event.newState === "open") event.currentTarget.querySelector<HTMLButtonElement>("button")?.focus();
    }} onBlur={event => {
      if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget) && event.relatedTarget !== moreButton.current) event.currentTarget.hidePopover();
    }} onKeyDown={event => {
      const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
      const index = items.indexOf(document.activeElement as HTMLButtonElement);
      const next = event.key === "ArrowDown" ? (index + 1) % items.length : event.key === "ArrowUp" ? (index - 1 + items.length) % items.length : event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : -1;
      if (next >= 0) { event.preventDefault(); items[next]?.focus(); }
    }}>
      {moreItems.map(key => <button key={key} type="button" role="menuitem" tabIndex={-1} aria-current={view === key ? "page" : undefined} onClick={() => selectView(key)}><Icon kind={sections[key].icon} />{key === "team" ? "Team & access" : sections[key].title}</button>)}
      <div className={styles.accountMenuGroup}><button type="button" role="menuitem" tabIndex={-1} onClick={() => selectView("account")}><Icon kind="settings" />Account settings</button><button type="button" role="menuitem" tabIndex={-1} onClick={() => selectView("help")}><Icon kind="help" />Support</button></div>
    </div>
    <div ref={notificationsPanel} id="notifications-panel" className={styles.notificationsPanel} popover="auto" role="dialog" aria-labelledby="notifications-title" aria-describedby="notifications-availability" onBeforeToggle={event => {
      if (event.newState !== "open" || !notificationsButton.current) return;
      const rect = notificationsButton.current.getBoundingClientRect();
      event.currentTarget.style.top = `${rect.bottom + 8}px`;
      event.currentTarget.style.right = `${Math.min(Math.max(16, innerWidth - rect.right), innerWidth - Math.min(380, innerWidth - 32) - 16)}px`;
      event.currentTarget.style.maxHeight = `${Math.max(0, innerHeight - rect.bottom - 24)}px`;
    }} onToggle={event => {
      notificationsButton.current?.setAttribute("aria-expanded", String(event.newState === "open"));
      if (event.newState === "open") event.currentTarget.querySelector<HTMLElement>("h2")?.focus();
    }} onBlur={event => {
      if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget) && event.relatedTarget !== notificationsButton.current) event.currentTarget.hidePopover();
    }}>
      <div className={styles.notificationsHeading}><h2 id="notifications-title" tabIndex={-1}>Notifications</h2><button type="button" popoverTarget="notifications-panel" popoverTargetAction="hide" aria-label="Close notifications"><Icon kind="close" /></button></div>
      <div className={styles.notificationsEmpty}><span className={styles.stateIcon}><Icon kind="bell" /></span><h3>No notifications yet</h3><p>Cooperative updates and account alerts will appear here once notifications are connected.</p></div>
      <p id="notifications-availability" className={styles.notificationsFooter}>Notification feed not connected yet</p>
    </div>
    <main ref={workspace} id="dashboard-content" className={styles.workspace} tabIndex={-1}>
      <div className={styles.content}>
        {view === "account" && <div className={styles.settingsNavigation}>
          <h2>Account</h2>
          <div role="group" aria-label="Account sections">
            <a href="#account-information"><Icon kind="account" />Account information</a>
            <a href="#account-access"><Icon kind="shield" />Account access</a>
            <a href="#account-support"><Icon kind="help" />Support</a>
          </div>
        </div>}
        <header className={styles.heading}>
          <div><h1 ref={heading} tabIndex={-1}>{view === "home" ? `Hi, ${firstName}` : view === "account" ? "Account settings" : pageTitle}</h1>
            {view !== "account" && view !== "members" && <p>{preview ? preview.subtitle : view === "home" ? "Here’s your cooperative." : view === "invitations" ? "Welcome your next member." : "Let’s find your next step."}</p>}
          </div>
          {user.role === "admin" && (view === "applications" || view === "invitations") && <button className={styles.primaryAction} type="button" onClick={() => setInviteOpen(true)}>Invite member <Icon kind="plus" /></button>}
        </header>
        {error && <p className={styles.error} role="alert">{error}</p>}
        {user.role === "admin" && view !== "members" && (memberArea || financeArea) && <div className={styles.areaNavigation} role="group" aria-label={memberArea ? "Member management" : "Finance"}>
          {(memberArea ? ([['members', 'Directory'], ['applications', 'Applications'], ['invitations', 'Invitations']] as const) : ([['payments', 'Payments'], ['investments', 'Investments']] as const)).map(([key, label]) => <button key={key} type="button" aria-current={view === key ? "page" : undefined} onClick={() => selectView(key)}>{label}</button>)}
          {view === "invitations" && <a href="http://localhost:8025" target="_blank" rel="noreferrer">Email inbox <Icon kind="external" /></a>}
        </div>}

        {view === "members" ? (user.role === "admin" ? <MembersDirectory loadMembers={loadMembers} deleteMember={deleteMember} onViewChange={selectView} onInvite={() => setInviteOpen(true)} /> : <p>Administrator access required.</p>) : preview ? (preview.adminOnly && user.role !== "admin" ? <p>Administrator access required.</p> : <SectionPreview key={view} section={view as SectionKey} />) : view === "invitations" ? (user.role === "admin" ? <InvitationsList loadInvitations={loadInvitations} revokeInvitation={revokeInvitation} version={invitationsVersion} onInvite={() => setInviteOpen(true)} /> : <p>Only administrators can issue invitations.</p>) : view === "home" ? <>
          <div className={styles.overview}>
            <section className={styles.card} aria-labelledby="access-title">
              <div className={styles.cardHeading}><h2 id="access-title">Your account</h2><span className={styles.status}><span aria-hidden="true" />Signed in</span></div>
              <dl className={styles.details}>
                <div><dt>Name</dt><dd>{user.name}</dd></div>
                <div><dt>Account type</dt><dd>{role}</dd></div>
                <div><dt>Access</dt><dd>Invitation-only</dd></div>
              </dl>
              <button className={styles.textButton} type="button" onClick={() => selectView("account")}>View account details <Icon kind="arrow" /></button>
            </section>
            <section className={styles.card} aria-labelledby="updates-title">
              <div className={styles.cardHeading}><h2 id="updates-title">Cooperative updates</h2><span className={styles.tag}>Not connected yet</span></div>
              <div className={styles.empty}>
                <span className={styles.iconTile}><Icon kind="updates" /></span>
                <h3>A place to stay connected.</h3>
                <p>News and announcements will live here when the cooperative’s updates are connected.</p>
              </div>
            </section>
          </div>
          <section className={`${styles.card} ${styles.explore}`} aria-labelledby="explore-title">
            <h2 id="explore-title">Get to know your cooperative</h2>
            <Link className={styles.resource} href="/#cooperative"><span className={styles.iconTile}><Icon kind="home" /></span><span><strong>How the cooperative works</strong><small>People, capital, and communities working together.</small></span><Icon kind="arrow" /></Link>
            <Link className={styles.resource} href="/#members"><span className={styles.iconTile}><Icon kind="people" /></span><span><strong>Meet the visionaries</strong><small>The people shaping WisConnect.</small></span><Icon kind="arrow" /></Link>
            <Link className={styles.resource} href="/#businesses"><span className={styles.iconTile}><Icon kind="business" /></span><span><strong>Member enterprises</strong><small>Explore the cooperative’s public enterprise showcase.</small></span><Icon kind="arrow" /></Link>
          </section>
        </> : view === "account" ? <div className={styles.settings}>
          <p className={styles.settingsIntro}>Manage your personal information and access to WisConnect.</p>
          <section id="account-information" className={styles.accountSection} aria-labelledby="account-information-title">
            <h2 id="account-information-title">Account information</h2>
            <form className={styles.accountForm} aria-label="Update account information" onSubmit={async event => {
              event.preventDefault();
              if (savingName) return;
              const input = event.currentTarget.elements.namedItem("name") as HTMLInputElement;
              const name = input.value.trim();
              if (!name) { input.setCustomValidity("Enter your name."); input.reportValidity(); return; }
              setSavingName(true); setNameError(""); setProfileNotice("");
              try { await onUpdateName(name); input.value = name; setProfileNotice("Your name has been updated."); }
              catch (error) { setNameError(error instanceof Error ? error.message : "Could not save your name. Please try again."); }
              finally { setSavingName(false); }
            }}>
              <label htmlFor="profile-name">Name<input id="profile-name" name="name" defaultValue={user.name} autoComplete="name" required maxLength={100} disabled={savingName} onInput={event => event.currentTarget.setCustomValidity("")} /></label>
              <label htmlFor="profile-email"><span id="email-label">Email</span><input id="profile-email" type="email" value={user.email} readOnly aria-labelledby="email-label" aria-describedby="email-help" /><small id="email-help">Contact your cooperative administrator to change your sign-in email.</small></label>
              <div className={styles.accountFormActions}>
                <button className={styles.primaryAction} type="submit" disabled={savingName}>{savingName && <span className={styles.spinner} aria-hidden="true" />}{savingName ? "Saving…" : "Update info"}</button>
                {nameError && <p role="alert">{nameError}</p>}
                {profileNotice && <p role="status">{profileNotice}</p>}
              </div>
            </form>
          </section>
          <section id="account-access" className={styles.accountSection} aria-labelledby="account-access-title">
            <h2 id="account-access-title">Account access</h2>
            <p>Your access is managed by the cooperative. Contact your administrator for help with your password or permissions.</p>
            <dl className={styles.accessDetails}><div><dt>Account type</dt><dd>{role}</dd></div><div><dt>Membership access</dt><dd>Invitation-only</dd></div></dl>
            <button className={styles.secondaryAction} type="button" disabled={busy} onClick={onSignOut}><Icon kind="logout" />{busy ? "Signing out…" : "Sign out"}</button>
          </section>
          <section id="account-support" className={styles.accountSection} aria-labelledby="account-support-title">
            <h2 id="account-support-title">Support</h2>
            <p>Find help with your account and cooperative membership.</p>
            <button className={styles.secondaryAction} type="button" onClick={() => selectView("help")}><Icon kind="help" />Get support</button>
          </section>
        </div> : <section className={`${styles.card} ${styles.help}`} aria-labelledby="help-title">
          <h2 id="help-title">Member access & support</h2>
          <h3>Need help with your account?</h3><p>You can update your name in Settings. For sign-in email changes or help with your password, contact the cooperative administrator who invited you.</p>
          <h3>Looking for cooperative information?</h3><p>The public website introduces the cooperative, its visionaries, and member enterprises.</p>
          <Link className={styles.textButton} href="/">Visit the WisConnect website <Icon kind="arrow" /></Link>
          <h3>What’s available right now?</h3><p>Your account details and sign-in access are connected. Cooperative updates, business management, and marketplace tools are not connected yet.</p>
        </section>}
        <p className={styles.localNote}>WisConnect member workspace <span aria-hidden="true">·</span> Local development</p>
      </div>
    </main>
    {inviteOpen && user.role === "admin" && <InviteDialog sendInvitation={sendInvitation} onSent={() => setInvitationsVersion(value => value + 1)} onClose={() => setInviteOpen(false)} />}
  </div>;
}

export function DashboardGate({ error, onRetry }: { error: string; onRetry: () => void }) {
  return <div className={`${inter.className} ${styles.dashboard}`}>
    <aside className={styles.sidebar} aria-label="WisConnect"><Link className={styles.brand} href="/"><img src={assetPath("logo-horizontal.webp")} alt="WisConnect" width="154" height="36" /></Link></aside>
    <header className={styles.workspaceHeader}><span>WisConnect</span></header>
    <main className={styles.workspace}><div className={styles.content}><DataState state={error ? "error" : "loading"} title={error ? "Could not load your workspace" : "Loading your workspace…"} description={error || undefined}>{error && <button className={styles.secondaryAction} type="button" onClick={onRetry}>Try again</button>}</DataState></div></main>
  </div>;
}
