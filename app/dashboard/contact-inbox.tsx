'use client';
import { useEffect, useRef, useState } from 'react';
import { accountRequest } from '../account-api';
import { newRequestId } from '../local-api';
import DataState from './data-state';
import styles from './dashboard.module.css';

export type Inquiry = {id:number;name:string;email:string;topic:string;message:string;created_at:string;email_status:'pending'|'failed'|'sent';email_mode:string;email_sent_at:string|null;status:'open'|'in_progress'|'closed';assignee_id:number|null;assignee_name:string|null;follow_up_on:string|null;version:number;updated_at:string};
export type InquiryPage = {items:Inquiry[];next_cursor:number|null;total?:number;today?:string};
type History = {items:{id:number;actor_name:string;summary:string;note:string;created_at:string}[];next_cursor:number|null};
const labels={open:'Open',in_progress:'In progress',closed:'Closed'};
const delivery=(row:Inquiry)=>row.email_status==='sent'?(row.email_mode==='local'?'Captured in local test inbox':'Accepted by email service'):row.email_status==='failed'?'Notification failed':'Notification pending';
const dateLabel=(value:string)=>new Date(value+'T12:00:00Z').toLocaleDateString(undefined,{timeZone:'UTC',year:'numeric',month:'short',day:'numeric'});
export default function ContactInbox({request=accountRequest}: {
  request?:typeof accountRequest;
  loadInquiries?: (signal:AbortSignal,before?:number)=>Promise<InquiryPage>;
  retryInquiryEmail?: (id:number)=>Promise<Inquiry>;
}) {
  const [data,setData]=useState<InquiryPage|null>(null);const [loading,setLoading]=useState(true);const [more,setMore]=useState(false);const [error,setError]=useState('');
  const [query,setQuery]=useState('');const [q,setQ]=useState('');const [status,setStatus]=useState('active');const [assignment,setAssignment]=useState('all');const [due,setDue]=useState('all');const [mail,setMail]=useState('all');
  const [attempt,setAttempt]=useState(0);const [selected,setSelected]=useState<number|null>(null);const heading=useRef<HTMLHeadingElement>(null);const active=useRef<AbortController|null>(null);
  const params=new URLSearchParams({q,status,assignment,due,delivery:mail}).toString();
  useEffect(()=>{if(selected!==null)return;const controller=new AbortController();active.current=controller;setLoading(true);setData(null);setError('');setMore(false);
    request(`/contact-inquiries?${params}`,'GET',undefined,controller.signal).then(value=>{if(!controller.signal.aborted)setData(value);}).catch(err=>{if(!controller.signal.aborted)setError(err.message);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});return()=>controller.abort();
  },[params,attempt,selected,request]);
  async function loadMore(){const controller=active.current;if(!controller||!data?.next_cursor||more)return;setMore(true);setError('');try{const next=await request(`/contact-inquiries?${params}&before=${data.next_cursor}`,'GET',undefined,controller.signal);if(!controller.signal.aborted)setData(old=>({...next,items:[...(old?.items??[]),...next.items]}));}catch(err){if(!controller.signal.aborted)setError(err instanceof Error?err.message:'Could not load more inquiries.');}finally{if(!controller.signal.aborted)setMore(false);}}
  if(selected!==null)return <InquiryEditor id={selected} request={request} onClose={()=>{setSelected(null);setAttempt(n=>n+1);requestAnimationFrame(()=>heading.current?.focus());}}/>;
  return <section className={`${styles.directoryPanel} ${styles.inquiryWorkspace}`} aria-label="Website contact inquiries">
    <header className={styles.directoryPanelHeading}><h2 ref={heading} tabIndex={-1}>Inquiry follow-up{!loading&&!error&&<span>{data?.total??0}</span>}</h2><button className={styles.textButton} disabled={loading||more} onClick={()=>setAttempt(n=>n+1)}>Refresh</button></header>
    <form className={styles.directoryFilters} onSubmit={e=>{e.preventDefault();setQ(query.trim());}}>
      <label><span className={styles.visuallyHidden}>Search inquiries</span><input value={query} maxLength={100} placeholder="Search name, email or topic" onChange={e=>setQuery(e.target.value)}/></label>
      <label><span className={styles.visuallyHidden}>Follow-up status</span><select value={status} onChange={e=>setStatus(e.target.value)}><option value="active">Open & in progress</option><option value="all">All statuses</option>{Object.entries(labels).map(([key,name])=><option key={key} value={key}>{name}</option>)}</select></label>
      <label><span className={styles.visuallyHidden}>Assignment</span><select value={assignment} onChange={e=>setAssignment(e.target.value)}><option value="all">All administrators</option><option value="mine">Assigned to me</option><option value="unassigned">Unassigned</option></select></label>
      <label><span className={styles.visuallyHidden}>Follow-up date filter</span><select value={due} onChange={e=>setDue(e.target.value)}><option value="all">All dates</option><option value="due">Due today or earlier</option><option value="overdue">Overdue</option><option value="unscheduled">No follow-up date</option></select></label>
      <label><span className={styles.visuallyHidden}>Notification delivery</span><select value={mail} onChange={e=>setMail(e.target.value)}><option value="all">All notifications</option><option value="failed">Notification failed</option><option value="pending">Notification pending</option><option value="sent">Notification sent</option></select></label>
      <button className={styles.secondaryAction}>Search</button><button type="button" className={styles.textButton} onClick={()=>{setQuery('');setQ('');setStatus('active');setAssignment('all');setDue('all');setMail('all');}}>Reset filters</button>
    </form>
    <p className={styles.recordFootnote}>Follow-up dates use the UTC calendar day. Email notification delivery does not mean an inquiry has been answered.</p>
    {loading?<DataState state="loading" title="Loading inquiries…"/>:<>
      {error&&<DataState state="error" title="Could not load inquiries" description={error}><button className={styles.secondaryAction} onClick={()=>setAttempt(n=>n+1)}>Try again</button></DataState>}
      {data?.items.length?<ul className={styles.inquiryFollowupList}>{data.items.map(row=><li key={row.id}><button onClick={()=>setSelected(row.id)} aria-label={`Review inquiry ${row.id} from ${row.name}`}><span><strong>{row.name}</strong><small>{row.topic} · #{row.id}</small><small>{row.assignee_name||'Unassigned'}{row.follow_up_on?` · Follow up ${dateLabel(row.follow_up_on)}`:' · No follow-up date'}</small></span><span><span className={styles.roleBadge}>{labels[row.status]}</span>{row.status!=='closed'&&row.follow_up_on&&data.today&&row.follow_up_on<=data.today&&<small className={styles.inquiryDue}>{row.follow_up_on<data.today?'Overdue':'Due today'}</small>}<small>{delivery(row)}</small></span></button></li>)}</ul>:!error&&<DataState state="empty" title="No inquiries match" description="Change the filters or wait for a new website inquiry."/>}
      <footer className={styles.directoryPagination}><p role="status">Showing {data?.items.length??0} of {data?.total??0} inquiries</p>{data?.next_cursor&&<button className={styles.secondaryAction} disabled={more} onClick={()=>void loadMore()}>{more?'Loading…':'Load older inquiries'}</button>}</footer>
    </>}
  </section>;
}

function InquiryEditor({id,request,onClose}:{id:number;request:typeof accountRequest;onClose:()=>void}){
  const [row,setRow]=useState<Inquiry|null>(null);const [people,setPeople]=useState<{id:number;name:string}[]>([]);const [history,setHistory]=useState<History>({items:[],next_cursor:null});
  const [status,setStatus]=useState<Inquiry['status']>('open');const [owner,setOwner]=useState('');const [date,setDate]=useState('');const [note,setNote]=useState('');
  const [loading,setLoading]=useState(true);const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [historyError,setHistoryError]=useState('');const [notice,setNotice]=useState('');const [attempt,setAttempt]=useState(0);
  const [confirm,setConfirm]=useState<'close'|'discard'|'reload'|null>(null);const cancel=useRef<HTMLButtonElement>(null);const heading=useRef<HTMLHeadingElement>(null);const pending=useRef(false);const retry=useRef<{signature:string;body:object}|null>(null);
  function hydrate(value:Inquiry){setRow(value);setStatus(value.status);setOwner(value.assignee_id===null?'':String(value.assignee_id));setDate(value.follow_up_on??'');setNote('');retry.current=null;}
  useEffect(()=>{const controller=new AbortController();setLoading(true);setError('');Promise.all([request(`/contact-inquiries/${id}`,'GET',undefined,controller.signal),request('/contact-inquiries/assignees','GET',undefined,controller.signal),request(`/contact-inquiries/${id}/activity`,'GET',undefined,controller.signal)]).then(([value,owners,events])=>{if(!controller.signal.aborted){hydrate(value);setPeople(owners);setHistory(events);requestAnimationFrame(()=>heading.current?.focus());}}).catch(err=>{if(!controller.signal.aborted)setError(err.message);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});return()=>controller.abort();},[id,attempt,request]);
  const dirty=Boolean(row&&(status!==row.status||owner!==String(row.assignee_id??'')||date!==(row.follow_up_on??'')||note));
  useEffect(()=>{if(confirm)cancel.current?.focus();},[confirm]);
  useEffect(()=>{if(!dirty)return;const warn=(e:BeforeUnloadEvent)=>e.preventDefault();window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);
  async function activity(more=false){setHistoryError('');try{const result=await request(`/contact-inquiries/${id}/activity${more&&history.next_cursor?`?before=${history.next_cursor}`:''}`);setHistory(old=>more?{...result,items:[...old.items,...result.items]}:result);}catch(err){setHistoryError(err instanceof Error?err.message:'Could not load history.');}}
  async function act(kind:'save'|'reload'|'retry-email'|'history'){
    if(pending.current||!row)return;pending.current=true;setBusy(true);setError('');setNotice('');
    try{
      if(kind==='save'){
        const values={version:row.version,status,assignee_id:owner?Number(owner):null,follow_up_on:date||null,note};const signature=JSON.stringify(values);
        if(retry.current?.signature!==signature)retry.current={signature,body:{...values,request_id:newRequestId()}};
        hydrate(await request(`/contact-inquiries/${id}`,'PATCH',retry.current.body));setConfirm(null);setNotice('Follow-up saved. No reply was sent.');await activity();
      }else if(kind==='reload'){hydrate(await request(`/contact-inquiries/${id}`));setConfirm(null);setNotice('Saved follow-up reloaded.');await activity();}
      else if(kind==='history')await activity(Boolean(history.next_cursor));
      else{const result=await request(`/contact-inquiries/${id}/retry-email`,'POST',{});setRow(old=>old?{...old,email_status:result.email_status,email_mode:result.email_mode,email_sent_at:result.email_sent_at}:old);setNotice(delivery(result)+'. Follow-up status is unchanged.');}
    }catch(err){setError(err instanceof Error?err.message:'Could not complete this action.');}finally{pending.current=false;setBusy(false);}
  }
  if(loading)return <DataState state="loading" title="Loading inquiry…"/>;
  if(!row)return <DataState state="error" title="Could not load inquiry" description={error}><button className={styles.secondaryAction} onClick={()=>setAttempt(n=>n+1)}>Try again</button><button className={styles.textButton} onClick={onClose}>Back to inquiries</button></DataState>;
  return <section className={`${styles.businessEditor} ${styles.profileEditor} ${styles.inquiryEditor}`} aria-label="Inquiry review">
    <header className={styles.businessEditorHeading}><div><h2 ref={heading} tabIndex={-1}>{row.name} · Inquiry #{row.id}</h2><p>{row.topic} · Received {new Date(row.created_at).toLocaleString()}</p></div><button disabled={busy} className={styles.secondaryAction} onClick={()=>dirty?setConfirm('discard'):onClose()}>Back to inquiries</button></header>
    {confirm&&<div className={styles.businessConfirmation} role="alert"><p>{confirm==='close'?'Close this inquiry? This records your follow-up decision and does not send a reply. You can reopen it later.':confirm==='reload'?'Discard unsaved changes and reload the saved follow-up?':'Discard your unsaved follow-up changes?'}</p><div className={styles.dialogActions}><button ref={cancel} disabled={busy} className={styles.secondaryAction} onClick={()=>setConfirm(null)}>Keep editing</button><button disabled={busy} className={styles.primaryAction} onClick={()=>confirm==='discard'?onClose():void act(confirm==='close'?'save':'reload')}>{confirm==='close'?'Confirm close':confirm==='reload'?'Discard and reload':'Discard changes'}</button></div></div>}
    <section className={styles.profileFormPanel} aria-label="Original inquiry"><header className={styles.profilePanelHeading}><h3>Original message</h3><a href={`mailto:${row.email}?subject=${encodeURIComponent('Re: WisConnect — '+row.topic)}`}>{row.email}</a></header><div className={styles.profileFormBody}><p className={styles.inquiryMessage}>{row.message}</p><p className={styles.profileExplanation}>Reply through your email app. This workspace does not send or automatically track replies.</p><div className={styles.inquiryDelivery}><p>{delivery(row)}</p>{row.email_status!=='sent'&&<button disabled={busy} className={styles.secondaryAction} onClick={()=>void act('retry-email')}>Retry notification</button>}</div></div></section>
    <form className={`${styles.accountForm} ${styles.profileFormPanel}`} aria-label="Inquiry follow-up" onSubmit={e=>{e.preventDefault();if(status==='closed'&&row.status!=='closed')setConfirm('close');else void act('save');}}>
      <header className={styles.profilePanelHeading}><h3>Follow-up</h3><p>Private to administrators. Dates use the UTC calendar day.</p></header><div className={styles.profileFormBody}><fieldset className={styles.profileFields} disabled={busy}><legend className={styles.visuallyHidden}>Follow-up details</legend>
        <label>Status<select value={status} onChange={e=>setStatus(e.target.value as Inquiry['status'])}>{Object.entries(labels).map(([key,name])=><option key={key} value={key}>{name}</option>)}</select></label>
        <label>Assigned administrator<select value={owner} onChange={e=>setOwner(e.target.value)}><option value="">Unassigned</option>{owner&&!people.some(p=>String(p.id)===owner)&&<option value={owner}>{row.assignee_name||'Previous administrator'} (unavailable)</option>}{people.map(person=><option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
        <label>Follow-up date<input type="date" value={date} onChange={e=>setDate(e.target.value)}/><small>Closed inquiries are excluded from due and overdue counts.</small></label>
        <label className={styles.profileBio}>Add a private note<textarea rows={4} maxLength={2000} value={note} onChange={e=>setNote(e.target.value)}/><small>Saved notes stay in the activity history.</small></label>
      </fieldset>{error&&<div className={styles.inlineError} role="alert"><p>{error}</p><button type="button" className={styles.secondaryAction} disabled={busy} onClick={()=>dirty?setConfirm('reload'):void act('reload')}>Reload saved follow-up</button><small>Your entered values are kept until you leave or reload.</small></div>}</div>
      <footer className={styles.profileFormFooter}><p role="status">{notice}</p><button className={styles.primaryAction} disabled={busy||!dirty}>{busy?'Working…':'Save follow-up'}</button></footer>
    </form>
    <section className={styles.profileFormPanel} aria-label="Inquiry activity"><header className={styles.profilePanelHeading}><h3>Activity history</h3></header><ol className={styles.introductionActivity}>{history.items.map(event=><li key={event.id}><strong>{event.summary}</strong>{event.note&&<p className={styles.inquiryMessage}>{event.note}</p>}<small>{event.actor_name} · {new Date(event.created_at).toLocaleString()}</small></li>)}</ol><div className={styles.profileFormBody}>{historyError&&<p role="alert">{historyError}</p>}<button className={styles.textButton} disabled={busy} onClick={()=>void act('history')}>{history.next_cursor?'Load older activity':'Refresh activity'}</button></div></section>
  </section>;
}
