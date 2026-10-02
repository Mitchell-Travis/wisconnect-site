'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { assetPath } from './assets';
import { businesses } from './businesses';
import styles from './business-directory.module.css';

// Original directory name marks, not reproductions of the businesses' official logos.
const identities: Record<string, {name:string; sub:string; tone:string; group:string; portrait?:string; symbol:string}> = {
  bdavis:{name:'BDavis',sub:'DESIGNS',tone:'lilac',group:'Design',portrait:'brandi',symbol:'design'},
  bunnyland:{name:'Bunnyland',sub:'CHILD CARE',tone:'sand',group:'Child care',portrait:'kailyn',symbol:'bunny'},
  czl:{name:'CZL',sub:'LAW · GOVERNANCE · ADVISORY',tone:'plum',group:'Professional',portrait:'chipo',symbol:'columns'},
  'exquisite-catering':{name:'Exquisite',sub:'CATERING & EVENTS',tone:'rose',group:'Food & hospitality',portrait:'tiffany',symbol:'petals'},
  'exquisite-kitchen':{name:'Exquisite',sub:'KITCHEN',tone:'sand',group:'Food & hospitality',portrait:'tiffany',symbol:'arch'},
  jennima:{name:'Jennima’s',sub:'JUICE',tone:'lilac',group:'Food & hospitality',symbol:'citrus'},
  momentum:{name:'Momentum',sub:'COFFEE',tone:'plum',group:'Food & hospitality',portrait:'nikki',symbol:'cup'},
  'river-cess-agriculture':{name:'River Cess',sub:'AGRICULTURE',tone:'sand',group:'Industry',symbol:'leaf'},
  'river-cess-mining':{name:'River Cess',sub:'MINING',tone:'rose',group:'Industry',symbol:'mineral'},
  wisinsup:{name:'WisInSup',sub:'INCORPORATED',tone:'plum',group:'Industry',symbol:'weave'},
  zead:{name:'ZE’AD',sub:'ADVISORS & CONSULTANTS',tone:'lilac',group:'Professional',portrait:'ade-wede',symbol:'bridge'},
};
const categories=['All sectors','Food & hospitality','Design','Child care','Professional','Industry'];
const normalize=(value:string)=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘]/g,"'").toLowerCase();

function Icon({kind}:{kind:'arrow'|'search'|'pin'|'close'}){
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{kind==='arrow'?<path d="M6 18 18 6M7 6h11v11"/>:kind==='search'?<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></>:kind==='pin'?<><path d="M19 10c0 5-7 10-7 10S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/></>:<path d="m6 6 12 12M18 6 6 18"/>}</svg>;
}

function BusinessSymbol({kind}:{kind:string}){
  const shapes:Record<string,ReactNode>={
    design:<><path d="M13 12h18c16 0 16 20 0 20H13ZM13 32h21c17 0 17 20 0 20H13Z"/><path d="M24 12v40M42 13 22 51"/></>,
    bunny:<><path d="M24 31C9 8 26 0 29 28M35 28C38 0 55 8 40 32M21 33c-10 17 2 24 11 24s21-7 11-24c-5-7-17-7-22 0Z"/><path d="m29 43 3 3 3-3M32 46v4"/></>,
    columns:<><path d="M8 19 32 7l24 12M10 23h44M12 54h40M8 58h48M18 28v20M32 28v20M46 28v20"/></>,
    petals:<><path d="M32 32C9 30 7 12 16 9c10-4 16 12 16 23ZM32 32C34 9 52 7 55 16c4 10-12 16-23 16ZM32 32c23 2 25 20 16 23-10 4-16-12-16-23ZM32 32C30 55 12 57 9 48 5 38 21 32 32 32Z"/></>,
    arch:<><path d="M12 54V28a20 20 0 0 1 40 0v26M22 54V29a10 10 0 0 1 20 0v25M8 54h48M32 37v17"/><path d="M28 38h8"/></>,
    citrus:<><circle cx="32" cy="35" r="22"/><path d="M32 13c1-9 10-10 16-9-1 6-7 11-16 9ZM32 21v28M18 35h28M22 25l20 20M42 25 22 45"/></>,
    cup:<><path d="M10 25h34v14a17 17 0 0 1-34 0ZM44 28h4a8 8 0 0 1 0 16h-5M9 58h37M20 17c-7-6 7-7 0-13M32 17c-7-6 7-7 0-13"/></>,
    leaf:<><path d="M32 56V24M32 42C13 42 9 28 10 19c14 0 22 8 22 23ZM32 32C50 32 55 18 54 9c-14 0-22 8-22 23ZM16 53c10-4 22-4 32 0M10 59h44"/></>,
    mineral:<><path d="m32 6 24 20-9 28H17L8 26ZM8 26h48M20 16l-3 10 15 28 15-28-3-10M17 26l15-20 15 20"/></>,
    weave:<><path d="m8 17 16 30 8-16 8 16 16-30M8 29l16 30 8-16 8 16 16-30M24 5l8 14 8-14"/></>,
    bridge:<><path d="M8 52V24l24-16 24 16v28M16 52V30l16-10 16 10v22M8 40h48M24 52V40M40 52V40"/></>,
  };
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[kind]}</svg>;
}

export function BusinessDirectory({onProfile}:{onProfile:(name:string)=>void}){
  const [location,setLocation]=useState('All locations');
  const [category,setCategory]=useState('All sectors');
  const [query,setQuery]=useState('');
  const reset=()=>{setLocation('All locations');setCategory('All sectors');setQuery('');};

  useEffect(()=>{
    // Links from location cards and biographies must reveal entries hidden by any filter.
    const revealBusiness=(id:string)=>{
      if(!businesses.some(b=>`business-${b.id}`===id))return;
      setLocation('All locations');setCategory('All sectors');setQuery('');
      requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({block:'start'}));
    };
    const onHash=()=>revealBusiness(window.location.hash.slice(1));
    const onLink=(event:MouseEvent)=>{
      if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
      const link=event.target instanceof Element?event.target.closest<HTMLAnchorElement>('a[href^="#business-"]'):null;
      if(link)revealBusiness(link.hash.slice(1));
    };
    onHash();window.addEventListener('hashchange',onHash);document.addEventListener('click',onLink);
    return()=>{window.removeEventListener('hashchange',onHash);document.removeEventListener('click',onLink);};
  },[]);

  const visible=businesses.filter(b=>(location==='All locations'||b.country===location)&&(category==='All sectors'||identities[b.id].group===category)&&normalize([b.name,b.person,b.location,b.country,b.sector,b.description].join(' ')).includes(normalize(query.trim())));
  const isFiltered=location!=='All locations'||category!=='All sectors'||query!=='';

  return <section id="business-directory" data-divider="background" className={`section ${styles.directory}`} aria-labelledby="directory-title"><div className="shell">
    <div className={`section-heading split-heading ${styles.heading}`}><div><p className="eyebrow">The business directory</p><h2 id="directory-title">Local businesses.<br/><em>Shared possibilities.</em></h2></div><p>Get to know the enterprises in WisConnect’s network, and the people bringing them to life. Your next connection could start here.</p></div>
    <div className={styles.toolbar}>
      <div className={styles.locations} role="group" aria-label="Filter businesses by location">{['All locations','United States','Liberia'].map(place=><button key={place} type="button" aria-pressed={location===place} onClick={()=>setLocation(place)}>{place==='United States'?'Chicago, US':place}<span>{place==='All locations'?businesses.length:businesses.filter(b=>b.country===place).length}</span></button>)}</div>
      <div className={styles.search}><Icon kind="search"/><input type="search" aria-label="Search businesses" placeholder="Search businesses or people" value={query} onChange={event=>setQuery(event.target.value)}/>{query&&<button type="button" aria-label="Clear search" onClick={()=>setQuery('')}><Icon kind="close"/></button>}</div>
    </div>
    <div className={styles.categories} role="group" aria-label="Filter businesses by sector">{categories.map(item=><button key={item} type="button" aria-pressed={category===item} onClick={()=>setCategory(item)}>{item}</button>)}</div>
    <div className={styles.results}><p role="status" aria-live="polite"><strong>{visible.length}</strong> {visible.length===1?'business':'businesses'}<span> · Listed A–Z</span></p>{isFiltered&&<button type="button" onClick={reset}>Clear filters <Icon kind="close"/></button>}</div>
    <div className={styles.grid}>{visible.map(b=>{
      const identity=identities[b.id];
      return <article id={`business-${b.id}`} key={b.id} className={styles.card} aria-labelledby={`business-title-${b.id}`}>
        <div className={styles.brandPanel} data-tone={identity.tone} aria-hidden="true"><div className={styles.cornerLine}/><BusinessSymbol kind={identity.symbol}/><span className={styles.wordmark}>{identity.name}</span><span className={styles.brandSubline}>{identity.sub}</span><span className={styles.panelLocation}>{b.country==='United States'?'CHICAGO':'LIBERIA'}</span></div>
        <div className={styles.cardBody}><div className={styles.metadata}><span>{b.sector}</span><span className={styles.location}><Icon kind="pin"/>{b.location}</span></div><h3 id={`business-title-${b.id}`}>{b.name}</h3><p className={styles.description}>{b.description}</p>
          {b.profile?<button className={styles.person} type="button" onClick={()=>onProfile(b.profile!)} aria-label={`Meet ${b.profile} from ${b.name}`}><img src={assetPath(`${identity.portrait}-studio-480.webp`)} alt="" width="40" height="40" loading="lazy"/><span><strong>{b.person?.split('·')[0].trim()??b.profile}</strong><span>{b.person?.includes('·')?b.person.split('·')[1].trim():'Meet the person behind the business'}</span></span><Icon kind="arrow"/></button>:<div className={styles.networkPerson}><span className={styles.networkSymbol}>W</span><span><strong>{b.person??'WisConnect Liberia'}</strong><span>{b.person?'Business owner':'Connect through the cooperative'}</span></span></div>}
          <Link className={styles.contact} href="/contact" aria-label={`Ask WisConnect about ${b.name}`}>Connect with this business <Icon kind="arrow"/></Link>
        </div>
      </article>;
    })}</div>
    {visible.length===0&&<div className={styles.empty}><Icon kind="search"/><h3>No businesses found.</h3><p>Try another name, location or sector to find your next connection.</p><button type="button" onClick={reset}>Show all businesses <Icon kind="arrow"/></button></div>}
    <div className={styles.directoryFooter}><p>A local business. A wider circle of possibility.</p><Link href="/contact">Ask us for an introduction <Icon kind="arrow"/></Link></div>
  </div></section>;
}
