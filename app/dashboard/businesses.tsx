'use client';
import { useEffect, useRef, useState } from 'react';
import { accountRequest } from '../account-api';
import { newRequestId } from '../local-api';
import { assetPath } from '../assets';
import type { PublicBusiness } from '../businesses';
import DataState from './data-state';
import styles from './dashboard.module.css';

type PublicFields = Omit<PublicBusiness, 'id'>;
type Fields = { public: PublicFields; owner_id: number | null; internal_email: string; internal_phone: string; internal_notes: string };
type Record = Fields & {id:number;slug:string;status:'draft'|'published'|'archived';version:number;owner_name:string|null;published:PublicFields|null;has_unpublished_changes:boolean;updated_at:string;published_at:string|null};
type Owner = {id:number;name:string;email:string};
type Options = {images:{file:string;alt:string}[];profiles:string[]};
type Activity = {items:{id:number;actor_name:string;action:string;created_at:string}[];next_cursor:number|null};
const groups=['Food & hospitality','Design','Child care','Professional','Industry'];
const labels={draft:'Draft',published:'Published',archived:'Archived'};
const actions:{[key:string]:string}={imported:'Imported from the website',created:'Draft created',saved:'Draft saved',publish:'Published to the directory',archive:'Archived',restore:'Restored to draft'};
const initial=():Fields=>({public:{name:'',person:null,country:'',location:'',sector:'',description:'',profile:null,website:'',public_email:'',public_phone:'',visual:{name:'',sub:'',tone:'purple',poster:'editorial',group:'Professional',image:'',alt:''}},owner_id:null,internal_email:'',internal_phone:'',internal_notes:''});
const fields=(row:Record):Fields=>({public:row.public,owner_id:row.owner_id,internal_email:row.internal_email,internal_phone:row.internal_phone,internal_notes:row.internal_notes});

export default function Businesses({request=accountRequest,canPublish=true}:{request?:typeof accountRequest;canPublish?:boolean}) {
  const [result,setResult]=useState<{items:Record[];total:number}|null>(null);
  const [query,setQuery]=useState('');const [search,setSearch]=useState('');const [status,setStatus]=useState('all');
  const [page,setPage]=useState(1);const [attempt,setAttempt]=useState(0);const [loading,setLoading]=useState(true);const [error,setError]=useState('');
  const [selected,setSelected]=useState<number|'new'|null>(null);const heading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{if(selected!==null)return;const controller=new AbortController();setLoading(true);setError('');
    request(`/businesses?${new URLSearchParams({q:search,status,page:String(page)})}`,'GET',undefined,controller.signal)
      .then(value=>{if(!controller.signal.aborted)setResult(value);}).catch(err=>{if(!controller.signal.aborted)setError(err.message);})
      .finally(()=>{if(!controller.signal.aborted)setLoading(false);});return()=>controller.abort();
  },[request,search,status,page,attempt,selected]);
  if(selected!==null)return <BusinessEditor canPublish={canPublish} key={selected} id={selected} request={request} onClose={()=>{setSelected(null);setAttempt(value=>value+1);requestAnimationFrame(()=>heading.current?.focus());}}/>;
  return <section className={`${styles.directoryPanel} ${styles.businessesPanel}`} aria-label="Business management">
    <header className={styles.directoryPanelHeading}><h2 ref={heading} tabIndex={-1}>Directory businesses{!loading&&!error&&result&&<span>{result.total}</span>}</h2><button className={styles.primaryAction} onClick={()=>setSelected('new')}>Add business</button></header>
    <form className={styles.directoryFilters} onSubmit={e=>{e.preventDefault();setSearch(query.trim());setPage(1);}}>
      <label className={styles.directorySearch}><span className={styles.visuallyHidden}>Search businesses</span><input value={query} maxLength={100} placeholder="Search name or directory address" onChange={e=>setQuery(e.target.value)}/></label>
      <label><span className={styles.visuallyHidden}>Publication status</span><select value={status} onChange={e=>{setStatus(e.target.value);setPage(1);}}><option value="all">All statuses</option>{Object.entries(labels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
      <button className={styles.secondaryAction}>Search</button><button type="button" disabled={loading} className={styles.textButton} onClick={()=>setAttempt(value=>value+1)}>Refresh</button>
      {(search||status!=='all')&&<button type="button" className={styles.textButton} onClick={()=>{setQuery('');setSearch('');setStatus('all');setPage(1);}}>Clear filters</button>}
    </form>
    <div aria-busy={loading}>{loading?<DataState state="loading" title="Loading businesses…"/>:error?<DataState state="error" title="Could not load businesses" description={error}><button className={styles.secondaryAction} onClick={()=>setAttempt(value=>value+1)}>Try again</button></DataState>:<>
      {result?.items.length?<div className={styles.memberTableScroll} tabIndex={0} role="region" aria-label="Business records"><table className={styles.memberTable}><thead><tr><th>Business</th><th>Owner account</th><th>Publication</th><th><span className={styles.visuallyHidden}>Actions</span></th></tr></thead><tbody>{result.items.map(row=><tr key={row.id}><td><strong>{row.public.name}</strong><small>{row.public.location} · {row.public.sector}</small></td><td>{row.owner_name||'Not linked'}</td><td><span className={styles.roleBadge}>{labels[row.status]}</span>{row.status==='published'&&row.has_unpublished_changes&&<small>Unpublished edits</small>}</td><td><button className={styles.textButton} aria-label={`Edit ${row.public.name}`} onClick={()=>setSelected(row.id)}>Edit business</button></td></tr>)}</tbody></table></div>:<DataState state="empty" title="No businesses found" description="Try another search or add a business draft."/>}
      <footer className={styles.directoryPagination}><p role="status">{result?.total??0} businesses · Page {page}</p><div className={styles.paginationActions}><button className={styles.secondaryAction} disabled={page===1} onClick={()=>setPage(value=>value-1)}>Previous</button><button className={styles.secondaryAction} disabled={!result||page*25>=result.total} onClick={()=>setPage(value=>value+1)}>Next</button></div></footer>
    </>}</div>
  </section>;
}

function BusinessEditor({id,onClose,request,canPublish}:{id:number|'new';onClose:()=>void;request:typeof accountRequest;canPublish:boolean}) {
  const [record,setRecord]=useState<Record|null>(null);const [draft,setDraft]=useState<Fields>(initial);const [slug,setSlug]=useState('');
  const [options,setOptions]=useState<Options>({images:[],profiles:[]});const [owners,setOwners]=useState<Owner[]>([]);const [ownerSearch,setOwnerSearch]=useState('');
  const [activity,setActivity]=useState<Activity>({items:[],next_cursor:null});const [activityError,setActivityError]=useState('');const [ownerError,setOwnerError]=useState('');
  const [loaded,setLoaded]=useState(false);const [loading,setLoading]=useState(true);const [busy,setBusy]=useState(false);const [ownerBusy,setOwnerBusy]=useState(false);const [moreBusy,setMoreBusy]=useState(false);
  const [error,setError]=useState('');const [notice,setNotice]=useState('');const [attempt,setAttempt]=useState(0);const [preview,setPreview]=useState(false);
  const [confirmation,setConfirmation]=useState<'publish'|'archive'|'restore'|'discard'|'reload'|null>(null);
  const pending=useRef(false);const retry=useRef<{signature:string;body:object}|null>(null);const cancel=useRef<HTMLButtonElement>(null);const title=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{title.current?.focus();},[]);
  useEffect(()=>{if(confirmation)cancel.current?.focus();},[confirmation]);
  useEffect(()=>{const controller=new AbortController();setLoading(true);setError('');retry.current=null;
    Promise.all([request('/businesses/options','GET',undefined,controller.signal),request('/businesses/owners','GET',undefined,controller.signal),id==='new'?Promise.resolve(null):request(`/businesses/${id}`,'GET',undefined,controller.signal),id==='new'?Promise.resolve({items:[],next_cursor:null}):request(`/businesses/${id}/activity`,'GET',undefined,controller.signal)])
      .then(([choices,people,row,history])=>{if(!controller.signal.aborted){setLoaded(true);setOptions(choices);setOwners(people);setRecord(row);setDraft(row?fields(row):initial());setSlug(row?.slug??'');setActivity(history);}})
      .catch(err=>{if(!controller.signal.aborted)setError(err.message);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});return()=>controller.abort();
  },[id,attempt,request]);
  const dirty=JSON.stringify(draft)!==JSON.stringify(record?fields(record):initial())||(!record&&Boolean(slug));
  useEffect(()=>{if(!dirty)return;const warn=(event:BeforeUnloadEvent)=>{event.preventDefault();};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);
  function publicField<K extends keyof PublicFields>(key:K,value:PublicFields[K]){setDraft(old=>({...old,public:{...old.public,[key]:value}}));}
  async function loadActivity(businessId:number,more=false){
    setActivityError('');setMoreBusy(true);
    try{const history=await request(`/businesses/${businessId}/activity${more&&activity.next_cursor?`?before=${activity.next_cursor}`:''}`);setActivity(old=>more?{items:[...old.items,...history.items],next_cursor:history.next_cursor}:history);}
    catch(err){setActivityError(err instanceof Error?err.message:'Could not load activity.');}finally{setMoreBusy(false);}
  }
  async function mutate(action:'save'|'publish'|'archive'|'restore'){
    if(pending.current)return;pending.current=true;setBusy(true);setError('');setNotice('');
    const values=action==='save'?{...draft,...(record?{version:record.version}:{slug})}:{action,version:record?.version};
    const signature=JSON.stringify({id:record?.id??'new',action,values});
    if(retry.current?.signature!==signature)retry.current={signature,body:{...values,request_id:newRequestId()}};
    try{const endpoint=record?`/businesses/${record.id}${action==='save'?'':'/publication'}`:'/businesses';
      const updated=await request(endpoint,record&&action==='save'?'PATCH':'POST',retry.current.body);setRecord(updated);setDraft(fields(updated));setSlug(updated.slug);retry.current=null;setConfirmation(null);
      setNotice(action==='save'?'Draft saved. Publish when it is ready for the directory.':action==='publish'?'Published to the local directory.':action==='archive'?'Archived and removed from the local directory.':'Restored to draft. Publish to show it again.');
      await loadActivity(updated.id);
    }catch(err){setError(err instanceof Error?err.message:'Could not save this business.');}
    finally{pending.current=false;setBusy(false);}
  }
  async function reloadSaved(){
    if(!record||pending.current)return;
    pending.current=true;setBusy(true);setError('');
    try{const saved=await request(`/businesses/${record.id}`);setRecord(saved);setDraft(fields(saved));setSlug(saved.slug);retry.current=null;setConfirmation(null);setNotice('Saved business reloaded.');await loadActivity(saved.id);}
    catch(err){setError(err instanceof Error?err.message:'Could not reload the business.');}
    finally{pending.current=false;setBusy(false);}
  }
  async function searchOwners(){setOwnerBusy(true);setOwnerError('');try{setOwners(await request(`/businesses/owners?q=${encodeURIComponent(ownerSearch)}`));}catch(err){setOwnerError(err instanceof Error?err.message:'Could not find accounts.');}finally{setOwnerBusy(false);}}
  const close=()=>{if(dirty)setConfirmation('discard');else onClose();};
  return <section className={`${styles.businessEditor} ${styles.profileEditor}`} aria-label="Business editor">
    <header className={styles.businessEditorHeading}><div><h2 ref={title} tabIndex={-1}>{record?record.public.name:'Add business'}</h2><p>{record?`${labels[record.status]}${record.status==='published'&&record.has_unpublished_changes?' · Unpublished edits':''}`:'Create a private draft before publishing.'}</p></div><button disabled={busy||moreBusy} className={styles.secondaryAction} onClick={close}>Back to businesses</button></header>
    {confirmation&&<div className={styles.businessConfirmation} role="alert"><p>{confirmation==='reload'?'Discard your unsaved edits and reload the saved business?':confirmation==='discard'?'Discard your unsaved edits?':confirmation==='publish'?'Publish the saved public details to the local directory?':confirmation==='archive'?'Archive this business and remove it from the local directory? Its records will be kept.':'Restore this business as a private draft?'}</p><div className={styles.dialogActions}><button ref={cancel} disabled={busy} className={styles.secondaryAction} onClick={()=>setConfirmation(null)}>{confirmation==='discard'?'Keep editing':'Cancel'}</button><button disabled={busy} className={styles.primaryAction} onClick={()=>confirmation==='discard'?onClose():confirmation==='reload'?void reloadSaved():void mutate(confirmation)}>{busy?'Saving…':confirmation==='discard'?'Discard edits':`Confirm ${confirmation}`}</button></div></div>}
    {loading?<DataState state="loading" title="Loading business…"/>:error&&!loaded?<DataState state="error" title="Could not load business" description={error}><button className={styles.secondaryAction} onClick={()=>setAttempt(value=>value+1)}>Try again</button></DataState>:<>
      <form className={`${styles.accountForm} ${styles.profileFormPanel}`} aria-label="Edit business" onSubmit={e=>{e.preventDefault();void mutate('save');}}>
        <header className={styles.profilePanelHeading}><h3>Public listing</h3><p>Only the published version appears in the directory.</p></header>
        <div className={styles.profileFormBody}><fieldset className={styles.profileFields} disabled={busy||moreBusy}><legend className={styles.visuallyHidden}>Business details</legend>
          <label>Business name<input required maxLength={120} value={draft.public.name} onChange={e=>{const name=e.target.value;setDraft(old=>({...old,public:{...old.public,name,visual:{...old.public.visual,name:old.public.visual.name===old.public.name?name:old.public.visual.name}}}));}}/></label>
          <label>Directory address<input required readOnly={Boolean(record)} pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={80} value={slug} onChange={e=>setSlug(e.target.value)}/><small>Lowercase words with hyphens. Kept after creation to preserve links.</small></label>
          <label>Country<input required maxLength={80} value={draft.public.country} onChange={e=>publicField('country',e.target.value)}/></label>
          <label>City or region<input required maxLength={160} value={draft.public.location} onChange={e=>publicField('location',e.target.value)}/></label>
          <label>Sector<input required maxLength={100} value={draft.public.sector} onChange={e=>publicField('sector',e.target.value)}/></label>
          <label>Directory category<select value={draft.public.visual.group} onChange={e=>publicField('visual',{...draft.public.visual,group:e.target.value})}>{groups.map(group=><option key={group}>{group}</option>)}</select></label>
          <label className={styles.profileBio}>Description<textarea required rows={4} maxLength={2000} value={draft.public.description} onChange={e=>publicField('description',e.target.value)}/></label>
          <label>Public person or role<input maxLength={180} value={draft.public.person??''} onChange={e=>publicField('person',e.target.value||null)}/></label>
          <label>Existing public profile<select value={draft.public.profile??''} onChange={e=>publicField('profile',e.target.value||null)}><option value="">No profile link</option>{options.profiles.map(name=><option key={name}>{name}</option>)}</select></label>
          <label>Website<input type="url" placeholder="https://" maxLength={500} value={draft.public.website} onChange={e=>publicField('website',e.target.value)}/></label>
          <label>Public email<input type="email" maxLength={254} value={draft.public.public_email} onChange={e=>publicField('public_email',e.target.value)}/></label>
          <label>Public phone<input type="tel" maxLength={40} value={draft.public.public_phone} onChange={e=>publicField('public_phone',e.target.value)}/></label>
          <label>Card name<input required maxLength={100} value={draft.public.visual.name} onChange={e=>publicField('visual',{...draft.public.visual,name:e.target.value})}/></label>
          <label>Card subtitle<input maxLength={100} value={draft.public.visual.sub} onChange={e=>publicField('visual',{...draft.public.visual,sub:e.target.value})}/></label>
          <label>Directory photograph<select value={draft.public.visual.image} onChange={e=>{const image=e.target.value;publicField('visual',{...draft.public.visual,image,alt:options.images.find(item=>item.file===image)?.alt??''});}}><option value="">No photograph</option>{options.images.map(image=><option key={image.file} value={image.file}>{image.alt}</option>)}</select><small>Approved illustrative images. Custom uploads are not connected yet.</small></label>
          <label className={styles.profileBio}>Image description<input required={Boolean(draft.public.visual.image)} maxLength={300} value={draft.public.visual.alt} onChange={e=>publicField('visual',{...draft.public.visual,alt:e.target.value})}/></label>
        </fieldset></div>
        <header className={styles.profilePanelHeading}><h3>Private details</h3><p>Account links and internal contact details are never published.</p></header>
        <div className={styles.profileFormBody}><fieldset className={styles.profileFields} disabled={busy||moreBusy}><legend className={styles.visuallyHidden}>Private business details</legend>
          <label>Find owner account<input value={ownerSearch} maxLength={100} onChange={e=>setOwnerSearch(e.target.value)}/><button type="button" className={styles.textButton} disabled={ownerBusy} onClick={()=>void searchOwners()}>{ownerBusy?'Searching…':'Find accounts'}</button></label>
          <label>Linked owner account<select value={draft.owner_id??''} onChange={e=>setDraft(old=>({...old,owner_id:e.target.value?Number(e.target.value):null}))}><option value="">Not linked</option>{draft.owner_id&&!owners.some(owner=>owner.id===draft.owner_id)&&<option value={draft.owner_id}>{record?.owner_name??'Current owner'}</option>}{owners.map(owner=><option key={owner.id} value={owner.id}>{owner.name} · {owner.email}</option>)}</select><small>Links an account; does not grant editing access or membership.</small></label>
          <label>Internal email<input type="email" maxLength={254} value={draft.internal_email} onChange={e=>setDraft(old=>({...old,internal_email:e.target.value}))}/></label>
          <label>Internal phone<input type="tel" maxLength={40} value={draft.internal_phone} onChange={e=>setDraft(old=>({...old,internal_phone:e.target.value}))}/></label>
          <label className={styles.profileBio}>Internal notes<textarea rows={3} maxLength={2000} value={draft.internal_notes} onChange={e=>setDraft(old=>({...old,internal_notes:e.target.value}))}/></label>
        </fieldset>{ownerError&&<p role="alert">{ownerError}</p>}{error&&<div className={styles.inlineError} role="alert"><p>{error}</p>{record&&<button type="button" className={styles.secondaryAction} onClick={()=>{if(dirty)setConfirmation('reload');else void reloadSaved();}}>Reload saved business</button>}<small>Your entered values are kept until you leave or reload.</small></div>}</div>
        <footer className={styles.profileFormFooter}><p role="status">{notice}</p><button type="button" className={styles.secondaryAction} aria-expanded={preview} onClick={()=>setPreview(value=>!value)}>{preview?'Hide preview':'Preview listing'}</button><button disabled={busy||moreBusy||!dirty} className={styles.primaryAction}>{busy?'Saving…':'Save draft'}</button></footer>
      </form>
      {preview&&<section className={styles.businessListingPreview} aria-label="Public listing preview"><p className={styles.profileExplanation}>Preview of the current form · Only these public details appear in the directory.</p>{draft.public.visual.image&&<img src={assetPath(draft.public.visual.image)} alt={draft.public.visual.alt} width={1200} height={675}/>}<p>{draft.public.sector} · {draft.public.location}</p><h3>{draft.public.name||'Business name'}</h3><p>{draft.public.description||'Business description'}</p>{draft.public.person&&<p>{draft.public.person}</p>}<p>{[draft.public.website,draft.public.public_email,draft.public.public_phone].filter(Boolean).join(' · ')}</p></section>}
      {record&&<section className={styles.profileFormPanel}><header className={styles.profilePanelHeading}><h3>Publication</h3><p>{record.status==='published'?'The saved published version stays visible while you edit.':record.status==='archived'?'Archived businesses are hidden from the directory.':'This draft is private.'}</p></header><div className={styles.profileFormBody}><div className={styles.businessPublishActions}>{!canPublish?<p>Publishing permission is required to publish, archive or restore this business.</p>:record.status!=='archived'?<><button disabled={busy||dirty||moreBusy||!record.has_unpublished_changes&&record.status==='published'} className={styles.primaryAction} onClick={()=>setConfirmation('publish')}>Publish saved listing</button><button disabled={busy||dirty||moreBusy} className={styles.secondaryAction} onClick={()=>setConfirmation('archive')}>Archive business</button></>:<button disabled={busy||dirty||moreBusy} className={styles.secondaryAction} onClick={()=>setConfirmation('restore')}>Restore to draft</button>}<a className={styles.textButton} href={`/#business-${record.slug}`} target="_blank" rel="noopener noreferrer">Open directory</a></div>{dirty&&<p>Save your draft before changing publication.</p>}<p className={styles.profileExplanation}>Updates affect this local preview. The hosted website changes only after an authorized release.</p></div></section>}
      {record&&<section className={styles.profileFormPanel} aria-label="Business activity"><header className={styles.profilePanelHeading}><h3>Activity history</h3></header><ol className={styles.introductionActivity}>{activity.items.map(item=><li key={item.id}><strong>{actions[item.action]??item.action}</strong><small>{item.actor_name} · {new Date(item.created_at).toLocaleString()}</small></li>)}</ol>{activityError&&<p role="alert">{activityError}</p>}<div className={styles.profileFormBody}><button disabled={busy||moreBusy} className={styles.textButton} onClick={()=>void loadActivity(record.id,Boolean(activity.next_cursor))}>{moreBusy?'Loading…':activity.next_cursor?'Load older activity':'Refresh activity'}</button></div></section>}
    </>}
  </section>;
}
