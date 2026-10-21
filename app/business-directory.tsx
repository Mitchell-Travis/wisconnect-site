'use client';

import Icon from "./site-icon";

import { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, type Ref } from 'react';
import Link from 'next/link';
import { assetPath } from './assets';
import { businesses as fallbackBusinesses, type PublicBusiness } from './businesses';
import { localApiAvailable, localApiUrl, requestSignal } from './local-api';
import styles from './business-directory.module.css';

const previewIds=['bunnyland','ilava','momentum','zead'];
const categories=['All sectors','Food & hospitality','Design','Child care','Professional','Industry'];
const normalize=(value:string)=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘]/g,"'").toLowerCase();


function BrandMark({business}:{business:PublicBusiness}){
  const {id,visual:identity}=business;
  return <span className={styles.brandMark} data-business={id} aria-hidden="true">{id==='momentum'?<img className={styles.officialLogo} src={assetPath('momentum-coffee-logo-640.webp')} alt="" width="640" height="209" loading="lazy" decoding="async"/>:id==='ilava'?<img className={styles.officialLogo} src={assetPath('ilava-logo.svg')} alt="" width="580" height="280"/>:<><span className={styles.wordmark}>{identity.name}</span><span className={styles.subline}>{identity.sub}</span></>}</span>;
}

function BusinessVisual({business}:{business:PublicBusiness}){
  const identity=business.visual;
  if(business.id==='momentum')return <span className={styles.momentumVisual}><img className={styles.momentumLogo} src={assetPath('momentum-coffee-logo-640.webp')} width="640" height="209" alt="" loading="lazy" decoding="async"/></span>;
  if(business.id==='ilava')return <span className={styles.ilavaGallery} aria-hidden="true">
    <img src={identity.image} alt="" width="1500" height="1000" loading="lazy"/>
    <img src="https://myilava.com/cdn/shop/files/ILAVA-Sneak-028_websize.jpg?v=1710435074&width=1600" alt="" width="800" height="600" loading="lazy"/>
    <img src="https://myilava.com/cdn/shop/files/Empower_ILAVA.jpg?v=1711385573&width=1600" alt="" width="800" height="600" loading="lazy"/>
  </span>;
  if(!identity.image)return <span className={styles.visualPlaceholder}>{business.name}</span>;
  const imageSource=/^https?:\/\//i.test(identity.image)?identity.image:assetPath(identity.image);
  return <img src={imageSource} alt={identity.alt} width="1200" height="675" loading="lazy"/>;
}

const momentumPhotos=[
  {id:'4c31d7fb-e76c-4c39-aeff-72d122712dac',alt:'Breakfast sandwich and a cup of Momentum Coffee'},
  {id:'e8824341-5022-4044-ade9-30e03bd15162',alt:'Latte art beside fresh pastries at Momentum Coffee'},
  {id:'6b833487-1ec9-4576-b338-ea9d4655a3c1',alt:'Iced coffee outside a Momentum Coffee cafe'},
];
const bdavisPhotos=[
  {file:'bdavis-community',alt:'A BDavis Designs client holding a tablet against colorful brand artwork'},
  {file:'bdavis-creative-work',alt:'A client holding a tablet featuring BDavis Designs artwork'},
  {file:'bdavis-collaboration',alt:'Three women collaborating over design work on a laptop'},
];

function OfficialGallery({business}:{business:PublicBusiness}){
  if(business.id==='momentum')return <div className={styles.officialGallery}>
    {momentumPhotos.map(photo=>{
      const image=(width:number)=>`https://momentumcoffee.org/pluto-images/funnel/images/${photo.id}?fit=cover&format=auto&h=${width}&w=${width}`;
      return <img key={photo.id} src={image(640)} srcSet={`${image(640)} 640w, ${image(960)} 960w`} sizes="(max-width: 760px) 88vw, 34vw" alt={photo.alt} width="960" height="960" loading="lazy" decoding="async"/>;
    })}
  </div>;
  if(business.id==='bdavis')return <div className={styles.officialGallery}>
    {bdavisPhotos.map(photo=><img key={photo.file} src={assetPath(`${photo.file}-640.webp`)} srcSet={`${assetPath(`${photo.file}-640.webp`)} 640w, ${assetPath(`${photo.file}-1200.webp`)} 1200w`} sizes="(max-width: 760px) 88vw, 34vw" alt={photo.alt} width="1200" height="800" loading="lazy" decoding="async"/>)}
  </div>;
  return <BusinessVisual business={business}/>;
}
export type BusinessDirectoryHandle = { open: (id: string, source: HTMLButtonElement) => void };

export function BusinessDirectory({onProfile,ref}:{onProfile:(name:string)=>void;ref?:Ref<BusinessDirectoryHandle>}){
  const [records,setRecords]=useState<PublicBusiness[] | null>(process.env.NEXT_PUBLIC_BASE_PATH ? fallbackBusinesses : null);
  const [catalogError,setCatalogError]=useState('');
  const [loadAttempt,setLoadAttempt]=useState(0);
  const businesses=records ?? [];
  const currentPreviewIds=[...businesses.filter(b=>previewIds.includes(b.id)),...businesses.filter(b=>!previewIds.includes(b.id))].slice(0,4).map(b=>b.id);
  useEffect(()=>{
    if(!localApiAvailable()){setRecords(fallbackBusinesses);return;}
    const controller=new AbortController();const pending=requestSignal(controller.signal);
    setCatalogError('');setRecords(null);
    (async()=>{
      const items:PublicBusiness[]=[];let cursor:number|null=0;
      while(cursor!==null){
        const response=await fetch(localApiUrl(`/businesses?after=${cursor}`),{signal:pending.signal,cache:'no-store',credentials:'omit'});
        if(!response.ok)throw new Error('The business directory is temporarily unavailable.');
        const page:{items:PublicBusiness[];next_cursor:number|null}=await response.json();
        items.push(...page.items);cursor=page.next_cursor;
      }
      if(!controller.signal.aborted)setRecords(items.sort((a,b)=>a.name.localeCompare(b.name)));
    })().catch(()=>{if(!controller.signal.aborted)setCatalogError('The business directory is temporarily unavailable. Please try again.');}).finally(()=>pending.dispose());
    return()=>controller.abort();
  },[loadAttempt]);
  const [location,setLocation]=useState('All locations');
  const [category,setCategory]=useState('All sectors');
  const [query,setQuery]=useState('');
  const [expanded,setExpanded]=useState(false);
  const [filtersOpen,setFiltersOpen]=useState(false);
  const [selected,setSelected]=useState<string|null>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const visual=useRef<HTMLDivElement>(null);
  const detail=useRef<HTMLDivElement>(null);
  const trigger=useRef<HTMLButtonElement|null>(null);
  const animations=useRef<Animation[]>([]);
  const closing=useRef(false);
  useImperativeHandle(ref,()=>({open(id,source){trigger.current=source;setSelected(id);}}),[]);
  const business=businesses.find(b=>b.id===selected);
  const reset=()=>{setLocation('All locations');setCategory('All sectors');setQuery('');setExpanded(true);};

  useEffect(()=>{
    const revealBusiness=(id:string)=>{
      if(!businesses.some(b=>`business-${b.id}`===id))return;
      setExpanded(true);
      setLocation('All locations');setCategory('All sectors');setQuery('');
      requestAnimationFrame(()=>{
        const tile=document.getElementById(id);
        tile?.focus({preventScroll:true});
        tile?.scrollIntoView({block:'start'});
      });
    };
    const onHash=()=>revealBusiness(window.location.hash.slice(1));
    const onLink=(event:MouseEvent)=>{
      if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
      const link=event.target instanceof Element?event.target.closest<HTMLAnchorElement>('a[href^="#business-"]'):null;
      if(link)revealBusiness(link.hash.slice(1));
    };
    onHash();window.addEventListener('hashchange',onHash);document.addEventListener('click',onLink);
    return()=>{window.removeEventListener('hashchange',onHash);document.removeEventListener('click',onLink);};
  },[records]);

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

  const visible=businesses.filter(b=>(location==='All locations'||b.country===location)&&(category==='All sectors'||b.visual.group===category)&&normalize([b.name,b.person,b.location,b.country,b.sector,b.description].join(' ')).includes(normalize(query.trim())));
  const isFiltered=location!=='All locations'||category!=='All sectors'||query!=='';

  return <section id="business-directory" data-divider="background" className={`section ${styles.directory}`} aria-labelledby="directory-title">
    <svg className={styles.directoryThreads} viewBox="0 0 1600 1100" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
      {Array.from({length:24},(_,i)=><path key={i} d={`M-100 ${i*28+350} C360 ${i*17+700} 790 ${i*12+140} 1120 ${i*20+240} S1510 ${i*35+500} 1700 ${i*29+320}`} stroke={i%5===0?'#b99561':'#7b5aa6'} strokeWidth="1"/>)}
    </svg>
    <div className="shell">
    <div className={styles.heading} data-home-reveal><p className="eyebrow">The business directory</p><h2 id="directory-title" data-section-headline>Local businesses.<br/><em>Shared possibilities.</em></h2><p data-section-description className={styles.introduction}>Independent businesses. One growing network.</p></div>
    <button type="button" className={styles.filterToggle} aria-expanded={filtersOpen} aria-controls="directory-filters" onClick={()=>setFiltersOpen(open=>!open)}><Icon kind="search"/>Search &amp; filter{isFiltered&&<span className={styles.filterIndicator} aria-label="Filters active"/>}<span aria-hidden="true"><Icon kind={filtersOpen ? "minus" : "plus"}/></span></button>
    <div id="directory-filters" className={styles.filters} data-open={filtersOpen}>
    <div className={styles.toolbar}>
      <div className={styles.locations} role="group" aria-label="Filter businesses by location">{['All locations',...Array.from(new Set(businesses.map(b=>b.country)))].map(place=><button key={place} type="button" aria-pressed={location===place} onClick={()=>setLocation(place)}>{place}<span>{place==='All locations'?businesses.length:businesses.filter(b=>b.country===place).length}</span></button>)}</div>
      <div className={styles.search}><Icon kind="search"/><input type="search" aria-label="Search businesses" placeholder="Search businesses or people" value={query} onChange={event=>setQuery(event.target.value)}/>{query&&<button type="button" aria-label="Clear search" onClick={()=>setQuery('')}><Icon kind="close"/></button>}</div>
    </div>
    <div className={styles.categories} role="group" aria-label="Filter businesses by sector">{categories.map(item=><button key={item} type="button" aria-pressed={category===item} onClick={()=>setCategory(item)}>{item}</button>)}</div>
    </div>
    <div className={styles.results}><p role="status" aria-live="polite">{records===null?(catalogError?'': 'Loading businesses…'):`${!expanded&&!isFiltered?`Showing ${currentPreviewIds.length} of ${visible.length}`:visible.length} ${visible.length===1?'business':'businesses'} · Select a business to explore`}</p>{isFiltered&&<button type="button" onClick={reset}>Clear filters <Icon kind="close"/></button>}</div>
    {catalogError&&<div className={styles.empty} role="alert"><p>{catalogError}</p><button type="button" onClick={()=>setLoadAttempt(value=>value+1)}>Try again</button></div>}
    <div id="directory-businesses" className={styles.grid} data-preview={!expanded&&!isFiltered}>{visible.map(b=><button id={`business-${b.id}`} key={b.id} hidden={!expanded&&!isFiltered&&!currentPreviewIds.includes(b.id)} type="button" className={`${styles.tile} ${styles.tone}`} data-business={b.id} data-tone={b.visual.tone} data-poster={b.visual.poster} aria-label={`Explore ${b.name}`} aria-haspopup="dialog" data-dialog-control onClick={event=>{trigger.current=event.currentTarget;setSelected(b.id);}}><BrandMark business={b}/>{b.id!=='ilava'&&<span className={styles.preview} data-business-image><BusinessVisual business={b}/></span>}<span className={styles.tileMeta} aria-hidden="true"><span>{b.location}</span><Icon kind="external"/></span></button>)}</div>
    {!isFiltered&&businesses.length>4&&<div className={styles.browse}><button type="button" aria-expanded={expanded} aria-controls="directory-businesses" onClick={event=>{
      const control=event.currentTarget;
      setExpanded(open=>!open);
      if(expanded)requestAnimationFrame(()=>control.scrollIntoView({block:'center',behavior:'instant'}));
      else requestAnimationFrame(()=>document.getElementById(`business-${businesses.find(b=>!currentPreviewIds.includes(b.id))?.id}`)?.focus());
    }}>{expanded?'Show fewer businesses':`Explore all ${businesses.length} businesses`} <span aria-hidden="true"><Icon kind={expanded ? "minus" : "plus"}/></span></button></div>}
    {records!==null&&visible.length===0&&<div className={styles.empty}><h3>No businesses found.</h3><p>Try another name, location or sector.</p><button type="button" onClick={reset}>Show all businesses <Icon kind="external"/></button></div>}
    <div className={styles.directoryFooter}><p>A local business. A wider circle of possibility.</p><Link href="/contact">Ask us for an introduction <Icon kind="external"/></Link></div>
  </div>
    <dialog ref={dialog} className={`${styles.dialog} ${styles.tone}`} data-tone={business?business.visual.tone:undefined} aria-labelledby="business-detail-title" onCancel={event=>{event.preventDefault();closeBusiness();}}>
    <span className={styles.dialogBrand}>WisConnect</span><button type="button" className={styles.close} data-dialog-control aria-label="Close business details" onClick={()=>closeBusiness()} autoFocus><Icon kind="close"/></button>{business?<div className={`${styles.dialogLayout} ${business.id==='ilava'?styles.ilavaLayout:''} ${business.id==='momentum'||business.id==='bdavis'?styles.officialGalleryLayout:''}`}><div className={`${styles.dialogIdentity} ${business.id==='momentum'?styles.momentumIdentity:''}`}><BrandMark business={business}/><div ref={visual} className={styles.detailVisual}>{business.id==='momentum'||business.id==='bdavis'?<OfficialGallery business={business}/>:<BusinessVisual business={business}/>}</div>{business.visual.image&&<p className={styles.imageCaption}>{business.id==='ilava'?"Photos from ILAVA's website.":business.id==='momentum'?"Photos from Momentum Coffee's website.":business.id==='bdavis'?"Photos from BDavis Designs' website.":'Illustrative imagery for this business sector.'}</p>}</div><div ref={detail} className={styles.detailCopy}><p className={styles.detailMeta}>{business.sector} <span>·</span> {business.location}</p><h2 id="business-detail-title">{business.name}</h2><p className={styles.detailDescription}>{business.description}</p>{business.person&&<p className={styles.owner}>{business.person}</p>}<div className={styles.detailActions}>{business.website&&<a href={business.website} target="_blank" rel="noopener noreferrer">Visit website <Icon kind="external"/></a>}{business.public_email&&<a href={`mailto:${business.public_email}`}>Email this business</a>}{business.public_phone&&<span>{business.public_phone}</span>}<Link href="/contact" aria-label={`Ask WisConnect about ${business.name}`}>Connect with this business <Icon kind="external"/></Link>{business.profile&&<button type="button" onClick={()=>closeBusiness(()=>onProfile(business.profile!))}>Meet {business.profile.split(' ')[0]} <Icon kind="external"/></button>}</div></div></div>:<div className={styles.empty}><h2 id="business-detail-title">{records===null&&!catalogError?'Loading business details…':'Business details unavailable'}</h2><p role="status">{catalogError || (records===null?'Please wait a moment.':'This business is not currently listed.')}</p>{catalogError&&<button type="button" onClick={()=>setLoadAttempt(value=>value+1)}>Try again</button>}</div>}
  </dialog></section>;
}
