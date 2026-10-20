"use client";

import {accessLabel} from '../workspace-access';
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { accountRequest } from "../account-api";
import type { View } from "./sections";
import type { MemberRecord } from "./member-profile";
import type { Invitation } from "./invitations";
import type { InquiryPage } from "./contact-inbox";
import Icon from "./workspace-icon";
import styles from "./dashboard.module.css";

type Resource<T> = { data: T | null; error: string; loading: boolean };
type OverviewStats = { total_accounts: number; active_accounts: number; pending_invitations: number; contact_inquiries: number; active_inquiries: number; due_inquiries: number };
type Directory = { items: MemberRecord[]; total: number };
const initial = { data: null, error: "", loading: true };

export default function WorkspaceHome({ admin, onViewChange, onReviewApplications, loadInvitations, loadInquiries, invitationVersion }: {
  admin: boolean;
  onViewChange: (view: View) => void;
  onReviewApplications: () => void;
  loadInvitations: (signal: AbortSignal) => Promise<Invitation[]>;
  loadInquiries: (signal: AbortSignal) => Promise<InquiryPage>;
  invitationVersion: number;
}) {
  const [applications, setApplications] = useState<Resource<{total: number}>>(initial);
  const [stats, setStats] = useState<Resource<OverviewStats>>(initial);
  const [members, setMembers] = useState<Resource<Directory>>(initial);
  const [invitations, setInvitations] = useState<Resource<Invitation[]>>(initial);
  const [inquiries, setInquiries] = useState<Resource<InquiryPage>>(initial);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!admin) return;
    const controller = new AbortController();
    function load<T>(request: Promise<T>, update: Dispatch<SetStateAction<Resource<T>>>) {
      update(initial);
      request.then(data => {
        if (!controller.signal.aborted) update({data, error: "", loading: false});
      }).catch(reason => {
        if (!controller.signal.aborted) update({data: null, error: reason instanceof Error ? reason.message : "Could not load records.", loading: false});
      });
    }
    load<{total: number}>(accountRequest("/applications?status=new", "GET", undefined, controller.signal), setApplications);
    load<OverviewStats>(accountRequest("/overview", "GET", undefined, controller.signal), setStats);
    load<Directory>(accountRequest("/member-directory?page_size=5", "GET", undefined, controller.signal), setMembers);
    load(loadInvitations(controller.signal), setInvitations);
    load(loadInquiries(controller.signal), setInquiries);
    return () => controller.abort();
  }, [admin, loadInvitations, loadInquiries, invitationVersion, attempt]);

  if (!admin) return <section className={styles.personalWorkspace} aria-label="Your workspace">
    <h2>Account</h2>
    <button type="button" onClick={() => onViewChange("account")}><Icon kind="account"/><span><strong>Personal information</strong><small>Update your name and contact details</small></span><Icon kind="chevron"/></button>
    <button type="button" onClick={() => onViewChange("help")}><Icon kind="help"/><span><strong>Help & support</strong><small>Account access and cooperative information</small></span><Icon kind="chevron"/></button>
    <p className={styles.availabilityNote}>Membership records, business management and documents are not available yet.</p>
  </section>;

  function state<T>(resource: Resource<T>) {
    if (resource.loading) return <p className={styles.overviewState} role="status">Loading…</p>;
    if (resource.error) return <div className={styles.overviewState} role="alert"><p>{resource.error}</p><button type="button" className={styles.textButton} onClick={() => setAttempt(value => value + 1)}>Try again</button></div>;
    return null;
  }

  return <div className={styles.operationsOverview}>
    <section aria-labelledby="overview-attention-title">
      <header className={styles.attentionHeading}><div><h2 id="overview-attention-title">Needs your attention</h2><p>Start with new introductions and pending invitations.</p></div><button className={styles.textButton} type="button" disabled={applications.loading || stats.loading} onClick={() => setAttempt(value => value + 1)}>Refresh</button></header>
      <div className={styles.attentionList}>
        <button className={styles.attentionRow} type="button" onClick={onReviewApplications}>
          <span className={styles.attentionIcon}><Icon kind="clipboard"/></span>
          <span className={styles.attentionCopy}><strong>New applications</strong><small>{applications.loading ? "Loading introductions…" : applications.error ? "Count unavailable — open applications to retry" : applications.data?.total === 0 ? "No new introductions to review" : "Introductions ready for a first review"}</small></span>
          <strong className={styles.attentionCount}>{applications.data ? applications.data.total.toLocaleString() : "—"}</strong><span className={styles.attentionAction}>Review<Icon kind="arrow"/></span>
        </button>
        <button className={styles.attentionRow} type="button" onClick={() => onViewChange("invitations")}>
          <span className={styles.attentionIcon}><Icon kind="email"/></span>
          <span className={styles.attentionCopy}><strong>Pending invitations</strong><small>{stats.loading ? "Loading invitations…" : stats.error ? "Count unavailable — open invitations to retry" : stats.data?.pending_invitations === 0 ? "No invitations awaiting acceptance" : "Sent invitations awaiting acceptance"}</small></span>
          <strong className={styles.attentionCount}>{stats.data ? stats.data.pending_invitations.toLocaleString() : "—"}</strong><span className={styles.attentionAction}>View<Icon kind="arrow"/></span>
        </button>
        <button className={styles.attentionRow} type="button" onClick={() => onViewChange("inquiries")}>
          <span className={styles.attentionIcon}><Icon kind="message"/></span>
          <span className={styles.attentionCopy}><strong>Inquiry follow-up</strong><small>{stats.loading ? "Loading inquiries…" : stats.error ? "Count unavailable — open the inbox to retry" : `${stats.data?.due_inquiries??0} due today or earlier · Open and in progress`}</small></span>
          <strong className={styles.attentionCount}>{stats.data ? stats.data.active_inquiries.toLocaleString() : "—"}</strong><span className={styles.attentionAction}>Open<Icon kind="arrow"/></span>
        </button>
      </div>
      {(stats.error || applications.error) && <p className={styles.statsError} role="alert">Some counts could not be loaded. <button className={styles.textButton} type="button" onClick={() => setAttempt(value => value + 1)}>Try again</button></p>}
    </section>
    <section className={styles.compactAccounts} aria-labelledby="overview-summary-title" aria-busy={stats.loading}>
      <div><h2 id="overview-summary-title">Account summary</h2><p>Sign-in access, including administrators.</p></div>
      <dl><div><dt>Total</dt><dd>{stats.data ? stats.data.total_accounts.toLocaleString() : "—"}</dd></div><div><dt>Active</dt><dd>{stats.data ? stats.data.active_accounts.toLocaleString() : "—"}</dd></div><div><dt>Inactive</dt><dd>{stats.data ? (stats.data.total_accounts - stats.data.active_accounts).toLocaleString() : "—"}</dd></div></dl>
      <button className={styles.textButton} type="button" onClick={() => onViewChange("members")}>View accounts<Icon kind="arrow"/></button>
    </section>
    <section className={styles.recordSection} aria-labelledby="overview-members-title">
      <header className={styles.recordHeading}><h2 id="overview-members-title"><Icon kind="people"/>Member accounts{members.data && <span>{members.data.total}</span>}</h2><button className={styles.textButton} type="button" onClick={() => onViewChange("members")}>Open directory<Icon kind="arrow"/></button></header>
      {state(members) || (members.data && (members.data.items.length ? <>
        <div className={styles.memberTableScroll}><table className={styles.memberTable}><caption className={styles.visuallyHidden}>First five member accounts, ordered by name</caption><thead><tr><th scope="col">Name</th><th scope="col">Role</th><th scope="col">Account status</th></tr></thead><tbody>{members.data.items.map(member => <tr key={member.id}><td><div className={styles.memberPerson}><span className={styles.memberAvatar} aria-hidden="true">{member.name.trim().split(/\s+/).slice(0,2).map(part => Array.from(part)[0]).join("").toUpperCase()}</span><strong>{member.name}</strong></div></td><td>{accessLabel(member)}</td><td><span className={member.active ? styles.activeAccount : styles.inactiveAccount}>{member.active ? "Active" : "Inactive"}</span></td></tr>)}</tbody></table></div>
        <p className={styles.recordFootnote}>Showing {members.data.items.length} of {members.data.total} {members.data.total === 1 ? "account" : "accounts"} · Ordered by name</p>
      </> : <p className={styles.overviewState}>No member accounts yet.</p>))}
    </section>
    <div className={styles.recordColumns}>
      <section className={styles.recordSection} aria-labelledby="overview-invitations-title">
        <header className={styles.recordHeading}><h2 id="overview-invitations-title"><Icon kind="email"/>Recent invitations</h2><button className={styles.textButton} type="button" onClick={() => onViewChange("invitations")}>View all<Icon kind="arrow"/></button></header>
        {state(invitations) || (invitations.data && (invitations.data.length ? <ul className={styles.overviewRecords}>{invitations.data.slice(0,5).map(invitation => <li key={invitation.id}><span>{invitation.email}</span><span className={styles.tag}>{invitation.status}</span></li>)}</ul> : <div className={styles.overviewState}><strong>No invitations yet</strong><p>Invitations you send will appear here.</p></div>))}
      </section>
      <section className={styles.recordSection} aria-labelledby="overview-inquiries-title">
        <header className={styles.recordHeading}><h2 id="overview-inquiries-title"><Icon kind="message"/>Recent inquiries</h2><button className={styles.textButton} type="button" onClick={() => onViewChange("inquiries")}>Open inbox<Icon kind="arrow"/></button></header>
        {state(inquiries) || (inquiries.data && (inquiries.data.items.length ? <ul className={styles.overviewRecords}>{inquiries.data.items.slice(0,5).map(inquiry => <li key={inquiry.id}><span><strong>{inquiry.name}</strong><small>{inquiry.topic}</small></span><time dateTime={inquiry.created_at}>{new Date(inquiry.created_at).toLocaleDateString(undefined,{month:"short",day:"numeric"})}</time></li>)}</ul> : <div className={styles.overviewState}><strong>No inquiries yet</strong><p>Messages from the website’s contact form will appear here.</p></div>))}
      </section>
    </div>
  </div>;
}
