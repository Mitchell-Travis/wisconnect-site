"use client";

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { motion, MotionConfig, useScroll, useTransform, type Variants } from 'motion/react';
import { assetPath } from './assets';
import styles from './page.module.css';

const heroCopy: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: .12, staggerChildren: .12 } }
};
const heroItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: .58, ease: [.22, 1, .36, 1] } }
};

const sectors = ['Food & Beverages','Consulting Services','Agriculture','Textiles & Apparel','Handmade Crafts','Training'] as const;
const memberProfiles = [
  {name:'Chipo Nyambuya, Esq',role:'International Legal, Governance, and Economic Development Leader',bio:'Her areas of leadership bring together international law, governance and economic development.',expertise:['International law','Governance','Economic development'],image:assetPath('Smiling shaved-head portrait with colorful jewelry.png')},
  {name:'Elizabeth L. Carter, Esq',role:'Business and Corporate Securities Attorney, Legal & Business',bio:'Her work connects business law, corporate securities and the legal foundations that support enterprise.',expertise:['Business law','Corporate securities','Legal & business'],image:assetPath('Red-bloused portrait on a warm ivory backdrop.png')},
  {name:'Priscilla Cadette',role:'Entrepreneur, mentor and fundraising specialist',bio:'Her experience connects entrepreneurship, mentorship and fundraising support.',expertise:['Entrepreneurship','Mentorship','Fundraising'],image:assetPath('Yellow headwrap portrait with gold neck rings.png')}
] as const;
const regions = {
  Africa: 'WisConnect’s cultural and strategic root — where local businesses, communities and cooperative opportunity connect.',
  'United States': 'A relationship and partnership market for cooperative leadership, resources and cross-border opportunity.',
  'Brazil / South America': 'A priority direction within WisConnect’s wider global-connection vision.',
  'Vietnam / Southeast Asia': 'A priority direction within WisConnect’s wider global-connection vision.'
} as const;

type Sector = (typeof sectors)[number];
type Region = keyof typeof regions;

const sectorStories: Record<Sector,{image:string;alt:string;kicker:string;description:string}> = {
  'Food & Beverages': {
    image:assetPath('member-food.jpg'),
    alt:'A Black woman welcoming customers from a café counter',
    kicker:'Products & hospitality',
    description:'Food brands, hospitality concepts and local producers creating products people can gather around.'
  },
  'Consulting Services': {
    image:assetPath('member-consulting.jpg'),
    alt:'Black women collaborating around a conference table',
    kicker:'Strategy & expertise',
    description:'Advisors turning professional expertise into strategy, stronger systems and more resilient organizations.'
  },
  Agriculture: {
    image:assetPath('member-agriculture.jpg'),
    alt:'A Black agricultural professional inspecting plants in a greenhouse',
    kicker:'Production & food systems',
    description:'Growers and agribusiness builders strengthening the path from production to market.'
  },
  'Textiles & Apparel': {
    image:assetPath('member-textiles.jpg'),
    alt:'A textile artisan hand-stitching richly detailed fabric',
    kicker:'Design & making',
    description:'Designers and makers bringing heritage, craft and contemporary style into new markets.'
  },
  'Handmade Crafts': {
    image:assetPath('member-crafts.jpg'),
    alt:'A smiling artisan preparing a handmade candle',
    kicker:'Artisan products',
    description:'Skilled hands shaping distinctive products through cultural knowledge and thoughtful design.'
  },
  Training: {
    image:assetPath('member-training.jpg'),
    alt:'A Black facilitator leading a professional training session',
    kicker:'Learning & capacity',
    description:'Facilitators sharing practical knowledge that helps people and enterprises move forward.'
  }
};

function ArrowUpRightIcon(){
  return <svg className="inline-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6 14L14 6M8 6h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function ArrowDownIcon(){
  return <svg className="inline-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 4v11m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

const backgroundAssets = {
  '--belief-background': `url("${assetPath('bg-light.webp')}")`,
  '--textile-background': `url("${assetPath('Royal Purple and Gold Ornamental Textile.png')}")`
} as CSSProperties;

export default function Home(){
  const [menuOpen,setMenuOpen]=useState(false);
  const [sector,setSector]=useState<Sector>(sectors[0]);
  const [region,setRegion]=useState<Region>('Africa');
  const [scrolled,setScrolled]=useState(false);
  const [navHidden,setNavHidden]=useState(false);
  const [selectedMember,setSelectedMember]=useState<number|null>(null);
  const activeSector=sectorStories[sector];
  const activeSectorNumber=String(sectors.indexOf(sector)+1).padStart(2,'0');
  const membersSection=useRef<HTMLElement>(null);
  const profileDialog=useRef<HTMLDialogElement>(null);
  const {scrollYProgress:memberProgress}=useScroll({target:membersSection,offset:['start start','end end']});
  const profileScale=useTransform(memberProgress,[0,.14,.36,.58,1],[.68,.76,.88,1,1]);
  const firstX=useTransform(memberProgress,[0,.14,.36,.58,1],['0vw','-2vw','-7vw','-32vw','-32vw']);
  const firstY=useTransform(memberProgress,[0,.14,.36,.58,1],['0vh','0vh','-2vh','-20vh','-20vh']);
  const firstRotate=useTransform(memberProgress,[0,.14,.36,.58,1],[0,-3,-7,-2,-2]);
  const secondX=useTransform(memberProgress,[0,.14,.36,.58,1],['0vw','2vw','7vw','32vw','32vw']);
  const secondY=useTransform(memberProgress,[0,.14,.36,.58,1],['0vh','-1vh','-2vh','-20vh','-20vh']);
  const secondRotate=useTransform(memberProgress,[0,.14,.36,.58,1],[0,3,7,2,2]);
  const thirdY=useTransform(memberProgress,[0,.14,.36,.58,1],['0vh','2vh','7vh','32vh','32vh']);
  const thirdRotate=useTransform(memberProgress,[0,.14,.36,.58,1],[0,1,3,0,0]);
  const memberCopyOpacity=useTransform(memberProgress,[.48,.62,.72],[0,1,1]);
  const memberCopyScale=useTransform(memberProgress,[.48,.66],[.96,1]);
  const profileLabelOpacity=useTransform(memberProgress,[.56,.7],[0,1]);
  const profileStyles=[
    {x:firstX,y:firstY,rotate:firstRotate,scale:profileScale},
    {x:secondX,y:secondY,rotate:secondRotate,scale:profileScale},
    {x:'0vw',y:thirdY,rotate:thirdRotate,scale:profileScale}
  ];
  useEffect(()=>{const fn=()=>{const y=window.scrollY;setScrolled(y>40);setNavHidden(y>90)};fn();window.addEventListener('scroll',fn,{passive:true});return()=>window.removeEventListener('scroll',fn)},[]);
  useEffect(()=>{if(selectedMember!==null&&!profileDialog.current?.open)profileDialog.current?.showModal()},[selectedMember]);
  const close=()=>setMenuOpen(false);
  return <MotionConfig reducedMotion="user"><main className={`${styles.page} min-h-screen`} style={backgroundAssets}>
    <header className={`site-header ${scrolled?'scrolled':''} ${navHidden&&!menuOpen?'nav-hidden':''}`}><div className="shell nav-shell">
      <a className="brand" href="#top" onClick={close}><img src={assetPath('logo-horizontal.webp')} alt="WisConnect"/></a>
      <nav className={`desktop-nav ${menuOpen?'open':''}`} aria-label="Primary navigation">
        <a href="#about" onClick={close}>About</a><a href="#what-we-do" onClick={close}>What We Do</a><a href="#cooperative" onClick={close}>Our Cooperative</a><a href="#members" onClick={close}>Members</a><a href="#impact" onClick={close}>Impact</a><a href="#stories" onClick={close}>Stories</a><span className="language">EN / FR</span><Link className="button button-small" href="/join" onClick={close}>Join Us</Link>
      </nav><button className="menu-button" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}><span></span><span></span><span></span></button>
    </div></header>

    <section id="top" className="hero light-surface"><div className="hero-textile-ribbon" aria-hidden="true"/><div className="shell hero-grid">
      <motion.div className="hero-copy" variants={heroCopy} initial="hidden" animate="visible"><motion.h1 className="hero-title-long" variants={heroItem}>Black Women Business Development &amp; Resource Center</motion.h1><motion.p className="hero-lede" variants={heroItem}>WisConnect is a worker-owned cooperative connecting women entrepreneurs, business opportunity, capital and communities to build shared prosperity across borders.</motion.p><motion.div className="hero-actions" variants={heroItem}><Link className="button" href="/join">Join the Cooperative <ArrowUpRightIcon/></Link><a className="text-link" href="#cooperative">Discover WisConnect <ArrowDownIcon/></a></motion.div></motion.div>
      <motion.div className="hero-art" initial={{opacity:0,x:28,scale:.98}} animate={{opacity:1,x:0,scale:1}} transition={{duration:.85,delay:.18,ease:[.22,1,.36,1]}}><motion.div className={styles.heroGlow} aria-hidden="true" animate={{scale:[.96,1.04,.96]}} transition={{duration:6,repeat:Infinity,ease:'easeInOut'}}/><motion.div className={styles.portraitFloat} animate={{y:[0,-9,0]}} transition={{duration:6.5,repeat:Infinity,ease:'easeInOut'}}><img className="hero-portrait" src={assetPath('hero-visionary.webp')} alt="WisConnect editorial portrait"/></motion.div></motion.div>
    </div></section>

    <section id="about" className="manifesto section section-roomy"><div className="shell manifesto-stage">
      <motion.div className="manifesto-content" initial={{y:28}} whileInView={{y:0}} viewport={{once:true,amount:.35}} transition={{duration:.7,ease:[.22,1,.36,1]}}>
        <p className="eyebrow">The belief behind the cooperative</p>
        <h2><span>When women own,</span><span>communities grow.</span></h2>
        <motion.span className="manifesto-rule" aria-hidden="true" initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:true,amount:.6}} transition={{duration:.8,delay:.18,ease:[.22,1,.36,1]}}/>
        <p className="manifesto-statement">Ownership creates opportunity. Opportunity strengthens communities.</p>
      </motion.div>
    </div></section>

    <section id="cooperative" className="section cooperative-section"><div className="shell cooperative-inner"><div className="section-heading split-heading"><div><p className="eyebrow">How the cooperative works</p><h2>People. Capital. Communities.</h2></div><p>WisConnect turns member expertise and shared resources into business opportunity, community growth and value that circulates back through the cooperative.</p></div>
      <div className="cooperative-editorial">
        <motion.figure className="cooperative-photo cooperative-photo-main" initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.3}} transition={{duration:.7,ease:[.22,1,.36,1]}}><img src={assetPath('cooperative-meeting.jpg')} alt="Three Black women collaborating during a working session" loading="lazy"/><figcaption><span>01 · People organize</span><strong>Knowledge becomes collective capacity.</strong></figcaption></motion.figure>
        <div className="cooperative-photo-stack">
          <motion.figure className="cooperative-photo" initial={{opacity:0,x:24}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.35}} transition={{duration:.7,delay:.1,ease:[.22,1,.36,1]}}><img src={assetPath('cooperative-shop.jpg')} alt="A Tanzanian shop owner inside her business" loading="lazy"/><figcaption><span>02 · Capital moves</span><strong>Resources become enterprise.</strong></figcaption></motion.figure>
          <motion.figure className="cooperative-photo" initial={{opacity:0,x:24}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.35}} transition={{duration:.7,delay:.2,ease:[.22,1,.36,1]}}><img src={assetPath('cooperative-market.jpg')} alt="A Nairobi market vendor at her place of work" loading="lazy"/><figcaption><span>03 · Communities grow</span><strong>Local commerce strengthens local life.</strong></figcaption></motion.figure>
        </div>
      </div>
    </div></section>
    <div className="section-textile-divider" aria-hidden="true"/>

    <section id="members" className="members-section" ref={membersSection}><div className="member-stage">
      <motion.div className="member-stage-copy" style={{opacity:memberCopyOpacity,scale:memberCopyScale,x:'-50%',y:'-50%'}}><p className="eyebrow">Meet the visionaries</p><h2>Women behind the dream.</h2><p>Legal, business and entrepreneurial leadership united around one cooperative vision.</p></motion.div>
      <div className="member-portrait-orbit">
        {memberProfiles.map((member,index)=><motion.button type="button" className="member-portrait-card" style={profileStyles[index]} key={member.name} onClick={()=>setSelectedMember(index)} aria-label={`View profile for ${member.name}`} whileHover={{scale:1.035}} whileTap={{scale:.98}}>
          <img src={member.image} alt="" width="1254" height="1254" loading="lazy"/>
          <motion.span style={{opacity:profileLabelOpacity}}><strong>{member.name}</strong><small>View profile</small></motion.span>
        </motion.button>)}
      </div>
    </div></section>

    <dialog className="member-dialog" ref={profileDialog} onClose={()=>setSelectedMember(null)}>{selectedMember!==null&&<div className="member-dialog-card">
      <button className="member-dialog-close" type="button" onClick={()=>profileDialog.current?.close()} aria-label="Close profile">×</button>
      <div className="member-dialog-portrait"><img src={memberProfiles[selectedMember].image} alt={`Portrait of ${memberProfiles[selectedMember].name}`} width="1254" height="1254"/><span>{String(selectedMember+1).padStart(2,'0')} / 03</span></div>
      <div className="member-dialog-content"><p className="eyebrow">Woman behind the dream</p><h3>{memberProfiles[selectedMember].name}</h3><p className="member-dialog-role">{memberProfiles[selectedMember].role}</p><span className="member-dialog-rule" aria-hidden="true"/><p className="member-dialog-bio">{memberProfiles[selectedMember].bio}</p><ul>{memberProfiles[selectedMember].expertise.map(item=><li key={item}>{item}</li>)}</ul></div>
    </div>}</dialog>

    <section className="section businesses-section"><div className="shell"><div className="section-heading split-heading"><div><p className="eyebrow">Member enterprises</p><h2>Built by members. Backed by the cooperative.</h2></div><p>Across six practical sectors, members are turning professional skill, cultural knowledge and local resources into enterprises with room to grow.</p></div>
      <div className="sector-tabs" role="tablist" aria-label="Member business sectors">{sectors.map(s=><button type="button" role="tab" aria-selected={sector===s} key={s} className={sector===s?'active':''} onClick={()=>setSector(s)}>{s}</button>)}</div>
      <motion.div className="business-showcase" key={sector} role="tabpanel" aria-live="polite" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.45,ease:[.22,1,.36,1]}}>
        <div className="business-visual"><img src={activeSector.image} alt={activeSector.alt} loading="lazy"/><span className="business-count">{activeSectorNumber} / 06</span><span className="business-image-caption">{activeSector.kicker}</span></div>
        <div className="business-copy"><p className="eyebrow">Sector spotlight</p><h3>{sector}</h3><span className="business-copy-rule" aria-hidden="true"/><p>{activeSector.description}</p><span className="business-sector-mark">WisConnect member enterprise</span></div>
      </motion.div>
    </div></section>

    <section id="what-we-do" className="section what-section"><div className="shell"><div className="section-heading split-heading"><div><p className="eyebrow">What WisConnect does</p><h2>Turn shared ownership into shared progress.</h2></div><p>WisConnect connects members to the resources, relationships and practical support that help enterprises grow.</p></div><div className="program-list">
      <article><span>01</span><div><h3>Put ownership in members’ hands</h3><p>Give members a voice in the cooperative and a stake in the value they help create.</p></div></article>
      <article><span>02</span><div><h3>Open doors to capital and opportunity</h3><p>Connect entrepreneurs with funding pathways, trusted partners and opportunities to move forward.</p></div></article>
      <article><span>03</span><div><h3>Help member businesses grow</h3><p>Bring practical learning, visibility and business support closer to the needs of each enterprise.</p></div></article>
      <article><span>04</span><div><h3>Keep value moving through communities</h3><p>Link business growth to stronger local networks, livelihoods and opportunity that stays in the community.</p></div></article>
    </div></div></section>

    <section id="impact" className="section impact-section dark-surface"><div className="shell impact-inner"><div className="section-heading split-heading light-copy"><div><p className="eyebrow">Impact & proof</p><h2>Evidence before impressive-looking numbers.</h2></div><p>Public metrics should only appear after WisConnect verifies them.</p></div><div className="impact-grid"><div><span>Members</span><strong>—</strong><p>Verified count</p></div><div><span>Member businesses</span><strong>—</strong><p>Verified count</p></div><div><span>Projects & programs</span><strong>—</strong><p>Verified activity</p></div><div><span>Community outcomes</span><strong>—</strong><p>Measured impact</p></div></div></div></section>

    <section className="section global-section"><div className="shell global-grid"><div className="global-copy"><p className="eyebrow">Local roots. Global reach.</p><h2>The orbit becomes the story.</h2><p>WisConnect’s network is rooted in Africa and extends toward relationships and opportunities across regions.</p><div className="region-buttons">{(Object.keys(regions) as Region[]).map(r=><button key={r} className={region===r?'active':''} onClick={()=>setRegion(r)}>{r}</button>)}</div><div className="region-detail"><strong>{region}</strong><p>{regions[region]}</p></div></div><div className="global-orbit"><div className="ring ring-1"></div><div className="ring ring-2"></div><div className="ring ring-3"></div><img className="orbit-logo" src={assetPath('logo-symbol.webp')} alt="WisConnect orbit symbol"/><span className="node node-us">US</span><span className="node node-br">BR</span><span className="node node-vn">VN</span><span className="node node-af">AF</span></div></div></section>

    <section id="stories" className="section stories-section"><div className="shell"><div className="section-heading split-heading"><div><p className="eyebrow">Stories from the network</p><h2>Make the institution feel alive.</h2></div><p>Member stories, cooperative updates and events should show real work and real outcomes.</p></div><div className="stories-grid"><article className="story-feature"><div className="story-media"></div><span>Featured story</span><h3>How a WisConnect member is building opportunity through her business.</h3><p>Real member story and verified outcome will appear here.</p></article><div className="story-stack"><article><span>News</span><h3>Cooperative update</h3></article><article><span>Event</span><h3>Upcoming event</h3></article><article><span>Gallery</span><h3>Community moment</h3></article></div></div></div></section>

    <section id="join" className="section join-section"><div className="shell"><p className="eyebrow">Participation</p><h2>Ownership is stronger<br/>when it’s shared.</h2><p className="join-lede">Different audiences need clear paths into the WisConnect ecosystem.</p><div className="join-grid"><Link href="/join"><span>01 · Membership</span><strong>Become a Member</strong><p>Learn about membership and apply.</p><b><ArrowUpRightIcon/></b></Link><a href="mailto:hello@wisconnect.co?subject=Partnership%20Interest"><span>02 · Partnership</span><strong>Partner with WisConnect</strong><p>Explore institutional collaboration.</p><b><ArrowUpRightIcon/></b></a><a href="#members"><span>03 · Business</span><strong>Discover Member Businesses</strong><p>Explore the people and enterprises.</p><b><ArrowUpRightIcon/></b></a></div></div></section>

    <footer className="site-footer"><div className="shell footer-grid"><div className="footer-brand"><img src={assetPath('logo-horizontal.webp')} alt="WisConnect"/><p>People · Capital · Communities · A Brighter Tomorrow</p></div><div><strong>Explore</strong><a href="#about">About</a><a href="#what-we-do">What We Do</a><a href="#members">Members</a><a href="#impact">Impact</a></div><div><strong>Connect</strong><Link href="/join">Join</Link><a href="#stories">Stories & Events</a><a href="mailto:hello@wisconnect.co">Contact</a><span>EN / FR</span></div><div><strong>Next phase</strong><span>Marketplace</span><span>Member Portal</span><span>Mobile App</span></div></div><div className="shell footer-bottom"><span>© 2026 WisConnect</span><span>Privacy · Terms</span></div></footer>
  </main></MotionConfig>
}
