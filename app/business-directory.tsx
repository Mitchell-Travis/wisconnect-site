'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { assetPath } from './assets';
import { businesses } from './businesses';
import styles from './business-directory.module.css';

// Original directory name marks, not reproductions of the businesses' official logos.
const identities: Record<string, {name:string; sub:string; tone:string; poster:string; group:string; image:string; alt:string}> = {
  bdavis:{name:'BDavis',sub:'DESIGNS',tone:'purple',poster:'print',group:'Design',image:'sector-screen-printing-1000.webp',alt:'Ink and a squeegee on a screen-printing frame'},
  bunnyland:{name:'Bunnyland',sub:'CHILD CARE',tone:'gold',poster:'arch',group:'Child care',image:'sector-day-care-1000.webp',alt:'Children learning through play with colorful building blocks'},
  czl:{name:'CZL',sub:'LAW · GOVERNANCE · ADVISORY',tone:'cobalt',poster:'editorial',group:'Professional',image:'business-professional.webp',alt:'An advisory workspace with documents, a notebook and balance scales'},
  'exquisite-catering':{name:'Exquisite',sub:'CATERING & EVENTS',tone:'plum',poster:'photo',group:'Food & hospitality',image:'business-catering.webp',alt:'An artfully prepared spread of catered food and fresh ingredients'},
  'exquisite-kitchen':{name:'Exquisite',sub:'KITCHEN',tone:'lilac',poster:'split',group:'Food & hospitality',image:'sector-shared-kitchen-1000.webp',alt:'Stainless steel counters and equipment in a commercial kitchen'},
  jennima:{name:'Jennima’s',sub:'JUICE',tone:'orange',poster:'citrus',group:'Food & hospitality',image:'sector-juice-bar-1000.webp',alt:'Glasses of freshly prepared orange juice'},
  momentum:{name:'Momentum',sub:'COFFEE',tone:'plum',poster:'photo',group:'Food & hospitality',image:'business-coffee.webp',alt:'Freshly made latte with coffee beans on a cafe counter'},
  'river-cess-agriculture':{name:'River Cess',sub:'AGRICULTURE',tone:'gold',poster:'landscape',group:'Industry',image:'business-agriculture.webp',alt:'Rows of crops growing in a lush tropical field'},
  'river-cess-mining':{name:'River Cess',sub:'MINING',tone:'plum',poster:'mineral',group:'Industry',image:'business-mining.webp',alt:'Natural mineral specimens and textured rock on a work surface'},
  wisinsup:{name:'WisInSup',sub:'INCORPORATED',tone:'mauve',poster:'editorial',group:'Industry',image:'business-professional.webp',alt:'A workspace arranged for business planning'},
  zead:{name:'ZE’AD',sub:'ADVISORS & CONSULTANTS',tone:'purple',poster:'split',group:'Professional',image:'business-professional.webp',alt:'Documents and a notebook in a professional advisory workspace'},
};
const categories=['All sectors','Food & hospitality','Design','Child care','Professional','Industry'];
const normalize=(value:string)=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘]/g,"'").toLowerCase();

function Icon({kind}:{kind:'arrow'|'search'|'pin'|'close'}){
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{kind==='arrow'?<path d="M6 18 18 6M7 6h11v11"/>:kind==='search'?<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></>:kind==='pin'?<><path d="M19 10c0 5-7 10-7 10S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/></>:<path d="m6 6 12 12M18 6 6 18"/>}</svg>;
}

function BrandMark({id}:{id:string}){
  const identity=identities[id];
  return <span className={styles.brandMark} data-business={id} aria-hidden="true"><span className={styles.wordmark}>{identity.name}</span><span className={styles.subline}>{identity.sub}</span></span>;
}

function BusinessVisual({id}:{id:string}){
  const identity=identities[id];
  return <img src={assetPath(identity.image)} alt={identity.alt} width="1200" height="675" loading="lazy"/>;
}
export function BusinessDirectory({onProfile}:{onProfile:(name:string)=>void}){
  const [location,setLocation]=useState('All locations');
  const [category,setCategory]=useState('All sectors');
  const [query,setQuery]=useState('');
  const [selected,setSelected]=useState<string|null>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const visual=useRef<HTMLDivElement>(null);
  const detail=useRef<HTMLDivElement>(null);
  const trigger=useRef<HTMLButtonElement|null>(null);
  const animations=useRef<Animation[]>([]);
  const closing=useRef(false);
  const business=businesses.find(b=>b.id===selected);
  const reset=()=>{setLocation('All locations');setCategory('All sectors');setQuery('');};

  useEffect(()=>{
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

  useLayoutEffect(()=>{
    if(!selected||!dialog.current)return;
    const sheet=dialog.current;
    const previousOverflow=document.documentElement.style.overflow;
    document.documentElement.style.overflow='hidden';
    closing.current=false;
    sheet.showModal();
    sheet.scrollTop=0;
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      const easing='cubic-bezier(.22,1,.36,1)';
      animations.current.push(sheet.animate([{opacity:0},{opacity:1}],{duration:300,easing:'cubic-bezier(.4,0,.2,1)'}));
      const from=(trigger.current?.querySelector('[data-business-image]')??trigger.current)?.getBoundingClientRect();
      const to=visual.current?.getBoundingClientRect();
      if(from&&to&&visual.current){
        animations.current.push(visual.current.animate([{transform:`translate(${from.left-to.left}px,${from.top-to.top}px) scale(${from.width/to.width},${from.height/to.height})`,borderRadius:'8px'},{transform:'none',borderRadius:'12px'}],{duration:650,easing}));
      }
      if(detail.current)animations.current.push(detail.current.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{duration:450,delay:180,fill:'backwards',easing}));
    }
    return()=>{
      animations.current.forEach(a=>a.cancel());animations.current=[];
      if(sheet.open)sheet.close();
      document.documentElement.style.overflow=previousOverflow;
    };
  },[selected]);

  function closeBusiness(after?:()=>void){
    const sheet=dialog.current;
    if(!sheet||closing.current)return;
    closing.current=true;
    animations.current.forEach(a=>a.cancel());animations.current=[];
    const finish=()=>{sheet.close();setSelected(null);trigger.current?.focus({preventScroll:true});after?.();};
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return;}
    const exit=sheet.animate([{opacity:1},{opacity:0}],{duration:420,delay:100,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
    animations.current.push(exit);
    if(detail.current)animations.current.push(detail.current.animate([{opacity:1},{opacity:0}],{duration:140,fill:'forwards'}));
    const from=visual.current?.getBoundingClientRect();
    const to=(trigger.current?.querySelector('[data-business-image]')??trigger.current)?.getBoundingClientRect();
    if(from&&to&&visual.current&&to.bottom>0&&to.top<window.innerHeight){
      animations.current.push(visual.current.animate([{transform:'none'},{transform:`translate(${to.left-from.left}px,${to.top-from.top}px) scale(${to.width/from.width},${to.height/from.height})`}],{duration:500,easing:'cubic-bezier(.65,0,.35,1)',fill:'forwards'}));
    }
    exit.finished.then(finish).catch(()=>{});
  }

  const visible=businesses.filter(b=>(location==='All locations'||b.country===location)&&(category==='All sectors'||identities[b.id].group===category)&&normalize([b.name,b.person,b.location,b.country,b.sector,b.description].join(' ')).includes(normalize(query.trim())));
  const isFiltered=location!=='All locations'||category!=='All sectors'||query!=='';

  return <section id="business-directory" data-divider="background" className={`section ${styles.directory}`} aria-labelledby="directory-title">
    <svg className={styles.directoryThreads} viewBox="0 0 1600 1100" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
      {Array.from({length:24},(_,i)=><path key={i} d={`M-100 ${i*28+350} C360 ${i*17+700} 790 ${i*12+140} 1120 ${i*20+240} S1510 ${i*35+500} 1700 ${i*29+320}`} stroke={i%5===0?'#b99561':'#7b5aa6'} strokeWidth="1"/>)}
    </svg>
    <div className="shell">
    <div className={styles.heading}><p className="eyebrow">The business directory</p><h2 id="directory-title">Local businesses.<br/><em>Shared possibilities.</em></h2><p className={styles.introduction}>Meet the businesses in our growing network. Each with its own story.</p></div>
    <div className={styles.toolbar}>
      <div className={styles.locations} role="group" aria-label="Filter businesses by location">{['All locations','United States','Liberia'].map(place=><button key={place} type="button" aria-pressed={location===place} onClick={()=>setLocation(place)}>{place==='United States'?'Chicago, US':place}<span>{place==='All locations'?businesses.length:businesses.filter(b=>b.country===place).length}</span></button>)}</div>
      <div className={styles.search}><Icon kind="search"/><input type="search" aria-label="Search businesses" placeholder="Search businesses or people" value={query} onChange={event=>setQuery(event.target.value)}/>{query&&<button type="button" aria-label="Clear search" onClick={()=>setQuery('')}><Icon kind="close"/></button>}</div>
    </div>
    <div className={styles.categories} role="group" aria-label="Filter businesses by sector">{categories.map(item=><button key={item} type="button" aria-pressed={category===item} onClick={()=>setCategory(item)}>{item}</button>)}</div>
    <div className={styles.results}><p role="status" aria-live="polite">{visible.length} {visible.length===1?'business':'businesses'} · Select a business to explore</p>{isFiltered&&<button type="button" onClick={reset}>Clear filters <Icon kind="close"/></button>}</div>
    <div className={styles.grid}>{visible.map(b=><button id={`business-${b.id}`} key={b.id} type="button" className={`${styles.tile} ${styles.tone}`} data-tone={identities[b.id].tone} data-poster={identities[b.id].poster} aria-label={`Explore ${b.name}`} aria-haspopup="dialog" onClick={event=>{trigger.current=event.currentTarget;setSelected(b.id);}}><BrandMark id={b.id}/><span className={styles.preview} data-business-image><BusinessVisual id={b.id}/></span><span className={styles.tileMeta} aria-hidden="true"><span>{b.location}</span><Icon kind="arrow"/></span></button>)}</div>
    {visible.length===0&&<div className={styles.empty}><h3>No businesses found.</h3><p>Try another name, location or sector.</p><button type="button" onClick={reset}>Show all businesses <Icon kind="arrow"/></button></div>}
    <div className={styles.directoryFooter}><p>A local business. A wider circle of possibility.</p><Link href="/contact">Ask us for an introduction <Icon kind="arrow"/></Link></div>
  </div>
  <dialog ref={dialog} className={`${styles.dialog} ${styles.tone}`} data-tone={business?identities[business.id].tone:undefined} aria-labelledby="business-detail-title" onCancel={event=>{event.preventDefault();closeBusiness();}}>
    {business&&<><span className={styles.dialogBrand}>WisConnect</span><button type="button" className={styles.close} aria-label="Close business details" onClick={()=>closeBusiness()} autoFocus><Icon kind="close"/></button><div className={styles.dialogLayout}><div className={styles.dialogIdentity}><BrandMark id={business.id}/><div ref={visual} className={styles.detailVisual}><BusinessVisual id={business.id}/></div><p className={styles.imageCaption}>Illustrative imagery for this business sector.</p></div><div ref={detail} className={styles.detailCopy}><p className={styles.detailMeta}>{business.sector} <span>·</span> {business.location}</p><h2 id="business-detail-title">{business.name}</h2><p className={styles.detailDescription}>{business.description}</p>{business.person&&<p className={styles.owner}>{business.person}</p>}<div className={styles.detailActions}><Link href="/contact" aria-label={`Ask WisConnect about ${business.name}`}>Connect with this business <Icon kind="arrow"/></Link>{business.profile&&<button type="button" onClick={()=>closeBusiness(()=>onProfile(business.profile!))}>Meet {business.profile.split(' ')[0]} <Icon kind="arrow"/></button>}</div></div></div></>}
  </dialog></section>;
}
