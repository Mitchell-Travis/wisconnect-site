"use client";
import {useEffect, useRef, useState} from "react";
import {accountRequest} from "../account-api";
import {newRequestId} from "../local-api";
import {accessLabel} from "../workspace-access";
import DataState from "./data-state";
import styles from "./dashboard.module.css";

type Grant = {key: string; label: string; description: string};
type Access = {role: "admin" | "member"; active: boolean; capabilities: string[]};
type Person = Access & {id: number; name: string; email: string; version: number};
type Detail = Person & {current_user_id: number; events: {id: number; actor_name: string; before: Access; after: Access; created_at: string}[]};
type Page = {items: Person[]; total: number; current_user_id: number; capabilities: Grant[]};

export default function Team({request = accountRequest}: {request?: typeof accountRequest}) {
  const [data,setData]=useState<Page|null>(null);const [loading,setLoading]=useState(true);const [error,setError]=useState("");
  const [query,setQuery]=useState("");const [search,setSearch]=useState("");const [access,setAccess]=useState("all");const [page,setPage]=useState(1);const [attempt,setAttempt]=useState(0);const [selected,setSelected]=useState<Person|null>(null);
  const trigger=useRef<HTMLElement|null>(null);
  const heading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{const controller=new AbortController();setLoading(true);setError("");
    request(`/team?${new URLSearchParams({q:search,access,page:String(page)})}`,"GET",undefined,controller.signal)
      .then(result=>{if(!controller.signal.aborted)setData(result);}).catch(reason=>{if(!controller.signal.aborted)setError(reason.message);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    return()=>controller.abort();
  },[request,search,access,page,attempt]);
  return <section className={`${styles.directoryPanel} ${styles.teamPanel}`} aria-label="Team permissions">
    <header className={styles.directoryPanelHeading}><div><h2 ref={heading} tabIndex={-1}>Workspace access</h2><p>Assign permissions to existing accounts. Invitations create member accounts first.</p></div></header>
    <form className={styles.directoryFilters} onSubmit={event=>{event.preventDefault();setSearch(query);setPage(1);setAttempt(n=>n+1);}}><label>Find an account<input value={query} maxLength={100} onChange={event=>setQuery(event.target.value)} placeholder="Name or email"/></label><label>Access<select value={access} onChange={event=>{setAccess(event.target.value);setPage(1);}}><option value="all">All accounts</option><option value="admin">Administrators</option><option value="staff">Staff</option><option value="member">Members</option></select></label><button className={styles.secondaryAction}>Search</button></form>
    {loading?<DataState state="loading" title="Loading team access…"/>:error?<DataState state="error" title="Could not load team access" description={error}><button className={styles.secondaryAction} onClick={()=>setAttempt(n=>n+1)}>Try again</button></DataState>:<>
      <ul className={styles.teamList}>{data?.items.map(person=><li key={person.id}><div><strong>{person.name}</strong><small>{person.email}</small><span>{accessLabel(person)} · {person.active?"Active":"Inactive"}{person.id===data.current_user_id?" · You":""}</span></div><button className={styles.textButton} onClick={event=>{trigger.current=event.currentTarget;setSelected(person);}}>Manage access<span className={styles.visuallyHidden}> for {person.name}</span></button></li>)}</ul>
      {!data?.items.length&&<DataState state="empty" title="No accounts found" description="Try a different name or access filter."/>}
      <footer className={styles.directoryPagination}><p role="status">{data?.total??0} accounts · Page {page}</p><div className={styles.paginationActions}><button className={styles.secondaryAction} disabled={page===1} onClick={()=>setPage(n=>n-1)}>Previous</button><button className={styles.secondaryAction} disabled={!data||page*25>=data.total} onClick={()=>setPage(n=>n+1)}>Next</button></div></footer>
    </>}
    {selected&&data&&<TeamEditor id={selected.id} grants={data.capabilities} request={request} onClose={()=>{setSelected(null);setAttempt(n=>n+1);requestAnimationFrame(()=>(trigger.current?.isConnected?trigger.current:heading.current)?.focus());}}/>}
  </section>;
}

function TeamEditor({id,grants,request,onClose}:{id:number;grants:Grant[];request:typeof accountRequest;onClose:()=>void}) {
  const [record,setRecord]=useState<Detail|null>(null);const [draft,setDraft]=useState<Access>({role:"member",active:true,capabilities:[]});const [level,setLevel]=useState("member");
  const [loading,setLoading]=useState(true);const [busy,setBusy]=useState(false);const [error,setError]=useState("");const [notice,setNotice]=useState("");const [attempt,setAttempt]=useState(0);
  const [confirmation,setConfirmation]=useState<"save"|"discard"|"reload"|null>(null);const [password,setPassword]=useState("");
  const dialog=useRef<HTMLDialogElement>(null);const pending=useRef(false);const retry=useRef<{signature:string;id:string}|null>(null);const cancel=useRef<HTMLButtonElement>(null);
  const state=(person:Access):Access=>({role:person.role,active:person.active,capabilities:[...person.capabilities].sort()});
  const hydrate=(person:Detail)=>{setRecord(person);setDraft(state(person));setLevel(person.role==="admin"?"admin":person.capabilities.length?"staff":"member");};
  const dirty=Boolean(record&&JSON.stringify(state(draft))!==JSON.stringify(state(record)));
  useEffect(()=>{dialog.current?.showModal();},[]);
  useEffect(()=>{if(confirmation)cancel.current?.focus();},[confirmation]);
  useEffect(()=>{if(!dirty)return;const warn=(event:BeforeUnloadEvent)=>event.preventDefault();window.addEventListener("beforeunload",warn);return()=>window.removeEventListener("beforeunload",warn);},[dirty]);
  useEffect(()=>{const controller=new AbortController();setLoading(true);setError("");setPassword("");retry.current=null;
    request(`/team/${id}`,"GET",undefined,controller.signal).then(result=>{if(!controller.signal.aborted)hydrate(result);}).catch(reason=>{if(!controller.signal.aborted)setError(reason.message);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});return()=>controller.abort();
  // Hydration intentionally follows the requested account/version, not draft edits.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[id,attempt,request]);
  function close(){if(busy)return;setPassword("");if(dirty)setConfirmation("discard");else onClose();}
  function grant(key:string,enabled:boolean){setDraft(old=>{let values=enabled?[...old.capabilities,key]:old.capabilities.filter(value=>value!==key);if(key==="businesses.publish"&&enabled)values.push("businesses.edit");if(key==="businesses.edit"&&!enabled)values=values.filter(value=>value!=="businesses.publish");return {...old,capabilities:[...new Set(values)].sort()};});}
  async function save(){
    if(!record||pending.current)return;pending.current=true;setBusy(true);setError("");setNotice("");
    const values={...draft,version:record.version};const signature=JSON.stringify(values);if(retry.current?.signature!==signature)retry.current={signature,id:newRequestId()};
    try{const updated=await request(`/team/${id}`,"PATCH",{...values,request_id:retry.current.id,password});hydrate(updated);retry.current=null;setConfirmation(null);setNotice("Access updated. Existing sessions and recovery links were revoked; a fresh sign-in is required.");}
    catch(reason){setError(reason instanceof Error?reason.message:"Could not save access.");}
    finally{setPassword("");pending.current=false;setBusy(false);}
  }
  function describe(value:Access){const labels=value.role==="admin"?"All administrator permissions":value.capabilities.length?value.capabilities.map(key=>grants.find(item=>item.key===key)?.label||key).join(", "):"Member access only";return `${value.active?"Active":"Inactive"} · ${labels}`;}
  return <dialog ref={dialog} className={styles.teamDialog} aria-labelledby="team-editor-title" onCancel={event=>{event.preventDefault();close();}}>
    <header className={styles.businessEditorHeading}><div><h2 id="team-editor-title">{record?.name||"Account access"}</h2><p>{record?.email}</p></div><button autoFocus className={styles.secondaryAction} disabled={busy} onClick={close}>Close</button></header>
    {loading?<DataState state="loading" title="Loading access settings…"/>:!record?<DataState state="error" title="Could not load access" description={error}><button className={styles.secondaryAction} onClick={()=>setAttempt(n=>n+1)}>Try again</button></DataState>:<>
      {error&&<p className={styles.error} role="alert">{error}<button className={styles.textButton} disabled={busy} onClick={()=>{setPassword("");setConfirmation("reload");}}>Reload saved access</button></p>}
      {notice&&<p className={styles.reportNote} role="status">{notice}</p>}
      {record.id===record.current_user_id&&<p className={styles.reportNote}>Another administrator must change your access. The last active administrator cannot be removed.</p>}
      <fieldset className={styles.teamFields} disabled={busy||record.id===record.current_user_id||confirmation!==null}>
        <legend>Access settings</legend>
        <label>Access level<select value={level} onChange={event=>{const next=event.target.value;setLevel(next);setDraft(old=>({...old,role:next==="admin"?"admin":"member",capabilities:next==="staff"?old.capabilities:[]}));setNotice("");}}><option value="member">Member</option><option value="staff">Staff — selected permissions</option><option value="admin">Administrator — full access</option></select></label>
        {level==="admin"&&<p>Full access includes private records, invitations, account administration and permission changes.</p>}
        {level==="staff"&&<div className={styles.teamGrants}>{grants.map(item=><label key={item.key}><input type="checkbox" checked={draft.capabilities.includes(item.key)} onChange={event=>grant(item.key,event.target.checked)}/><span><strong>{item.label}</strong><small>{item.description}</small></span></label>)}</div>}
        <label className={styles.teamActive}><input type="checkbox" checked={draft.active} onChange={event=>setDraft(old=>({...old,active:event.target.checked}))}/><span>Allow sign-in</span></label>
        <p>Disabling sign-in retains the account and its records. Access changes sign this person out on every device.</p>
        <button className={styles.primaryAction} disabled={!dirty||(level==="staff"&&!draft.capabilities.length)} onClick={()=>{setError("");setConfirmation("save");}}>Review changes</button>
      </fieldset>
      {confirmation&&<section className={styles.businessConfirmation} aria-label="Confirm access change"><h3>{confirmation==="save"?"Confirm access change":confirmation==="reload"?"Discard edits and reload?":"Discard unsaved access changes?"}</h3>
        {confirmation==="save"?<form onSubmit={event=>{event.preventDefault();void save();}}><p><strong>Before:</strong> {describe(record)}</p><p><strong>After:</strong> {describe(draft)}</p><label className={styles.teamPassword}>Your current password<input autoComplete="current-password" type="password" maxLength={128} required value={password} disabled={busy} onChange={event=>setPassword(event.target.value)}/></label><div className={styles.dialogActions}><button ref={cancel} type="button" className={styles.secondaryAction} disabled={busy} onClick={()=>{setPassword("");setConfirmation(null);}}>Cancel</button><button className={styles.primaryAction} disabled={busy}>{busy?"Saving…":"Confirm access change"}</button></div></form>:<div className={styles.dialogActions}><button ref={cancel} className={styles.secondaryAction} onClick={()=>setConfirmation(null)}>Keep editing</button><button className={styles.primaryAction} onClick={()=>{setPassword("");setConfirmation(null);if(confirmation==="discard")onClose();else setAttempt(n=>n+1);}}>Discard {confirmation==="reload"?"and reload":"changes"}</button></div>}
      </section>}
      <section className={styles.teamHistory}><h3>Recent access changes</h3>{record.events.length?<ul>{record.events.map(event=><li key={event.id}><strong>{event.actor_name}</strong><time dateTime={event.created_at}>{new Date(event.created_at).toLocaleString()}</time><p>Before: {describe(event.before)}</p><p>After: {describe(event.after)}</p></li>)}</ul>:<p>No access changes recorded yet.</p>}<p>Latest 25 changes. Existing access was preserved when tracking began.</p></section>
    </>}
  </dialog>;
}
