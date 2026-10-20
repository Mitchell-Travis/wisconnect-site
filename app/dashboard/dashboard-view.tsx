"use client";

import Applications from './applications';
import Businesses from './businesses';
import Reports from './reports';
import Team from './team';
import {can, staff, accessLabel, type WorkspaceUser} from '../workspace-access';
import Link from "next/link";
import localFont from "next/font/local";
import { useEffect, useRef, useState } from "react";
import { assetPath } from "../assets";
import MemberNavigation from "./member-navigation";
import styles from "./dashboard.module.css";
import SectionPreview from "./section-preview";
import WorkspaceHome from "./workspace-home";
import Icon from "./workspace-icon";
import DataState from "./data-state";
import ThemeToggle from "./theme-toggle";
import { InviteDialog, InvitationsList, Invitation } from "./invitations";
import MembersDirectory from "./members-directory";
import MemberProfile from "./member-profile";
import AccountSessions from "./account-sessions";
import ContactInbox, { Inquiry, InquiryPage } from "./contact-inbox";
import { memberItems, sections, SectionKey, View } from "./sections";

const inter = localFont({ src: "./fonts/InterVariable.woff2", weight: "100 900", style: "normal", display: "swap" });

export type { View } from "./sections";
type User = WorkspaceUser;

export default function DashboardView({ user, busy, error, onSignOut, view, onViewChange, onProfileSaved, loadInvitations, sendInvitation, revokeInvitation, loadInquiries, retryInquiryEmail }: {
  user: User; busy: boolean; error: string; onSignOut: () => void;
  view: View; onViewChange: (view: View) => void;
  onProfileSaved: (name: string) => void;
  loadInvitations: (signal: AbortSignal) => Promise<Invitation[]>;
  sendInvitation: (email: string) => Promise<{ message: string }>;
  revokeInvitation: (id: number) => Promise<void>;
  loadInquiries: (signal: AbortSignal, before?: number) => Promise<InquiryPage>;
  retryInquiryEmail: (id: number) => Promise<Inquiry>;
}) {
  const [applicationStatus, setApplicationStatus] = useState<"all" | "new">("all");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invitationsVersion, setInvitationsVersion] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const workspace = useRef<HTMLElement>(null);
  const accountButton = useRef<HTMLButtonElement>(null);
  const accountMenu = useRef<HTMLDivElement>(null);
  const notificationsButton = useRef<HTMLButtonElement>(null);
  const notificationsPanel = useRef<HTMLDivElement>(null);
  const mobileNotificationsButton = useRef<HTMLButtonElement>(null);
  const mobileMenu = useRef<HTMLDialogElement>(null);
  const mobileMenuButton = useRef<HTMLButtonElement>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [openPanel, setOpenPanel] = useState<"account" | "notifications" | null>(null);
  const panelTrigger = useRef<HTMLButtonElement | null>(null);
  const isStaff = staff(user);
  const staffItems: View[] = ([["businesses", "businesses.edit"], ["applications", "applications.review"], ["inquiries", "inquiries.manage"], ["invitations", "invitations.manage"], ["reports", "reports.view"]] as const).filter(([, permission]) => can(user, permission)).map(([key]) => key);
  const navInfo = (key: View) => key === "invitations" ? {title: "Invitations", icon: "email" as const} : sections[key as SectionKey];
  const mobileSections: readonly View[] = isStaff ? staffItems : user.role === "admin" ? (["members", "inquiries", "businesses", "reports", "team", "payments", "projects", "documents"] as const) : memberItems;
  const firstName = user.name.trim().split(/\s+/)[0];
  const preview = view in sections ? sections[view as SectionKey] : null;
  const memberArea = ["members", "applications", "invitations"].includes(view);
  const financeArea = ["payments", "investments"].includes(view);
  const activeItem = user.role === "admin" && memberArea ? "members" : financeArea ? "payments" : view;
  const initials = user.name.trim().split(/\s+/).slice(0, 2).map(part => Array.from(part)[0]).join("").toUpperCase();
  const role = accessLabel(user);
  const pageTitle = preview ? preview.title : view === "home" ? "Overview" : view === "account" ? "Settings" : view === "invitations" ? "Invitations" : "Support";

  useEffect(() => {
    const close = () => { setOpenPanel(null); mobileMenu.current?.close(); };
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  useEffect(() => {
    if (!openPanel) return;
    const panel = openPanel === "account" ? accountMenu.current : notificationsPanel.current;
    panel?.querySelector<HTMLElement>(openPanel === "account" ? "button" : "h2")?.focus({ preventScroll: true });
    const dismissOutside = (event: Event) => {
      if (event.target instanceof Node && !panel?.contains(event.target) && !panelTrigger.current?.contains(event.target)) setOpenPanel(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpenPanel(null);
        panelTrigger.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("focusin", dismissOutside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("focusin", dismissOutside);
      document.removeEventListener("keydown", escape);
    };
  }, [openPanel]);

  function togglePanel(next: "account" | "notifications", trigger: HTMLButtonElement) {
    if (openPanel === next) { setOpenPanel(null); return; }
    panelTrigger.current = trigger;
    const panel = next === "account" ? accountMenu.current : notificationsPanel.current;
    if (!panel) return;
    const rect = trigger.getBoundingClientRect();
    if (next === "account") {
      panel.style.left = `${Math.max(8, Math.min(rect.left, innerWidth - 288))}px`;
      panel.style.maxHeight = `${Math.max(120, rect.top - 12)}px`;
      panel.style.bottom = `${innerHeight - rect.top + 4}px`;
    } else {
      panel.style.top = `${rect.bottom + 8}px`;
      panel.style.right = `${Math.max(16, innerWidth - rect.right)}px`;
      panel.style.maxHeight = `${Math.max(0, innerHeight - rect.bottom - 24)}px`;
    }
    setOpenPanel(next);
  }

  function selectView(next: View, status: "all" | "new" = "all") {
    setApplicationStatus(status);
    setOpenPanel(null);
    mobileMenu.current?.close();
    onViewChange(next);
    requestAnimationFrame(() => { workspace.current?.scrollTo(0, 0); if (innerWidth < 640) window.scrollTo(0, 0); heading.current?.focus({ preventScroll: true }); });
  }

  return <div className={`${inter.className} ${styles.dashboard}`} data-dashboard-view={view} data-sidebar-collapsed={sidebarCollapsed}>
    <a className={styles.skip} href="#dashboard-content">Skip to dashboard</a>
    <aside className={styles.sidebar} aria-label="Member workspace">
      <Link className={styles.brand} href="/" aria-label="WisConnect home"><img src={assetPath("logo-horizontal.webp")} alt="WisConnect" width="154" height="36" /><span className={styles.brandMark} aria-hidden="true">W</span></Link>
      <button className={styles.sidebarToggle} type="button" aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"} title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"} aria-expanded={!sidebarCollapsed} aria-controls="dashboard-navigation" onClick={() => setSidebarCollapsed(value => !value)}><Icon kind="sidebar"/><span className={styles.navText}>Collapse sidebar</span></button>
      <div className={styles.workspaceIdentity}><span className={styles.workspaceMark} aria-hidden="true">W</span><span className={styles.navText}><strong>WisConnect</strong><small>{user.role === "admin" || isStaff ? "Cooperative workspace" : "Member workspace"}</small></span></div>
      <nav id="dashboard-navigation" className={styles.navigation} aria-label="Dashboard navigation">
        <button type="button" aria-label="Overview" title="Overview" aria-current={view === "home" ? "page" : undefined} onClick={() => selectView("home")}><Icon kind="home" /><span className={styles.navText}>Overview</span></button>
        {user.role === "admin" ? <>
          {(["members", "inquiries", "businesses", "reports"] as const).map(key => <button key={key} type="button" aria-label={sections[key].title} title={sections[key].title} aria-current={activeItem === key ? "page" : undefined} onClick={() => selectView(key)}><Icon kind={sections[key].icon} /><span className={styles.navText}>{sections[key].title}</span></button>)}
          <button type="button" aria-label="Team & access" title="Team & access" aria-current={view === "team" ? "page" : undefined} onClick={() => selectView("team")}><Icon kind="shield"/><span className={styles.navText}>Team & access</span></button><p className={`${styles.navigationLabel} ${styles.navText}`}>In development</p>
          {(["payments", "projects", "documents"] as const).map(key => <button key={key} type="button" aria-label={key === "payments" ? "Finance" : sections[key].title} title={`${key === "payments" ? "Finance" : sections[key].title} · In development`} aria-current={activeItem === key ? "page" : undefined} onClick={() => selectView(key)}><Icon kind={sections[key].icon} /><span className={styles.navText}>{key === "payments" ? "Finance" : sections[key].title}</span></button>)}

        </> : isStaff ? <>{staffItems.map(key => <button key={key} type="button" aria-current={view === key ? "page" : undefined} onClick={() => selectView(key)}><Icon kind={navInfo(key).icon}/><span className={styles.navText}>{navInfo(key).title}</span></button>)}</> : <><p className={`${styles.navigationLabel} ${styles.navText}`}>In development</p>{memberItems.map(key => <button key={key} type="button" aria-label={sections[key].title} title={sections[key].title} aria-current={activeItem === key ? "page" : undefined} onClick={() => selectView(key)}><Icon kind={sections[key].icon} /><span className={styles.navText}>{sections[key].title}</span></button>)}</>}
        <div className={styles.navigationDivider}/>
        <button type="button" aria-label="Help & support" title="Help & support" aria-current={view === "help" ? "page" : undefined} onClick={() => selectView("help")}><Icon kind="help" /><span className={styles.navText}>Help & support</span></button>
      </nav>
      <div className={styles.sidebarAccount}>
        <button ref={accountButton} className={styles.identity} type="button" aria-controls="account-menu" onClick={event => togglePanel("account", event.currentTarget)} aria-label={`Account menu for ${user.name}`} aria-haspopup="menu" aria-expanded={openPanel === "account"} onKeyDown={event => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); if (openPanel !== "account") togglePanel("account", event.currentTarget); }
        }}>
          <span className={styles.avatar} aria-hidden="true">{initials}</span>
          <span className={styles.identityText}><strong title={user.name}>{user.name}</strong></span>
          <Icon kind="more" />
        </button>
        <div ref={accountMenu} id="account-menu" className={styles.accountMenu} hidden={openPanel !== "account"} role="menu" aria-label="Account" onKeyDown={event => {
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
          <div className={styles.accountMenuFooter}><ThemeToggle onSelect={() => { setOpenPanel(null); accountButton.current?.focus(); }} /><button type="button" role="menuitem" tabIndex={-1} disabled={busy} onClick={onSignOut}>{busy ? <span className={styles.spinner} aria-hidden="true" /> : <Icon kind="logout" />}{busy ? "Signing out…" : "Sign out"}</button></div>
        </div>
      </div>
    </aside>

    <header className={styles.workspaceHeader} aria-label="Workspace context">
      <span>WisConnect</span><span aria-hidden="true">/</span><strong>{pageTitle}</strong>
      <button ref={notificationsButton} className={styles.notificationsButton} type="button" aria-controls="notifications-panel" onClick={event => togglePanel("notifications", event.currentTarget)} aria-label="Notifications" aria-haspopup="dialog" aria-expanded={openPanel === "notifications"}><Icon kind="bell" /></button>
    </header>
    <header className={styles.mobileHeader}>
      <button ref={mobileMenuButton} type="button" className={styles.mobileBack} aria-label="Open workspace menu" aria-haspopup="dialog" aria-expanded="false" onClick={() => { mobileMenu.current?.showModal(); mobileMenu.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true }); mobileMenuButton.current?.setAttribute("aria-expanded", "true"); }}><Icon kind="menu"/></button>
      <span>{pageTitle}</span><button ref={mobileNotificationsButton} type="button" className={styles.mobileNotification} aria-controls="notifications-panel" onClick={event => togglePanel("notifications", event.currentTarget)} aria-label="Notifications" aria-haspopup="dialog" aria-expanded={openPanel === "notifications"}><Icon kind="bell"/></button>
    </header>
    <dialog ref={mobileMenu} className={styles.mobileMenuDialog} aria-label="Workspace menu" onClose={() => mobileMenuButton.current?.setAttribute("aria-expanded", "false")}>
      <div className={styles.mobileMenuTop}><Link href="/" aria-label="WisConnect home"><img src={assetPath("logo-horizontal.webp")} alt="WisConnect" width="154" height="36"/></Link><button type="button" autoFocus aria-label="Close workspace menu" onClick={() => mobileMenu.current?.close()}><Icon kind="close"/></button></div>
      <div className={styles.mobileMenuIdentity}><span className={styles.avatar} aria-hidden="true">{initials}</span><h2>{user.name}</h2><p>{user.email}</p></div>
      <nav className={styles.mobileMenuLinks} aria-label="Mobile workspace navigation">
        <button type="button" aria-current={view === "home" ? "page" : undefined} onClick={() => selectView("home")}><Icon kind="home"/><span>Overview</span><Icon kind="chevron"/></button>
        {mobileSections.map((key, index) => <div key={key} className={styles.mobileNavItem}>{!isStaff && index === (user.role === "admin" ? 5 : 0) && <p className={styles.mobileNavigationLabel}>In development</p>}<button key={key} type="button" aria-current={activeItem === key ? "page" : undefined} onClick={() => selectView(key)}><Icon kind={navInfo(key).icon}/><span>{key === "payments" ? "Finance" : key === "team" ? "Team & access" : navInfo(key).title}</span><Icon kind="chevron"/></button></div>)}
        <p className={styles.mobileNavigationLabel}>Your account</p>
        <button type="button" aria-current={view === "account" ? "page" : undefined} onClick={() => selectView("account")}><Icon kind="settings"/><span>Account settings</span><Icon kind="chevron"/></button>
      </nav>
      <div className={styles.mobileMenuFooter}><button type="button" onClick={() => selectView("help")}>Help & support</button><ThemeToggle menu={false} onSelect={() => {}}/><button type="button" disabled={busy} onClick={onSignOut}>{busy ? "Signing out…" : "Sign out"}</button></div>
    </dialog>
    <div ref={notificationsPanel} id="notifications-panel" className={styles.notificationsPanel} hidden={openPanel !== "notifications"} role="dialog" aria-labelledby="notifications-title" aria-describedby="notifications-availability">
      <div className={styles.notificationsHeading}><h2 id="notifications-title" tabIndex={-1}>Notifications</h2><button type="button" onClick={() => { setOpenPanel(null); panelTrigger.current?.focus({ preventScroll: true }); }} aria-label="Close notifications"><Icon kind="close" /></button></div>
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
            <a href="#account-sessions"><Icon kind="shield" />Session security</a>
            <a href="#account-support"><Icon kind="help" />Support</a>
          </div>
        </div>}
        <header className={styles.heading}>
          <div><h1 ref={heading} tabIndex={-1}><span className={styles.desktopPageTitle}>{view === "account" ? "Account settings" : pageTitle}</span><span className={styles.mobilePageTitle}>{view === "home" ? `Hi, ${firstName}` : view === "account" ? "Account settings" : pageTitle}</span></h1>
            {view !== "account" && <p><span className={styles.desktopPageSubtitle}>{preview ? preview.subtitle : view === "home" ? (user.role === "admin" ? "Review introductions and keep your cooperative connected." : "Your account and cooperative information.") : view === "invitations" ? "Manage access invitations." : "Account help and cooperative information."}</span><span className={styles.mobilePageSubtitle}>{view === "home" ? "Your workspace" : preview?.subtitle || (view === "invitations" ? "Manage access invitations." : "Account help and cooperative information.")}</span></p>}
          </div>
          {can(user,"invitations.manage") && view === "home" && <button className={styles.primaryAction} type="button" onClick={() => setInviteOpen(true)}>Invite member <Icon kind="plus" /></button>}
        </header>
        {error && <p className={styles.error} role="alert">{error}</p>}
        {user.role === "admin" && memberArea && <MemberNavigation view={view} onViewChange={selectView} onInvite={() => setInviteOpen(true)}/>}
        {user.role === "admin" && financeArea && <div className={styles.areaNavigation} role="group" aria-label="Finance">
          {([['payments', 'Payments'], ['investments', 'Investments']] as const).map(([key, label]) => <button key={key} type="button" aria-current={view === key ? "page" : undefined} onClick={() => selectView(key)}>{label}</button>)}
        </div>}

        {view === "team" ? (user.role === "admin" ? <Team/> : <p>You do not have permission to access this area. Contact an administrator.</p>) : view === "reports" ? (can(user,"reports.view") ? <Reports/> : <p>You do not have permission to access this area. Contact an administrator.</p>) : view === "businesses" ? (can(user,"businesses.edit") ? <Businesses canPublish={can(user,"businesses.publish")}/> : <p>You do not have permission to access this area. Contact an administrator.</p>) : view === "inquiries" ? (can(user,"inquiries.manage") ? <ContactInbox loadInquiries={loadInquiries} retryInquiryEmail={retryInquiryEmail}/> : <p>You do not have permission to access this area. Contact an administrator.</p>) : view === "members" ? (user.role === "admin" ? <MembersDirectory onInvite={() => setInviteOpen(true)} /> : <p>You do not have permission to access this area. Contact an administrator.</p>) : view === "applications" ? (can(user,"applications.review") ? <Applications canInvite={can(user,"invitations.manage")} key={applicationStatus} initialStatus={applicationStatus}/> : <p>You do not have permission to access this area. Contact an administrator.</p>) : preview ? (preview.adminOnly && user.role !== "admin" ? <p>You do not have permission to access this area. Contact an administrator.</p> : <SectionPreview key={view} section={view as SectionKey} />) : view === "invitations" ? (can(user,"invitations.manage") ? <InvitationsList loadInvitations={loadInvitations} revokeInvitation={revokeInvitation} version={invitationsVersion} onInvite={() => setInviteOpen(true)} /> : <p>Invitation permission is required. Contact an administrator.</p>) : view === "home" ? (isStaff ? <section className={styles.personalWorkspace} aria-label="Your staff workspace"><h2>Your work</h2>{staffItems.map(key=><button key={key} type="button" onClick={()=>selectView(key)}><Icon kind={navInfo(key).icon}/><span><strong>{navInfo(key).title}</strong></span><Icon kind="chevron"/></button>)}<p className={styles.availabilityNote}>Your administrator manages your workspace permissions.</p></section> : <WorkspaceHome admin={user.role === "admin"} onViewChange={selectView} onReviewApplications={() => selectView("applications", "new")} loadInvitations={loadInvitations} loadInquiries={loadInquiries} invitationVersion={invitationsVersion}/>) : view === "account" ? <div className={styles.settings}>
          <p className={styles.settingsIntro}>Manage your personal information and access to WisConnect.</p>
          <section id="account-information" className={styles.accountSection} aria-labelledby="account-information-title">
            <h2 id="account-information-title">Account information</h2>
            <MemberProfile onSaved={member => onProfileSaved(member.name)}/>
          </section>
          <section id="account-access" className={styles.accountSection} aria-labelledby="account-access-title">
            <h2 id="account-access-title">Account access</h2>
            <p>Your access is managed by the cooperative. Use password recovery to choose a new password; contact your administrator for permission changes.</p>
            <Link className={styles.textButton} href="/reset-password">Reset your password</Link>
            <dl className={styles.accessDetails}><div><dt>Account type</dt><dd>{role}</dd></div><div><dt>Membership access</dt><dd>Invitation-only</dd></div></dl>
            <button className={styles.secondaryAction} type="button" disabled={busy} onClick={onSignOut}><Icon kind="logout" />{busy ? "Signing out…" : "Sign out"}</button>
          </section>
          <section id="account-sessions" className={styles.accountSection} aria-labelledby="account-sessions-title">
            <h2 id="account-sessions-title">Session security</h2>
            <AccountSessions/>
          </section>
          <section id="account-support" className={styles.accountSection} aria-labelledby="account-support-title">
            <h2 id="account-support-title">Support</h2>
            <p>Find help with your account and cooperative membership.</p>
            <button className={styles.secondaryAction} type="button" onClick={() => selectView("help")}><Icon kind="help" />Get support</button>
          </section>
        </div> : <section className={`${styles.card} ${styles.help}`} aria-labelledby="help-title">
          <h2 id="help-title">Member access & support</h2>
          <h3>Need help with your account?</h3><p>You can update your profile in Settings and recover your password from the sign-in page. Contact your administrator for sign-in email changes.</p>
          <h3>Looking for cooperative information?</h3><p>The public website introduces the cooperative, its visionaries, and member enterprises.</p>
          <Link className={styles.textButton} href="/">Visit the WisConnect website <Icon kind="arrow" /></Link>
          <h3>What’s available right now?</h3><p>Your account details and sign-in access are connected. Cooperative updates, business management, and marketplace tools are not connected yet.</p>
        </section>}
        <p className={styles.localNote}>WisConnect member workspace <span aria-hidden="true">·</span> Local development</p>
      </div>
    </main>
    {inviteOpen && can(user,"invitations.manage") && <InviteDialog sendInvitation={sendInvitation} onSent={() => setInvitationsVersion(value => value + 1)} onClose={() => setInviteOpen(false)} />}
  </div>;
}

export function DashboardGate({ error, onRetry }: { error: string; onRetry: () => void }) {
  return <div className={`${inter.className} ${styles.dashboard}`}>
    <aside className={styles.sidebar} aria-label="WisConnect"><Link className={styles.brand} href="/"><img src={assetPath("logo-horizontal.webp")} alt="WisConnect" width="154" height="36" /></Link></aside>
    <header className={styles.workspaceHeader}><span>WisConnect</span></header>
    <main className={styles.workspace}><div className={styles.content}><DataState state={error ? "error" : "loading"} title={error ? "Could not load your workspace" : "Loading your workspace…"} description={error || undefined}>{error && <button className={styles.secondaryAction} type="button" onClick={onRetry}>Try again</button>}</DataState></div></main>
  </div>;
}
