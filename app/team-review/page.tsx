"use client";
import {useCallback,useRef,useState} from 'react';
import Team from '../dashboard/team';
import DashboardView from '../dashboard/dashboard-view';
import type {View} from '../dashboard/sections';
import styles from '../dashboard/dashboard.module.css';
const grants=[['businesses.edit','Edit businesses'],['businesses.publish','Publish businesses'],['applications.review','Review applications'],['invitations.manage','Manage invitations'],['inquiries.manage','Manage inquiries'],['reports.view','View and export reports']].map(([key,label])=>({key,label,description:'Synthetic permission description.'}));
const people=[{id:1,name:'Sample administrator',email:'admin@example.test',role:'admin',active:true,capabilities:[],version:0},{id:2,name:'Sample staff candidate',email:'candidate@example.test',role:'member',active:true,capabilities:[],version:0}];
const noop=async()=>({message:'Sample'});const invitations=async()=>[];const inbox=async()=>({items:[],next_cursor:null,total:0});
export default function Fixture(){
 const [mode,setMode]=useState('team');const [view,setView]=useState<View>('home');const fail=useRef(true);const row=useRef({...people[1],events:[] as object[]});
 const request=useCallback(async(path:string,method='GET',body?:object)=>{
  if(mode==='loading')return new Promise(()=>{});if(mode==='error')throw new Error('Synthetic list error.');
  if(path.startsWith('/team?'))return {items:[people[0],row.current],total:2,current_user_id:1,capabilities:grants};
  if(method==='PATCH'){if(fail.current){fail.current=false;throw new Error('Synthetic save failure. Re-enter your password to retry.');}const value=body as typeof row.current;const before={role:row.current.role,active:row.current.active,capabilities:row.current.capabilities};row.current={...row.current,...value,version:1,events:[{id:1,actor_name:'Sample administrator',before,after:{role:value.role,active:value.active,capabilities:value.capabilities},created_at:'2026-10-13T15:00:00Z'}]};}
  return {...(path==='/team/1'?{...people[0],events:[]}:row.current),current_user_id:1};
 },[mode]);
 return mode==='staff'?<DashboardView user={{name:'Sample staff',email:'staff@example.test',role:'member',capabilities:['applications.review','reports.view']}} busy={false} error='' onSignOut={()=>{}} view={view} onViewChange={setView} onProfileSaved={()=>{}} loadInvitations={invitations} sendInvitation={noop} revokeInvitation={async()=>{}} loadInquiries={inbox} retryInquiryEmail={async()=>{throw new Error('unused');}}/>:<main className={styles.dashboard} style={{display:'block',padding:20,height:'auto',minHeight:'100vh'}}><div style={{maxWidth:1000,margin:'auto'}}><h1 style={{fontSize:24,marginBottom:16}}>Team — synthetic review</h1><div style={{display:'flex',gap:12,marginBottom:16}}>{['team','staff','loading','error'].map(value=><button key={value} onClick={()=>setMode(value)}>{value}</button>)}</div><Team request={request}/></div></main>;
}
