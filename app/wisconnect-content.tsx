'use client';

import Link from 'next/link';
import { assetPath } from './assets';
import styles from './wisconnect-content.module.css';
export { BusinessDirectory } from './business-directory';

function ArrowIcon(){
  return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6 14 14 6M7 6h7v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

import { businesses } from './businesses';
export { businesses } from './businesses';

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
