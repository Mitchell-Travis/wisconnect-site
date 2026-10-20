'use client';
import ApplicationAccess, { type AccountAccess } from './application-access';
import { newRequestId } from '../local-api';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { accountRequest } from '../account-api';
import styles from './dashboard.module.css';
import DataState from './data-state';
import Icon from './workspace-icon';

const statuses = {new: 'New', reviewing: 'Reviewing', waiting: 'Waiting for information'};
type Status = keyof typeof statuses;
type Application = {id: number; name: string; email: string; location: string; status: Status; reviewer_id: number | null; reviewer_name: string | null; created_at: string; updated_at: string; version: number};
type Activity = {items: {id: number; actor_name: string; summary: string; note: string; created_at: string}[]; next_cursor: number | null};
export type ApplicationDetail = Application & {expertise: string; contribution: string; activity: Activity; account_access: AccountAccess};
type Detail = ApplicationDetail;
type Reviewer = {id: number; name: string};
const date = (value: string) => new Date(value).toLocaleString();

export default function Applications({request = accountRequest, initialStatus = "all", canInvite = true}: {canInvite?: boolean; request?: typeof accountRequest; initialStatus?: "all" | "new"}) {
  const [result,setResult] = useState<{items: Application[]; total: number; page_size: number} | null>(null);
  const [query,setQuery] = useState(''); const [search,setSearch] = useState('');
  const [status,setStatus] = useState<string>(initialStatus); const [assignment,setAssignment] = useState('all');
  const [page,setPage] = useState(1); const [attempt,setAttempt] = useState(0);
  const [loading,setLoading] = useState(true); const [error,setError] = useState('');
  const [selected,setSelected] = useState<number | null>(null);
  const container = useRef<HTMLElement>(null); const restore = useRef<number | null>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  useEffect(()=>{
    const controller = new AbortController();setLoading(true);setError('');
    request(`/applications?${new URLSearchParams({q:search,status,assignment,page:String(page)})}`,'GET',undefined,controller.signal)
      .then(data=>{if(!controller.signal.aborted)setResult(data);})
      .catch(err=>{if(!controller.signal.aborted)setError(err.message);})
      .finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    return ()=>controller.abort();
  },[search,status,assignment,page,attempt,request]);
  useEffect(()=>{
    if(loading || selected !== null || restore.current===null)return;
    (container.current?.querySelector<HTMLButtonElement>(`[data-application="${restore.current}"]`) || container.current)?.focus({preventScroll:true});restore.current=null;
  },[loading,selected,result]);
  const filtered = Boolean(search || status!=='all' || assignment!=='all');
  const clear = ()=>{setQuery('');setSearch('');setStatus('all');setAssignment('all');setPage(1);searchInput.current?.focus();};
  return <section ref={container} tabIndex={-1} className={`${styles.membersDirectory} ${styles.applications}`} aria-label="Membership introductions">
    <div className={styles.directoryPanel}>
      <header className={styles.directoryPanelHeading}><h2>Introductions{!loading&&!error&&result&&<span>{result.total}</span>}</h2><button type="button" className={styles.textButton} disabled={loading} onClick={()=>setAttempt(a=>a+1)}>Refresh</button></header>
      <form className={styles.directoryFilters} aria-label="Search introductions" onSubmit={e=>{e.preventDefault();setSearch(query.trim());setPage(1);}}>
        <label className={styles.directorySearch}><span className={styles.visuallyHidden}>Search introductions</span><Icon kind="search"/><input ref={searchInput} type="search" maxLength={100} placeholder="Search by name or email…" value={query} onChange={e=>setQuery(e.target.value)}/></label>
        <label><span className={styles.visuallyHidden}>Review status</span><select value={status} onChange={e=>{setStatus(e.target.value);setPage(1);}}><option value="all">All statuses</option>{Object.entries(statuses).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>
        <label><span className={styles.visuallyHidden}>Reviewer filter</span><select value={assignment} onChange={e=>{setAssignment(e.target.value);setPage(1);}}><option value="all">All reviewers</option><option value="mine">Assigned to me</option><option value="unassigned">Unassigned</option></select></label>
        <button type="submit" className={styles.secondaryAction}>Search</button>{filtered&&<button type="button" className={styles.textButton} onClick={clear}>Clear filters</button>}
      </form>
      <div className={styles.directoryResults} aria-busy={loading}>
        {loading?<ApplicationsLoading/>:error?<DataState state="error" title="Could not load introductions" description={error}><button className={styles.secondaryAction} onClick={()=>setAttempt(a=>a+1)}>Try again</button></DataState>:<>
          {result?.items.length?<div className={styles.memberTableScroll} tabIndex={0} role="region" aria-label="Introductions"><table className={`${styles.memberTable} ${styles.applicationTable}`}><caption className={styles.visuallyHidden}>Submitted membership introductions</caption><ApplicationColumns/><tbody>{result.items.map(row=><tr key={row.id}><td><strong>{row.name}</strong><small>{row.email}</small><small>{row.location}</small></td><td><span className={styles.roleBadge}>{statuses[row.status]}</span></td><td>{row.reviewer_name||'Unassigned'}</td><td><time dateTime={row.created_at}>{new Date(row.created_at).toLocaleDateString()}</time></td><td><button data-application={row.id} className={styles.textButton} aria-label={`Review introduction from ${row.name}`} onClick={()=>setSelected(row.id)}>Review<Icon kind="chevron"/></button></td></tr>)}</tbody></table></div>:<DataState state="empty" icon="people" title={page>1?'No introductions on this page':filtered?'No matching introductions':'No introductions yet'} description={filtered?'Try another search or clear the filters.':'Introductions submitted through the local Join form will appear here for review.'}>{page>1?<button className={styles.secondaryAction} onClick={()=>setPage(1)}>Back to first page</button>:filtered?<button className={styles.secondaryAction} onClick={clear}>Clear filters</button>:<Link className={styles.secondaryAction} href="/join">Open introduction form</Link>}</DataState>}
          <footer className={styles.directoryPagination}><p role="status">{result?.total||0} {result?.total===1?'introduction':'introductions'}{Boolean(result?.total)&&` · Page ${page} of ${Math.ceil((result?.total||0)/25)}`}</p>{(Boolean(result?.total)||page>1)&&<div className={styles.paginationActions}><button className={styles.secondaryAction} disabled={page===1} onClick={()=>setPage(p=>p-1)}>Previous</button><button className={styles.secondaryAction} disabled={!result||page*25>=result.total} onClick={()=>setPage(p=>p+1)}>Next</button></div>}</footer>
        </>}
      </div>
    </div>
    <p className={styles.profileExplanation}>Internal review only. Status changes do not approve membership or create an account. Notes are visible only to administrators.</p>
    {selected!==null&&<ReviewDialog canInvite={canInvite} id={selected} request={request} onClose={()=>{restore.current=selected;setSelected(null);setLoading(true);setAttempt(a=>a+1);}}/>}
  </section>;
}

function ApplicationColumns() {
  return <thead><tr>{['Applicant','Review status','Reviewer','Submitted'].map(label=><th scope="col" key={label}>{label}</th>)}<th scope="col"><span className={styles.visuallyHidden}>Actions</span></th></tr></thead>;
}
function ApplicationsLoading() {
  return <div role="status"><span className={styles.visuallyHidden}>Loading introductions…</span><div className={styles.memberTableScroll} aria-hidden="true"><table className={`${styles.memberTable} ${styles.applicationTable} ${styles.directorySkeleton}`}><ApplicationColumns/><tbody>{[0,1,2].map(row=><tr key={row}>{[0,1,2,3,4].map(column=><td key={column}><i/></td>)}</tr>)}</tbody></table></div></div>;
}

function ReviewDialog({id,onClose,request,canInvite}: {id: number; onClose: ()=>void; request: typeof accountRequest; canInvite:boolean}) {
  const dialog=useRef<HTMLDialogElement>(null);const pending=useRef(false);
  const keepEditing=useRef<HTMLButtonElement>(null);
  const retry=useRef<{body: object; signature: string} | null>(null);
  const [record,setRecord]=useState<Detail | null>(null); const [reviewers,setReviewers]=useState<Reviewer[]>([]);
  const [status,setStatus]=useState<Status>('new'); const [reviewer,setReviewer]=useState(''); const [note,setNote]=useState('');
  const [loading,setLoading]=useState(true);const [saving,setSaving]=useState(false);const [more,setMore]=useState(false);
  const [error,setError]=useState('');const [activityError,setActivityError]=useState('');const [notice,setNotice]=useState('');const [attempt,setAttempt]=useState(0);
  const [confirmClose,setConfirmClose]=useState(false);
  useEffect(()=>{if(confirmClose)keepEditing.current?.focus();},[confirmClose]);
  const path=`/applications/${id}`;
  useEffect(()=>{const element=dialog.current;element?.showModal();return ()=>element?.close();},[]);
  useEffect(()=>{
    const controller=new AbortController();setLoading(true);setError('');retry.current=null;
    Promise.all([request(path,'GET',undefined,controller.signal),request('/applications/reviewers','GET',undefined,controller.signal)])
      .then(([data,people])=>{if(!controller.signal.aborted){setRecord(data);setStatus(data.status);setReviewer(data.reviewer_id===null?'':String(data.reviewer_id));setReviewers(people);}})
      .catch(err=>{if(!controller.signal.aborted)setError(err.message);})
      .finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    return ()=>controller.abort();
  },[path,attempt,request]);
  const dirty=Boolean(record&&(note.trim()||status!==record.status||reviewer!==(record.reviewer_id===null?'':String(record.reviewer_id))));
  function close(){if(pending.current||saving||more)return;if(dirty)setConfirmClose(true);else onClose();}
  async function save(){
    if(!record||pending.current||saving)return;
    pending.current=true;setSaving(true);setError('');setNotice('');
    const values={version:record.version,status,reviewer_id:reviewer?Number(reviewer):null,note:note.trim()};
    const signature=JSON.stringify(values);
    if(retry.current?.signature!==signature)retry.current={signature,body:{...values,request_id:newRequestId()}};
    try{const updated=await request(path,'PATCH',retry.current.body);setRecord(updated);setStatus(updated.status);setReviewer(updated.reviewer_id===null?'':String(updated.reviewer_id));setNote('');retry.current=null;setNotice('Review saved. No message was sent to the applicant.');}
    catch(err){setError(err instanceof Error?err.message:'Could not save review.');}
    finally{pending.current=false;setSaving(false);}
  }
  async function loadMore(){
    if(!record?.activity.next_cursor||more)return;setMore(true);setActivityError('');
    try{const next: Activity=await request(`${path}/activity?before=${record.activity.next_cursor}`);setRecord(old=>old?{...old,activity:{items:[...old.activity.items,...next.items],next_cursor:next.next_cursor}}:old);}
    catch(err){setActivityError(err instanceof Error?err.message:'Could not load activity.');}
    finally{setMore(false);}
  }
  return <dialog ref={dialog} className={`${styles.inviteDialog} ${styles.profileDialog} ${styles.applicationDialog}`} aria-labelledby="application-title" onCancel={e=>{e.preventDefault();close();}}>
    <header className={styles.inviteMemberHeader}><div className={styles.inviteDialogHeading}><h2 id="application-title">Introduction #{id}</h2><button type="button" autoFocus disabled={saving||more} aria-label="Close introduction" onClick={close}><Icon kind="close"/></button></div><p>Private review · No membership decision</p></header>
    {confirmClose&&<div className={styles.profileFormBody} role="alert"><p>Discard your unsaved review changes?</p><div className={styles.dialogActions}><button ref={keepEditing} className={styles.secondaryAction} onClick={()=>setConfirmClose(false)}>Keep editing</button><button className={styles.secondaryAction} onClick={onClose}>Discard changes</button></div></div>}
    <div className={styles.profileEditor}>
      {loading?<DataState state="loading" title="Loading introduction…"/>:!record?<DataState state="error" title="Could not load introduction" description={error}><button className={styles.secondaryAction} onClick={()=>setAttempt(a=>a+1)}>Try again</button></DataState>:<>
        <section className={styles.profileFormPanel}><header className={styles.profilePanelHeading}><h3>{record.name}</h3><p>Submitted {date(record.created_at)}</p></header><dl className={styles.introductionAnswers}>{[['Email',record.email],['Location',record.location],['Business or expertise',record.expertise],['Contribution',record.contribution]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
        <form className={`${styles.accountForm} ${styles.profileFormPanel}`} aria-label="Review introduction" onSubmit={e=>{e.preventDefault();void save();}}>
          <header className={styles.profilePanelHeading}><h3>Review tracking</h3><p>Assignment and status are internal. Waiting for information does not send an email.</p></header>
          <div className={styles.profileFormBody}><fieldset className={styles.profileFields} disabled={saving||more}><legend className={styles.visuallyHidden}>Review details</legend>
            <label>Review status<select value={status} onChange={e=>setStatus(e.target.value as Status)}>{Object.entries(statuses).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>
            <label>Assigned reviewer<select value={reviewer} onChange={e=>setReviewer(e.target.value)}><option value="">Unassigned</option>{reviewer&&!reviewers.some(p=>String(p.id)===reviewer)&&<option disabled value={reviewer}>{record.reviewer_name||'Unavailable reviewer'}</option>}{reviewers.map(person=><option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
            <label className={styles.profileBio}><span>Internal note <small>(optional)</small></span><textarea rows={4} maxLength={2000} value={note} onChange={e=>setNote(e.target.value)} placeholder="Record context or the next follow-up…"/><small>Saved notes stay in the activity history. Only administrators can read them.</small></label>
          </fieldset>{error&&<div className={styles.inlineError} role="alert"><p>{error}</p><button type="button" className={styles.secondaryAction} onClick={()=>{setNotice('');setAttempt(a=>a+1);}}>Reload latest review</button><small>Reload resets status and reviewer. Your unsaved note is kept.</small></div>}</div>
          <footer className={styles.profileFormFooter}><p role="status">{notice}</p><button type="submit" disabled={saving||more||!dirty} className={styles.primaryAction}>{saving&&<span className={styles.spinner} aria-hidden="true"/>}{saving?'Saving…':'Save review'}</button></footer>
        </form>
        {canInvite ? <ApplicationAccess record={record} disabled={dirty||saving||more} request={request} onBusy={setSaving} onUpdated={updated=>{setRecord(updated);setStatus(updated.status);setReviewer(updated.reviewer_id===null?'':String(updated.reviewer_id));}}/> : <p className={styles.profileExplanation}>Invitation permission is required to invite this applicant.</p>}
        <section className={styles.profileFormPanel} aria-label="Review activity"><header className={styles.profilePanelHeading}><h3>Activity history</h3><p>Who changed the review and when.</p></header><ol className={styles.introductionActivity}>{record.activity.items.map(item=><li key={item.id}><strong>{item.summary}</strong><small>{item.actor_name} · <time dateTime={item.created_at}>{date(item.created_at)}</time></small>{item.note&&<p>{item.note}</p>}</li>)}</ol>{activityError&&<p role="alert">{activityError}</p>}{record.activity.next_cursor&&<div className={styles.profileFormBody}><button className={styles.secondaryAction} disabled={more||saving} onClick={()=>void loadMore()}>{more?'Loading…':'Load older activity'}</button></div>}</section>
      </>}
    </div>
  </dialog>;
}
