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

  useEffect(()=>{
    let raf=0;
    const onScroll=()=>{
      if(raf) return;
      raf=requestAnimationFrame(()=>{
        const y=window.scrollY;
        setScrolled(y>28);
        const hero=document.querySelector('.hero');
        if(hero){
          const shift=Math.min(y*0.16,96);
          const fade=Math.max(0,1-y/720);
          hero.style.setProperty('--hero-shift',`${shift}px`);
          hero.style.setProperty('--hero-fade',fade.toString());
        }
        raf=0;
      });
    };
    const io=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },{threshold:0.12,rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
    onScroll();
    window.addEventListener('scroll',onScroll,{passive:true});
    return()=>{
      window.removeEventListener('scroll',onScroll);
      io.disconnect();
      if(raf) cancelAnimationFrame(raf);
    };
  },[]);

  const close=()=>setMenuOpen(false);

  return <main>
    <header className={`site-header ${scrolled?'scrolled':''}`}>
      <div className="shell nav-shell">
        <a className="brand" href="#top" onClick={close} aria-label="WisConnect home">
          <img src="assets/logo-horizontal.webp" alt="WisConnect"/>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#what-we-do">What We Do</a>
          <a href="#cooperative">Our Cooperative</a>
          <a href="#members">Members</a>
          <a href="#impact">Impact</a>
          <a href="#stories">Stories</a>
          <span className="language">EN / FR</span>
          <a className="button button-small" href="#join">Join Us <span aria-hidden="true">↗</span></a>
        </nav>
        <button className={`menu-button ${menuOpen?'open':''}`} onClick={()=>setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation"><span></span><span></span></button>
      </div>
      {menuOpen && <nav className="mobile-menu" aria-label="Mobile navigation">
        <a href="#about" onClick={close}>About</a><a href="#what-we-do" onClick={close}>What We Do</a><a href="#cooperative" onClick={close}>Our Cooperative</a><a href="#members" onClick={close}>Members</a><a href="#impact" onClick={close}>Impact</a><a href="#stories" onClick={close}>Stories</a><span className="language">English / Français</span><a className="button" href="#join" onClick={close}>Join Us ↗</a>
      </nav>}
    </header>

    <section id="top" className="hero light-surface">
      <div className="hero-mesh hero-mesh-one"></div>
      <div className="hero-mesh hero-mesh-two"></div>
      <div className="hero-orbit-line hero-orbit-line-one"></div>
      <div className="hero-orbit-line hero-orbit-line-two"></div>
      <div className="shell hero-grid">
        <div className="hero-copy">
          <p className="eyebrow hero-enter hero-enter-1">Local roots. Global reach.</p>
          <h1 className="hero-title" aria-label="Connected women. Shared ownership. Stronger communities.">
            <span className="hero-line hero-enter hero-enter-2">Connected women.</span>
            <span className="hero-line hero-enter hero-enter-3">Shared ownership.</span>
            <span className="hero-line hero-enter hero-enter-4">Stronger communities.</span>
          </h1>
          <p className="hero-lede hero-enter hero-enter-5">A global cooperative connecting Black women entrepreneurs, capital, business opportunity and communities through collective ownership.</p>
          <div className="hero-actions hero-enter hero-enter-6">
            <a className="button" href="#join">Join the Cooperative <span aria-hidden="true">↗</span></a>
            <a className="secondary-button" href="#cooperative"><span className="play-dot" aria-hidden="true">↘</span> Discover WisConnect</a>
          </div>
          <div className="hero-proof hero-enter hero-enter-7" aria-label="WisConnect focus areas">
            <span><i>01</i> Women entrepreneurs</span>
            <span><i>02</i> Economic opportunity</span>
            <span><i>03</i> Thriving communities</span>
          </div>
        </div>

        <div className="hero-art hero-enter hero-enter-art">
          <div className="hero-glow"></div>
          <div className="orbit orbit-a"></div>
          <div className="orbit orbit-b"></div>
          <div className="orbit orbit-c"></div>
          <span className="orbit-node orbit-node-one"></span>
          <span className="orbit-node orbit-node-two"></span>
          <span className="orbit-node orbit-node-three"></span>
          <div className="hero-image-stage">
            <img className="hero-portrait" src="assets/hero-premium.png" alt="WisConnect editorial portrait"/>
          </div>
          <div className="hero-side-note">
            <span>Local roots.</span><span>Global reach.</span><span>Greater together.</span>
          </div>
        </div>
      </div>
      <div className="hero-scroll-cue hero-enter hero-enter-8"><span>Scroll to discover</span><i></i></div>
    </section>

    <section id="about" className="manifesto section section-roomy">
      <div className="shell manifesto-grid reveal">
        <div><p className="eyebrow">The belief behind the cooperative</p><h2>When women own,<br/>communities grow.</h2></div>
        <div className="manifesto-copy"><p>WisConnect brings people, capital, businesses and community assets into a cooperative model designed to create opportunity that can be shared.</p><p>It is about ownership, dignity, professional growth and economic participation that strengthens the wider community.</p><div className="manifesto-values"><span>Connection</span><span>Dignity</span><span>Shared prosperity</span></div></div>
      </div>
    </section>

    <section id="cooperative" className="section cooperative-section">
      <div className="shell">
        <div className="section-heading split-heading reveal"><div><p className="eyebrow">How the cooperative works</p><h2>People. Capital. Communities.</h2></div><p>The WisConnect model connects ambitious women entrepreneurs with resources, opportunity and a community designed for shared success.</p></div>
        <div className="model-grid reveal">
          <article className="model-card"><span className="number">01</span><div className="model-icon">●●</div><h3>People</h3><p>Women entrepreneurs, cooperative members, professionals and community leaders.</p></article>
          <article className="model-card featured"><span className="number">02</span><div className="model-icon">◎</div><h3>Capital</h3><p>Shared resources, economic opportunity and investment-related access.</p></article>
          <article className="model-card"><span className="number">03</span><div className="model-icon">◌</div><h3>Communities</h3><p>Businesses, projects and local development that build shared prosperity.</p></article>
        </div>
        <div className="ownership-line reveal"><span></span><strong>Collective ownership connects the system.</strong><span></span></div>
      </div>
    </section>

    <section id="members" className="section members-section">
      <div className="shell">
        <div className="section-heading split-heading reveal"><div><p className="eyebrow">Meet the collective</p><h2>Real women.<br/>Real businesses.</h2></div><p>Public profiles will use verified, consented WisConnect member information.</p></div>
        <div className="member-layout reveal">
          <div className="member-feature portrait-placeholder"><div className="member-orbit"></div><div className="placeholder-copy"><span>Featured member</span><strong>Member story, business, location and expertise.</strong><p>Real photography will replace this card as member content is approved.</p></div></div>
          <div className="member-stack"><div className="member-mini"><span>Member profile</span><strong>Business · Location · Expertise</strong></div><div className="member-mini"><span>Member profile</span><strong>Business · Location · Expertise</strong></div></div>
        </div>
      </div>
    </section>

    <section className="section businesses-section">
      <div className="shell">
        <div className="section-heading split-heading reveal"><div><p className="eyebrow">Member businesses</p><h2>What our members are building.</h2></div><p>Phase 1 introduces member businesses; this same foundation can expand into marketplace commerce in Phase 2.</p></div>
        <div className="sector-tabs reveal">{sectors.map(s=><button key={s} className={sector===s?'active':''} onClick={()=>setSector(s)}>{s}</button>)}</div>
        <div className="business-showcase reveal"><div className="business-visual"><div className="business-ring"></div><div className="business-symbol">{sector[0]}</div></div><div className="business-copy"><p className="eyebrow">Selected sector</p><h3>{sector}</h3><p>Verified member businesses in this category will be featured here with profile links and business information.</p><span className="phase-note">Phase 2: these entries can evolve into marketplace listings.</span></div></div>
      </div>
    </section>

    <section id="what-we-do" className="section what-section">
      <div className="shell"><div className="section-heading reveal"><p className="eyebrow">What WisConnect does</p><h2>From ownership to opportunity.</h2></div>
        <div className="program-list">
          <article className="reveal"><span>01</span><div><h3>Build collective ownership</h3><p>Create a cooperative foundation where members participate in shared value.</p></div></article>
          <article className="reveal"><span>02</span><div><h3>Expand access to capital & opportunity</h3><p>Connect the network to relevant resources, partnerships and economic opportunity.</p></div></article>
          <article className="reveal"><span>03</span><div><h3>Strengthen member businesses</h3><p>Support professional growth, visibility, learning and business development.</p></div></article>
          <article className="reveal"><span>04</span><div><h3>Invest in thriving communities</h3><p>Connect business growth to projects and outcomes that strengthen communities.</p></div></article>
        </div>
      </div>
    </section>

    <section id="impact" className="section impact-section dark-surface">
      <div className="shell impact-inner">
        <div className="section-heading split-heading light-copy reveal"><div><p className="eyebrow">Impact & proof</p><h2>Evidence before impressive-looking numbers.</h2></div><p>Public metrics should only appear after WisConnect verifies them.</p></div>
        <div className="impact-grid reveal"><div><span>Members</span><strong>—</strong><p>Verified count</p></div><div><span>Member businesses</span><strong>—</strong><p>Verified count</p></div><div><span>Projects & programs</span><strong>—</strong><p>Verified activity</p></div><div><span>Community outcomes</span><strong>—</strong><p>Measured impact</p></div></div>
      </div>
    </section>

    <section className="section global-section">
      <div className="shell global-layout reveal">
        <div className="global-copy"><p className="eyebrow">Local roots. Global reach.</p><h2>The orbit becomes the story.</h2><p>WisConnect’s network is rooted in Africa and extends toward relationships and opportunities across regions.</p>
          <div className="region-buttons">{Object.keys(regions).map(r=><button key={r} className={region===r?'active':''} onClick={()=>setRegion(r)}>{r}</button>)}</div>
          <div className="region-note"><strong>{region}</strong><span>{regions[region]}</span></div>
        </div>
        <div className="orbit-visual"><div className="ring r1"></div><div className="ring r2"></div><div className="ring r3"></div><img className="orbit-logo" src="assets/logo-symbol.webp" alt="WisConnect orbit symbol"/><i className="node us">US</i><i className="node br">BR</i><i className="node vn">VN</i><i className="node af">AF</i></div>
      </div>
    </section>

    <section id="stories" className="section stories-section">
      <div className="shell">
        <div className="section-heading split-heading reveal"><div><p className="eyebrow">Stories from the network</p><h2>Make the institution feel alive.</h2></div><p>Member stories, cooperative updates and events should show real work and real outcomes.</p></div>
        <div className="stories-grid reveal"><article className="story-feature"><div className="story-image"><div className="story-shape"></div></div><span>Featured story</span><h3>How a WisConnect member is building opportunity through her business.</h3><p>Real member story and verified outcome will appear here.</p></article><div className="story-stack"><article><span>News</span><h3>Cooperative update</h3></article><article><span>Event</span><h3>Upcoming event</h3></article><article><span>Gallery</span><h3>Community moment</h3></article></div></div>
      </div>
    </section>

    <section id="join" className="section join-section">
      <div className="shell reveal"><p className="eyebrow">Participation</p><h2>Ownership is stronger<br/>when it’s shared.</h2><p className="join-lede">Different audiences need clear paths into the WisConnect ecosystem.</p><div className="join-grid"><a href="mailto:hello@wisconnect.co?subject=Membership%20Interest"><small>01 · Membership</small><strong>Become a Member</strong><span>Start the membership conversation.</span><b>↗</b></a><a href="mailto:hello@wisconnect.co?subject=Partnership%20Interest"><small>02 · Partnership</small><strong>Partner with WisConnect</strong><span>Explore institutional collaboration.</span><b>↗</b></a><a href="#members"><small>03 · Business</small><strong>Discover Member Businesses</strong><span>Explore the people and enterprises.</span><b>↗</b></a></div></div>
    </section>

    <footer className="site-footer">
      <div className="shell footer-grid reveal"><div className="footer-brand"><img src="assets/logo-horizontal.webp" alt="WisConnect"/><p>People · Capital · Communities · A Brighter Tomorrow</p></div><div><strong>Explore</strong><a href="#about">About</a><a href="#what-we-do">What We Do</a><a href="#members">Members</a><a href="#impact">Impact</a></div><div><strong>Connect</strong><a href="#join">Join</a><a href="#stories">Stories & Events</a><a href="mailto:hello@wisconnect.co">Contact</a><span>EN / FR</span></div><div><strong>Next phase</strong><span>Marketplace</span><span>Member Portal</span><span>Mobile App</span></div></div>
      <div className="shell footer-bottom"><span>© 2026 WisConnect</span><span>Privacy · Terms</span></div>
    </footer>
  </main>
}