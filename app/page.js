'use client';

import { useEffect, useState } from 'react';

const sectors = ['Food & Beverages','Consulting Services','Agriculture','Textiles & Apparel','Handmade Crafts','Training'];
const regions = {
  Africa: 'WisConnect’s cultural and strategic root — where local businesses, communities and cooperative opportunity connect.',
  'United States': 'A relationship and partnership market for cooperative leadership, resources and cross-border opportunity.',
  'Brazil / South America': 'A priority direction within WisConnect’s wider global-connection vision.',
  'Vietnam / Southeast Asia': 'A priority direction within WisConnect’s wider global-connection vision.'
};

export default function Home(){
  const [menuOpen,setMenuOpen]=useState(false);
  const [sector,setSector]=useState(sectors[0]);
  const [region,setRegion]=useState('Africa');
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{const fn=()=>setScrolled(window.scrollY>40);fn();window.addEventListener('scroll',fn,{passive:true});return()=>window.removeEventListener('scroll',fn)},[]);
  const close=()=>setMenuOpen(false);
  return <main>
    <header className={`site-header ${scrolled?'scrolled':''}`}><div className="shell nav-shell">
      <a className="brand" href="#top" onClick={close}><img src="assets/logo-horizontal.webp" alt="WisConnect"/></a>
      <nav className={`desktop-nav ${menuOpen?'open':''}`} aria-label="Primary navigation">
        <a href="#about" onClick={close}>About</a><a href="#what-we-do" onClick={close}>What We Do</a><a href="#cooperative" onClick={close}>Our Cooperative</a><a href="#members" onClick={close}>Members</a><a href="#impact" onClick={close}>Impact</a><a href="#stories" onClick={close}>Stories</a><span className="language">EN / FR</span><a className="button button-small" href="#join" onClick={close}>Join Us</a>
      </nav><button className="menu-button" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Toggle navigation"><span></span><span></span></button>
    </div></header>

    <section id="top" className="hero light-surface"><div className="shell hero-grid">
      <div className="hero-copy"><p className="eyebrow">Local roots. Global reach.</p><h1>Connected women.<br/>Shared ownership.<br/>Stronger communities.</h1><p className="hero-lede">WisConnect is a worker-owned cooperative connecting women entrepreneurs, business opportunity, capital and communities to build shared prosperity across borders.</p><div className="hero-actions"><a className="button" href="#join">Join the Cooperative ↗</a><a className="text-link" href="#cooperative">Discover WisConnect ↓</a></div></div>
      <div className="hero-art"><div className="orbit orbit-a"></div><div className="orbit orbit-b"></div><img className="hero-portrait" src="assets/hero-visionary.webp" alt="WisConnect editorial portrait"/></div>
    </div></section>

    <section id="about" className="manifesto section section-roomy"><div className="shell manifesto-grid"><div><p className="eyebrow">The belief behind the cooperative</p><h2>When women own,<br/>communities grow.</h2></div><div className="manifesto-copy"><p>WisConnect brings people, capital, businesses and community assets into a cooperative model designed to create opportunity that can be shared.</p><p>It is about ownership, dignity, professional growth and economic participation that strengthens the wider community.</p></div></div></section>

    <section id="cooperative" className="section cooperative-section"><div className="shell"><div className="section-heading split-heading"><div><p className="eyebrow">How the cooperative works</p><h2>People. Capital. Communities.</h2></div><p>The WisConnect model connects ambitious women entrepreneurs with resources, opportunity and a community designed for shared success.</p></div><div className="model-grid">
      <article className="model-card"><span className="number">01</span><h3>People</h3><p>Women entrepreneurs, cooperative members, professionals and community leaders.</p></article>
      <article className="model-card featured"><span className="number">02</span><h3>Capital</h3><p>Shared resources, economic opportunity and investment-related access.</p></article>
      <article className="model-card"><span className="number">03</span><h3>Communities</h3><p>Businesses, projects and local development that build shared prosperity.</p></article>
    </div><div className="ownership-line"><span></span><strong>Collective ownership connects the system.</strong><span></span></div></div></section>

    <section id="members" className="section members-section"><div className="shell"><div className="section-heading split-heading"><div><p className="eyebrow">Meet the collective</p><h2>Real women.<br/>Real businesses.</h2></div><p>Public profiles will use verified, consented WisConnect member information.</p></div><div className="member-layout"><div className="member-feature portrait-placeholder"><div className="placeholder-copy"><span>Featured member</span><strong>Member story, business, location and expertise.</strong></div></div><div className="member-stack"><div className="member-mini"><span>Member profile</span><strong>Business · Location · Expertise</strong></div><div className="member-mini"><span>Member profile</span><strong>Business · Location · Expertise</strong></div></div></div></div></section>

    <section className="section businesses-section"><div className="shell"><div className="section-heading split-heading"><div><p className="eyebrow">Member businesses</p><h2>What our members are building.</h2></div><p>Phase 1 introduces member businesses; this same foundation can expand into marketplace commerce in Phase 2.</p></div><div className="sector-tabs">{sectors.map(s=><button key={s} className={sector===s?'active':''} onClick={()=>setSector(s)}>{s}</button>)}</div><div className="business-showcase"><div className="business-visual"><div className="business-symbol">{sector[0]}</div></div><div className="business-copy"><p className="eyebrow">Selected sector</p><h3>{sector}</h3><p>Verified member businesses in this category will be featured here with profile links and business information.</p><span className="phase-note">Phase 2: these entries can evolve into marketplace listings.</span></div></div></div></section>

    <section id="what-we-do" className="section what-section"><div className="shell"><div className="section-heading"><p className="eyebrow">What WisConnect does</p><h2>From ownership to opportunity.</h2></div><div className="program-list">
      <article><span>01</span><div><h3>Build collective ownership</h3><p>Create a cooperative foundation where members participate in shared value.</p></div></article>
      <article><span>02</span><div><h3>Expand access to capital & opportunity</h3><p>Connect the network to relevant resources, partnerships and economic opportunity.</p></div></article>
      <article><span>03</span><div><h3>Strengthen member businesses</h3><p>Support professional growth, visibility, learning and business development.</p></div></article>
      <article><span>04</span><div><h3>Invest in thriving communities</h3><p>Connect business growth to projects and outcomes that strengthen communities.</p></div></article>
    </div></div></section>

    <section id="impact" className="section impact-section dark-surface"><div className="shell impact-inner"><div className="section-heading split-heading light-copy"><div><p className="eyebrow">Impact & proof</p><h2>Evidence before impressive-looking numbers.</h2></div><p>Public metrics should only appear after WisConnect verifies them.</p></div><div className="impact-grid"><div><span>Members</span><strong>—</strong><p>Verified count</p></div><div><span>Member businesses</span><strong>—</strong><p>Verified count</p></div><div><span>Projects & programs</span><strong>—</strong><p>Verified activity</p></div><div><span>Community outcomes</span><strong>—</strong><p>Measured impact</p></div></div></div></section>

    <section className="section global-section"><div className="shell global-grid"><div className="global-copy"><p className="eyebrow">Local roots. Global reach.</p><h2>The orbit becomes the story.</h2><p>WisConnect’s network is rooted in Africa and extends toward relationships and opportunities across regions.</p><div className="region-buttons">{Object.keys(regions).map(r=><button key={r} className={region===r?'active':''} onClick={()=>setRegion(r)}>{r}</button>)}</div><div className="region-detail"><strong>{region}</strong><p>{regions[region]}</p></div></div><div className="global-orbit"><div className="ring ring-1"></div><div className="ring ring-2"></div><div className="ring ring-3"></div><img className="orbit-logo" src="assets/logo-symbol.webp" alt="WisConnect orbit symbol"/><span className="node node-us">US</span><span className="node node-br">BR</span><span className="node node-vn">VN</span><span className="node node-af">AF</span></div></div></section>

    <section id="stories" className="section stories-section"><div className="shell"><div className="section-heading split-heading"><div><p className="eyebrow">Stories from the network</p><h2>Make the institution feel alive.</h2></div><p>Member stories, cooperative updates and events should show real work and real outcomes.</p></div><div className="stories-grid"><article className="story-feature"><div className="story-media"></div><span>Featured story</span><h3>How a WisConnect member is building opportunity through her business.</h3><p>Real member story and verified outcome will appear here.</p></article><div className="story-stack"><article><span>News</span><h3>Cooperative update</h3></article><article><span>Event</span><h3>Upcoming event</h3></article><article><span>Gallery</span><h3>Community moment</h3></article></div></div></div></section>

    <section id="join" className="section join-section"><div className="shell"><p className="eyebrow">Participation</p><h2>Ownership is stronger<br/>when it’s shared.</h2><p className="join-lede">Different audiences need clear paths into the WisConnect ecosystem.</p><div className="join-grid"><a href="mailto:hello@wisconnect.co?subject=Membership%20Interest"><span>01 · Membership</span><strong>Become a Member</strong><p>Start the membership conversation.</p><b>↗</b></a><a href="mailto:hello@wisconnect.co?subject=Partnership%20Interest"><span>02 · Partnership</span><strong>Partner with WisConnect</strong><p>Explore institutional collaboration.</p><b>↗</b></a><a href="#members"><span>03 · Business</span><strong>Discover Member Businesses</strong><p>Explore the people and enterprises.</p><b>↗</b></a></div></div></section>

    <footer className="site-footer"><div className="shell footer-grid"><div className="footer-brand"><img src="assets/logo-horizontal.webp" alt="WisConnect"/><p>People · Capital · Communities · A Brighter Tomorrow</p></div><div><strong>Explore</strong><a href="#about">About</a><a href="#what-we-do">What We Do</a><a href="#members">Members</a><a href="#impact">Impact</a></div><div><strong>Connect</strong><a href="#join">Join</a><a href="#stories">Stories & Events</a><a href="mailto:hello@wisconnect.co">Contact</a><span>EN / FR</span></div><div><strong>Next phase</strong><span>Marketplace</span><span>Member Portal</span><span>Mobile App</span></div></div><div className="shell footer-bottom"><span>© 2026 WisConnect</span><span>Privacy · Terms</span></div></footer>
  </main>
}