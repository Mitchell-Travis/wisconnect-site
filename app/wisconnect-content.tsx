'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { assetPath } from './assets';
import styles from './wisconnect-content.module.css';

function ArrowIcon(){
  return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6 14 14 6M7 6h7v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

// Client-supplied biographies, Liberia overview and September 26–30 correspondence.
// Publication summaries and provenance are recorded in docs/reviews/2026-10-02/content-structure.md.
export const businesses = [
  {id:'bdavis',name:'BDavis Designs',person:'Brandi Davis-Fitch',country:'United States',location:'Chicago',sector:'Design & apparel',description:'Graphic design, web design and apparel production for entrepreneurs, small businesses and community organisations.',profile:'Brandi Davis-Fitch'},
  {id:'bunnyland',name:'Bunnyland Developmental Child Care Center',person:'Kailyn Harrington · Managing owner',country:'United States',location:'Roseland, Chicago',sector:'Child care',description:'A family-founded early childhood education organisation serving Roseland since 1979, now led by its second generation.',profile:'Kailyn Harrington'},
  {id:'czl',name:'CZL P.C.',person:'Chipo Nyambuya · Co-founder & managing partner',country:'United States',location:'Chicago',sector:'Legal & professional services',description:'A legal and consulting practice represented by Chipo, whose experience connects law, governance and corporate social responsibility.',profile:'Chipo Nyambuya, Esq'},
  {id:'exquisite-catering',name:'Exquisite Catering & Events',person:'Tiffany “Chef Mama” Williams',country:'United States',location:'Chicago',sector:'Food & hospitality',description:'Creative, made-from-scratch catering rooted in Chicago’s South Side, serving events, productions and entertainment clients.',profile:'Tiffany “Chef Mama” Williams'},
  {id:'exquisite-kitchen',name:'Exquisite Kitchen',person:'Tiffany “Chef Mama” Williams',country:'United States',location:'Chicago',sector:'Shared kitchens',description:'A licensed shared commercial kitchen supporting food entrepreneurs with kitchen space, mentorship and operational guidance.',profile:'Tiffany “Chef Mama” Williams'},
  {id:'jennima',name:'Jennima’s Juice',person:'Jennima Merriam',country:'Liberia',location:'Liberia',sector:'Food & beverage',description:'A juice enterprise in WisConnect’s Liberia network, bringing food and beverage entrepreneurship into the cooperative.',profile:null},
  {id:'momentum',name:'Momentum Coffee',person:'Nikki Bravo & Tracy Powell · Co-founders',country:'United States',location:'Chicago',sector:'Coffee & community',description:'A coffee business connecting hospitality, entrepreneurship and community investment, with support for emerging food entrepreneurs.',profile:'Nikki Bravo'},
  {id:'river-cess-agriculture',name:'River Cess Agriculture',person:null,country:'Liberia',location:'River Cess',sector:'Agriculture',description:'Part of the Liberia network’s agricultural enterprise, connecting the cooperative to its focus on local land, knowledge and community opportunity.',profile:null},
  {id:'river-cess-mining',name:'River Cess Mining',person:null,country:'Liberia',location:'River Cess',sector:'Mining',description:'A mining enterprise in the Liberia network, one of the economic sectors included in WisConnect’s community development approach.',profile:null},
  {id:'wisinsup',name:'WisInSup Inc.',person:null,country:'Liberia',location:'Liberia',sector:'Enterprise',description:'Part of WisConnect Liberia’s member-business network. Connect with the cooperative to learn more about its work.',profile:null},
  {id:'zead',name:'ZE’AD Advisors and Consultants',person:'Ade Wede Wee-Wee Kekuleh · Partner',country:'Liberia',location:'Liberia',sector:'Professional services',description:'A professional practice represented in the network by Ade Wede, whose experience spans law, accounting and human rights.',profile:'Ade Wede Wee-Wee Kekuleh'},
].sort((a,b)=>a.name.localeCompare(b.name));

export function CooperativeOverview(){
  return <section id="cooperative-model" className={`section ${styles.overview}`} aria-labelledby="model-title"><div className="shell">
    <div className="section-heading split-heading"><div><p className="eyebrow">A cooperative of businesses</p><h2 id="model-title">Own together.<br/><em>Build for each other.</em></h2></div><div className={styles.intro}><p>WisConnect Holding Cooperative is a worker-owned cooperative connecting Black women entrepreneurs, their businesses and the communities they serve.</p><p>Its holding company model brings different enterprises into a shared structure, with professional support and a long-term vision for community-owned assets.</p></div></div>
    <div className={styles.modelSteps}>
      <article><span>01 · The businesses</span><h3>Distinct strengths.</h3><p>Food, child care, design, agriculture and professional expertise. Each business brings knowledge of its work and its community.</p></article>
      <article><span>02 · The cooperative</span><h3>A shared structure.</h3><p>Members pool experience, build relationships and take part in decisions. WisConnect’s current members make collective decisions by consensus.</p></article>
      <article><span>03 · The community</span><h3>Value that stays close.</h3><p>The ambition reaches beyond individual enterprise: commercial space, local livelihoods and community ownership that support lasting growth.</p></article>
    </div>
  </div></section>;
}

export function BusinessDirectory({onProfile}:{onProfile:(name:string)=>void}){
  const [location,setLocation]=useState('All locations');
  useEffect(()=>{
    // Location and biography links must reach businesses hidden by a current filter.
    const revealBusiness=(id:string)=>{
      if(!businesses.some(b=>`business-${b.id}`===id))return;
      setLocation('All locations');
      requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({block:'start'}));
    };
    const revealLinkedBusiness=()=>revealBusiness(window.location.hash.slice(1));
    const followBusinessLink=(event:MouseEvent)=>{
      if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
      const link=event.target instanceof Element?event.target.closest<HTMLAnchorElement>('a[href^="#business-"]'):null;
      if(link)revealBusiness(link.hash.slice(1));
    };
    revealLinkedBusiness();
    window.addEventListener('hashchange',revealLinkedBusiness);
    document.addEventListener('click',followBusinessLink);
    return()=>{
      window.removeEventListener('hashchange',revealLinkedBusiness);
      document.removeEventListener('click',followBusinessLink);
    };
  },[]);
  const visible=businesses.filter(b=>location==='All locations'||b.country===location);
  return <section id="business-directory" data-divider="background" className={`section ${styles.directory}`} aria-labelledby="directory-title"><div className="shell">
    <div className="section-heading split-heading"><div><p className="eyebrow">The business directory</p><h2 id="directory-title">Get to know<br/><em>the enterprises.</em></h2></div><p>Discover businesses represented in WisConnect’s network. Meet the people behind them and find a starting point for your next connection.</p></div>
    <div className={styles.directoryToolbar}><div className={styles.filters} role="group" aria-label="Filter businesses by location">{['All locations','United States','Liberia'].map(place=><button key={place} type="button" aria-pressed={location===place} onClick={()=>setLocation(place)}>{place==='United States'?'Chicago, US':place}</button>)}</div><p role="status">{visible.length} businesses <span>· A–Z</span></p></div>
    <div className={styles.businessList}>{visible.map(b=><article id={`business-${b.id}`} key={b.id} className={styles.businessRow}>
      <div className={styles.businessIdentity}><span className={styles.tag}>{b.sector}</span><h3>{b.name}</h3>{b.person&&<p>{b.person}</p>}</div>
      <div className={styles.businessDescription}><span className={styles.location}>{b.location}{b.location!==b.country?` · ${b.country}`:''}</span><p>{b.description}</p><div className={styles.actions}>{b.profile&&<button type="button" onClick={()=>onProfile(b.profile!)} aria-label={`Meet ${b.profile} from ${b.name}`}>Meet {b.profile.split(' ')[0]} <ArrowIcon/></button>}<Link href="/contact" aria-label={`Ask WisConnect about ${b.name}`}>Ask about this business <ArrowIcon/></Link></div></div>
    </article>)}</div>
    <p className={styles.directoryNote}>Looking for an introduction? WisConnect can help you connect with the people behind these businesses.</p>
  </div></section>;
}

export function Places(){
  return <section id="locations" className={`section ${styles.places}`} aria-labelledby="places-title"><div className="shell">
    <div className="section-heading split-heading"><div><p className="eyebrow">Local roots · A wider network</p><h2 id="places-title">Different places.<br/><em>A shared purpose.</em></h2></div><p>WisConnect’s work takes shape around local people, businesses and needs. The connection across places is shared; the work in each community is its own.</p></div>
    <div className={styles.placeGrid}>
      <article className={styles.placeCard}><span className={styles.placeNumber}>01 / UNITED STATES</span><h3>Chicago</h3><p>Food, hospitality, child care, design and professional experience come together in the Chicago network. Roseland is central to the Wisdom Connection Initiative’s vision for a cooperative business hub.</p><div className={styles.placeBusinesses}><span>Meet the businesses</span>{businesses.filter(b=>b.country==='United States').map(b=><a key={b.id} href={`#business-${b.id}`}>{b.name} <ArrowIcon/></a>)}</div></article>
      <article className={styles.placeCard}><span className={styles.placeNumber}>02 / LIBERIA</span><h3>Liberia</h3><p>WisConnect Cooperative Inc. in Liberia is an affiliate of the holding cooperative. Its focus includes agriculture, mining, industrial procurement, textiles and professional services, alongside consulting for construction, agriculture and food businesses.</p><div className={styles.placeBusinesses}><span>Meet the businesses</span>{businesses.filter(b=>b.country==='Liberia').map(b=><a key={b.id} href={`#business-${b.id}`}>{b.name} <ArrowIcon/></a>)}</div></article>
    </div>
    <div className={styles.futurePlaces}><span className="eyebrow">Connections taking shape</span><div><h3>Ghana &amp; Vietnam</h3><p>These are next steps in the network’s development. Local business and project stories will be introduced as the work takes shape.</p></div><a href="#impact">Explore the connections <span aria-hidden="true">↓</span></a></div>
  </div></section>;
}

export function CommunityProjects(){
  return <section id="community-projects" data-divider="background" className={`section ${styles.projects}`} aria-labelledby="projects-title"><div className="shell">
    <div className="section-heading split-heading"><div><p className="eyebrow">The work taking shape</p><h2 id="projects-title">Business growth.<br/><em>Community ownership.</em></h2></div><p>The Wisdom Connection Initiative brings people, capital and land into a vision for sustainable neighbourhoods. These are development directions, with each location shaping its own approach.</p></div>
    <div className={styles.projectGrid}>
      <article><span className={styles.tag}>Chicago · Development vision</span><h3>The Wisdom Connection Initiative</h3><p>A proposed cooperative business hub in Greater Roseland. The vision connects affordable commercial space with community-owned groceries, renewable energy, health and opportunities for young people through arts, sports and entrepreneurship.</p><p className={styles.projectByline}>Cooperative development · Community assets · Youth opportunity</p></article>
      <article><span className={styles.tag}>Liberia · Areas of work</span><h3>Enterprise rooted in place</h3><p>In River Cess and the wider Liberia network, the focus is on entrepreneurs, local expertise and community assets. Agriculture, mining and business support form part of the effort to build cooperative economic opportunities.</p><p className={styles.projectByline}>Local enterprise · Agriculture · Professional support</p></article>
    </div><Link className={styles.textLink} href="/contact">Talk with WisConnect about this work <ArrowIcon/></Link>
  </div></section>;
}

const memberStories=[
  {name:'Nikki Bravo',image:'nikki',label:'Coffee & opportunity',title:'More than a place for coffee.',copy:'Nikki and Tracy’s Momentum Coffee connects hospitality with community investment. Its food incubator partnership supports emerging food entrepreneurs.'},
  {name:'Tiffany “Chef Mama” Williams',image:'tiffany',label:'Food & entrepreneurship',title:'Room for another chef to grow.',copy:'Tiffany’s journey from catering to a shared commercial kitchen brings space, mentorship and practical guidance closer to local food businesses.'},
  {name:'Kailyn Harrington',image:'kailyn',label:'Child care & continuity',title:'A family legacy. A next chapter.',copy:'Kailyn is carrying Bunnyland’s Roseland legacy forward, with an ambition to expand care for working families, including those with nontraditional hours.'},
];
export function MemberStories({onProfile}:{onProfile:(name:string)=>void}){
  return <section id="member-stories" className={`section ${styles.stories}`} aria-labelledby="member-stories-title"><div className="shell">
    <div className="section-heading split-heading"><div><p className="eyebrow">People behind the businesses</p><h2 id="member-stories-title">Experience worth<br/><em>sharing.</em></h2></div><p>Meet the business owners turning their experience into something others can build on.</p></div>
    <div className={styles.storyGrid}>{memberStories.map(story=><article key={story.name}><img src={assetPath(`${story.image}-studio-480.webp`)} alt={`Portrait of ${story.name}`} width="480" height="480" loading="lazy"/><div><span className={styles.tag}>{story.label}</span><h3>{story.title}</h3><p>{story.copy}</p><button type="button" onClick={()=>onProfile(story.name)}>Read {story.name.split(' ')[0]}’s story <ArrowIcon/></button></div></article>)}</div>
  </div></section>;
}
