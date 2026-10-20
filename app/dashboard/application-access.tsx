'use client';
import { useEffect, useRef, useState } from 'react';
import { accountRequest } from '../account-api';
import { newRequestId } from '../local-api';
import LocalInboxLink from '../local-inbox-link';
import type { ApplicationDetail } from './applications';
import styles from './dashboard.module.css';
export type AccountAccess = {account_exists:boolean;invitation:{id:number;email:string;status:'pending'|'used'|'revoked'|'expired';expires_at:string;created_at:string;source_application_id:number|null}|null};
const labels={pending:'Pending',used:'Accepted',revoked:'Revoked',expired:'Expired'};
export default function ApplicationAccess({record,disabled,request,onBusy,onUpdated}:{record:ApplicationDetail;disabled:boolean;request:typeof accountRequest;onBusy:(busy:boolean)=>void;onUpdated:(value:ApplicationDetail)=>void}){
  const [confirm,setConfirm]=useState<'invite'|'revoke'|null>(null);const [error,setError]=useState('');const [notice,setNotice]=useState('');const [busy,setBusy]=useState(false);
  const cancel=useRef<HTMLButtonElement>(null);const pending=useRef(false);const retry=useRef<{version:number;request_id:string}|null>(null);
  const access=record.account_access;const invitation=access.invitation;
  useEffect(()=>{if(confirm)cancel.current?.focus();},[confirm]);
  async function act(action:'invite'|'revoke'){
    if(disabled||pending.current)return;pending.current=true;setBusy(true);onBusy(true);setError('');setNotice('');
    try{
      let updated:ApplicationDetail;
      if(action==='invite'){
        if(retry.current?.version!==record.version)retry.current={version:record.version,request_id:newRequestId()};
        updated=await request(`/applications/${record.id}/invite`,'POST',retry.current);
      }else{
        await request(`/invitations/${invitation!.id}`,'DELETE');
        updated=await request(`/applications/${record.id}`);
      }
      onUpdated(updated);retry.current=null;setConfirm(null);setNotice(action==='invite'?'Account invitation captured in the local test inbox. Membership status is unchanged.':'Invitation revoked. The old link cannot create an account.');
    }catch(err){setError(err instanceof Error?err.message:'Could not complete the invitation action.');}
    finally{pending.current=false;setBusy(false);onBusy(false);}
  }
  return <section className={styles.profileFormPanel} aria-label="Applicant account access">
    <header className={styles.profilePanelHeading}><h3>Account invitation</h3><p>Creating a workspace account does not approve cooperative membership.</p></header>
    <div className={styles.profileFormBody}>
      <p className={styles.applicationRecipient}>{record.email}</p>
      {access.account_exists?<p>This email already has an account. No new invitation is needed.</p>:<p>{invitation?`Latest invitation: ${labels[invitation.status]}.`:'No invitation has been sent to this email.'}</p>}
      {invitation&&<p className={styles.profileExplanation}>Invitation #{invitation.id} · {invitation.source_application_id===record.id?'Linked to this introduction':invitation.source_application_id?`From introduction #${invitation.source_application_id}`:'Sent from account invitations'} · Expires {new Date(invitation.expires_at).toLocaleString()}</p>}
      {disabled&&!busy&&<p className={styles.profileExplanation}>Save your review changes before managing account access.</p>}
      {confirm?<div role="alert" className={styles.applicationInviteConfirmation}><p>{confirm==='invite'?`Invite ${record.email} to create a Member-role workspace account? The single-use link expires in 24 hours and goes only to the local test inbox.`:`Revoke invitation #${invitation?.id} for ${record.email}? This disables the link; existing accounts are unaffected.`}</p><div className={styles.dialogActions}><button ref={cancel} className={styles.secondaryAction} disabled={busy} onClick={()=>setConfirm(null)}>Cancel</button><button className={styles.primaryAction} disabled={busy||disabled} onClick={()=>void act(confirm)}>{busy?'Working…':confirm==='invite'?'Confirm account invitation':'Confirm revocation'}</button></div></div>:<div className={styles.businessPublishActions}>
        {!access.account_exists&&invitation?.status!=='pending'&&<button type="button" className={styles.primaryAction} disabled={disabled||busy} onClick={()=>setConfirm('invite')}>Invite to create an account</button>}
        {!access.account_exists&&invitation?.status==='pending'&&<button type="button" className={styles.secondaryAction} disabled={disabled||busy} onClick={()=>setConfirm('revoke')}>Revoke pending invitation</button>}
        <LocalInboxLink className={styles.textButton}>Local test inbox</LocalInboxLink>
      </div>}
      {error&&<div className={styles.inlineError} role="alert"><p>{error}</p><p>Retry the same action, or close and reopen the introduction to load its latest state.</p></div>}
      {notice&&<p role="status">{notice}</p>}
    </div>
  </section>;
}
