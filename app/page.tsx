"use client";

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { motion, MotionConfig, useScroll, useTransform, type MotionStyle } from 'motion/react';
import { assetPath } from './assets';
import styles from './page.module.css';

const sectors = ['Food & Beverages','Consulting Services','Agriculture','Textiles & Apparel','Handmade Crafts','Training'] as const;
const memberProfiles = [
  {name:'Chipo Nyambuya, Esq',role:'International Legal, Governance, and Economic Development Leader',bio:'Her areas of leadership bring together international law, governance and economic development.',expertise:['International law','Governance','Economic development'],image:'chipo'},
  {name:'Elizabeth L. Carter, Esq',role:'Business and Corporate Securities Attorney, Legal & Business',bio:'Her work connects business law, corporate securities and the legal foundations that support enterprise.',expertise:['Business law','Corporate securities','Legal & business'],image:'elizabeth'},
  {name:'Priscilla Cadette',role:'Entrepreneur, mentor and fundraising specialist',bio:'Her experience connects entrepreneurship, mentorship and fundraising support.',expertise:['Entrepreneurship','Mentorship','Fundraising'],image:'priscilla'}
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
  const header=useRef<HTMLElement>(null);
  const menuButton=useRef<HTMLButtonElement>(null);
  const languagePicker=useRef<HTMLDetailsElement>(null);
  const profileDialog=useRef<HTMLDialogElement>(null);
  const membersSection=useRef<HTMLElement>(null);
  const [membersAnimated,setMembersAnimated]=useState(false);
  const {scrollYProgress:memberProgress}=useScroll({target:membersSection,offset:['start start','end end']});
  const memberSpread=useTransform(memberProgress,[0,.1,.78,1],[0,0,1,1]);
  useEffect(()=>{
    const media=window.matchMedia('(min-width: 760px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)');
    const update=()=>setMembersAnimated(media.matches);
    update();
    media.addEventListener('change',update);
    return()=>media.removeEventListener('change',update);
  },[]);
  useEffect(()=>{
    let previousY=Math.max(0,window.scrollY);
    const onScroll=()=>{
      const y=Math.max(0,window.scrollY);
      setScrolled(y>24);
      if(y<96){setNavHidden(false);previousY=y;return}
      if(Math.abs(y-previousY)<12)return;
      setNavHidden(y>previousY);
      previousY=y;
    };
    onScroll();
    window.addEventListener('scroll',onScroll,{passive:true});
    return()=>window.removeEventListener('scroll',onScroll);
  },[]);
  useEffect(()=>{
    if(!menuOpen){if(languagePicker.current)languagePicker.current.open=false;return}
    const desktop=window.matchMedia('(min-width: 960px)');
    const closeOnDesktop=()=>{if(desktop.matches)setMenuOpen(false)};
    const closeOutside=(event:PointerEvent)=>{
      if(event.target instanceof Node&&!header.current?.contains(event.target))setMenuOpen(false);
    };
    desktop.addEventListener('change',closeOnDesktop);
    document.addEventListener('pointerdown',closeOutside);
    return()=>{
      desktop.removeEventListener('change',closeOnDesktop);
      document.removeEventListener('pointerdown',closeOutside);
    };
  },[menuOpen]);
  useEffect(()=>{
    const closeLanguageOutside=(event:PointerEvent)=>{
      if(languagePicker.current&&event.target instanceof Node&&!languagePicker.current.contains(event.target))languagePicker.current.open=false;
    };
    document.addEventListener('pointerdown',closeLanguageOutside);
    return()=>document.removeEventListener('pointerdown',closeLanguageOutside);
  },[]);
  useEffect(()=>{
    if(selectedMember===null)return;
    const dialog=profileDialog.current;
    if(!dialog?.open)dialog?.showModal();
    const previousOverflow=document.documentElement.style.overflow;
    document.documentElement.style.overflow='hidden';
    return()=>{
      document.documentElement.style.overflow=previousOverflow;
      if(dialog?.open)dialog.close();
    };
  },[selectedMember]);
  const close=()=>{setMenuOpen(false);if(languagePicker.current)languagePicker.current.open=false};
  return <MotionConfig reducedMotion="user"><div className={styles.page} style={backgroundAssets}>
    <a className={styles.skipLink} href="#main-content">Skip to content</a>
    <header ref={header} className={styles.header} data-scrolled={scrolled} data-hidden={navHidden&&!menuOpen}
      onFocusCapture={()=>setNavHidden(false)}
      onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))close()}}
      onKeyDown={event=>{if(event.key==='Escape'&&menuOpen){close();menuButton.current?.focus()}}}>
      <div className={styles.navShell}>
        <a className={styles.brand} href="#top" aria-label="WisConnect home" onClick={close}><img src={assetPath('logo-nav.webp')} alt="WisConnect" width="480" height="160"/></a>
        <button ref={menuButton} className={styles.menuToggle} type="button" onClick={()=>setMenuOpen(!menuOpen)} aria-controls="primary-navigation" aria-expanded={menuOpen} aria-label={menuOpen?'Close navigation':'Open navigation'}><span aria-hidden="true"/><span aria-hidden="true"/></button>
        <div id="primary-navigation" className={styles.navPanel} data-open={menuOpen}>
        <nav className={styles.navigation} aria-label="Primary navigation">
          <a href="#about" onClick={close}>Our story</a>
          <a href="#cooperative" onClick={close}>The cooperative</a>
          <a href="#members" onClick={close}>Our people</a>
          <a href="#businesses" onClick={close}>Businesses</a>
        </nav>
        <details ref={languagePicker} className={styles.languagePicker}
          onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))event.currentTarget.open=false}}
          onKeyDown={event=>{if(event.key==='Escape'&&event.currentTarget.open){event.stopPropagation();event.currentTarget.open=false;event.currentTarget.querySelector('summary')?.focus()}}}>
          <summary aria-label="Choose language" className={styles.languageTrigger}>EN / FR <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></summary>
          <div className={styles.languageDropdown}>
            <p>Language</p>
            <button type="button" lang="en" aria-current="true" onClick={()=>{if(languagePicker.current){languagePicker.current.open=false;languagePicker.current.querySelector('summary')?.focus()}}}>English <span>Selected</span></button>
            <button type="button" lang="fr" disabled>Français <span lang="en">Coming soon</span></button>
          </div>
        </details>
        </div>
        <Link className={styles.navJoin} href="/join" onClick={close}>Join us <ArrowUpRightIcon/></Link>
      </div>
    </header>

    <main id="main-content" tabIndex={-1}>
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className="hero-textile-ribbon" aria-hidden="true"/>
      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <p className={styles.identity}>Black Women Business Development<br/>&amp; Resource Center</p>
          <h1 id="hero-title">Build your business.<br/><em>Share in <br/>what grows.</em></h1>
          <p className={styles.heroLede}>A cooperative connecting women entrepreneurs to shared ownership, business opportunity, and each other.</p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryAction} href="/join">Join the Cooperative <ArrowUpRightIcon/></Link>
            <a className={styles.secondaryAction} href="#cooperative">Discover WisConnect <ArrowDownIcon/></a>
          </div>
        </div>
        <div className={styles.heroArt}>
          <span className={styles.heroThread} aria-hidden="true"/>
          <img className={styles.heroPortrait} src={assetPath('hero-visionary-960.webp')} srcSet={`${assetPath('hero-visionary-640.webp')} 640w, ${assetPath('hero-visionary-960.webp')} 960w`} sizes="(max-width: 699px) 90vw, 50vw" width="1122" height="1402" fetchPriority="high" alt="Portrait of a woman in a purple and gold headwrap, looking ahead"/>
          <p className={styles.heroCaption}><span aria-hidden="true"/>Rooted in community.<br/>Growing together.</p>
        </div>
      </div>
      <div className={styles.heroFoot}>
        <p>People. Capital. Communities.</p>
        <a href="#members">Meet the women behind WisConnect <ArrowDownIcon/></a>
      </div>
    </section>

    <section id="members" ref={membersSection} className={styles.members} data-animated={membersAnimated} data-profile-open={selectedMember!==null} aria-labelledby="members-title">
      <motion.div className={styles.memberStage} style={{'--member-spread':memberSpread} as MotionStyle}>
      <div className={styles.membersHeading}>
        <div><p className="eyebrow">Meet the visionaries</p><h2 id="members-title">Individual strengths.<br/><em>A shared vision.</em></h2></div>
        <p>Meet the women bringing legal, business, and entrepreneurial experience to the cooperative. Every connection starts with a person.</p>
      </div>
      <div className={styles.memberGrid}>
        {memberProfiles.map((member,index)=><button type="button" className={styles.memberCard} key={member.name} onClick={()=>setSelectedMember(index)} aria-label={`View profile for ${member.name}`} aria-haspopup="dialog">
          <span className={styles.memberImage}><img src={assetPath(`${member.image}-480.webp`)} srcSet={`${assetPath(`${member.image}-480.webp`)} 480w, ${assetPath(`${member.image}-800.webp`)} 800w`} sizes="(max-width: 620px) calc(100vw - 56px), (max-width: 699px) 34vw, (max-width: 1279px) 30vw, 390px" alt="" width="1254" height="1254" loading="lazy" decoding="async"/><span className={styles.memberNumber} aria-hidden="true">0{index+1}</span></span>
          <span className={styles.memberInfo}><strong>{member.name}</strong><span>{member.expertise.slice(0,2).join(' · ')}</span><span className={styles.profileAction}>View profile <ArrowUpRightIcon/></span></span>
        </button>)}
      </div>
      <p className={styles.membersFoot}>Different expertise. One cooperative vision.</p>
      </motion.div>
    </section>

    <dialog className={styles.profileDialog} ref={profileDialog} aria-labelledby="profile-name" aria-describedby="profile-role" onClose={()=>setSelectedMember(null)}>
      {selectedMember!==null&&<>
        <div className={styles.dialogToolbar}><span>Meet the visionaries · 0{selectedMember+1} / 03</span><button className={styles.dialogClose} type="button" onClick={()=>profileDialog.current?.close()} autoFocus>Close <span aria-hidden="true">×</span></button></div>
        <div className={styles.dialogGrid}>
          <img className={styles.dialogPortrait} src={assetPath(`${memberProfiles[selectedMember].image}-800.webp`)} alt={`Portrait of ${memberProfiles[selectedMember].name}`} width="800" height="800"/>
          <div className={styles.dialogContent}><p className="eyebrow">Woman behind the dream</p><h2 id="profile-name">{memberProfiles[selectedMember].name}</h2><p id="profile-role" className={styles.profileRole}>{memberProfiles[selectedMember].role}</p><p>{memberProfiles[selectedMember].bio}</p><ul>{memberProfiles[selectedMember].expertise.map(item=><li key={item}>{item}</li>)}</ul><Link className={styles.secondaryAction} href="/join">Find your place in the cooperative <ArrowUpRightIcon/></Link></div>
        </div>
      </>}
    </dialog>

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

    <section id="businesses" className="section businesses-section"><div className="shell"><div className="section-heading split-heading"><div><p className="eyebrow">Member enterprises</p><h2>Built by members. Backed by the cooperative.</h2></div><p>Across six practical sectors, members are turning professional skill, cultural knowledge and local resources into enterprises with room to grow.</p></div>
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

    <section id="join" className="section join-section"><div className="shell"><p className="eyebrow">Participation</p><h2>Ownership is stronger<br/>when it’s shared.</h2><p className="join-lede">Different audiences need clear paths into the WisConnect ecosystem.</p><div className="join-grid"><Link href="/join"><span>01 · Membership</span><strong>Become a Member</strong><p>Learn about membership and apply.</p><b><ArrowUpRightIcon/></b></Link><a href="mailto:hello@wisconnect.co?subject=Partnership%20Interest"><span>02 · Partnership</span><strong>Partner with WisConnect</strong><p>Explore institutional collaboration.</p><b><ArrowUpRightIcon/></b></a><a href="#businesses"><span>03 · Business</span><strong>Discover Member Businesses</strong><p>Explore the people and enterprises.</p><b><ArrowUpRightIcon/></b></a></div></div></section>

    <footer className="site-footer"><div className="shell footer-grid"><div className="footer-brand"><img src={assetPath('logo-horizontal.webp')} alt="WisConnect"/><p>People · Capital · Communities · A Brighter Tomorrow</p></div><div><strong>Explore</strong><a href="#about">About</a><a href="#what-we-do">What We Do</a><a href="#members">Members</a><a href="#impact">Impact</a></div><div><strong>Connect</strong><Link href="/join">Join</Link><a href="#stories">Stories & Events</a><a href="mailto:hello@wisconnect.co">Contact</a><span>EN / FR</span></div><div><strong>Next phase</strong><span>Marketplace</span><span>Member Portal</span><span>Mobile App</span></div></div><div className="shell footer-bottom"><span>© 2026 WisConnect</span><span>Privacy · Terms</span></div></footer>
  </main></div></MotionConfig>
}
