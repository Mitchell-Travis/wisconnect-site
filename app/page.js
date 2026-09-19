"use client";

import { useEffect, useState } from "react";

const sectors = [
  ["Food & Beverages", "F"],
  ["Consulting Services", "C"],
  ["Agriculture", "A"],
  ["Textiles & Apparel", "T"],
  ["Handmade Crafts", "H"],
  ["Training", "T"]
];

const regions = {
  Africa: "WisConnect’s cultural and strategic root.",
  "United States": "Partnership, leadership and cross-border opportunity.",
  "Brazil / South America": "A priority direction within the global vision.",
  "Vietnam / Southeast Asia": "A priority direction within the global vision."
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [sector, setSector] = useState(sectors[0]);
  const [region, setRegion] = useState("Africa");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="shell nav-shell">
          <a className="brand" href="#top" aria-label="WisConnect home">
            <img src="/assets/logo-horizontal.webp" alt="WisConnect" />
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#about">About</a>
            <a href="#what">What We Do</a>
            <a href="#coop">Our Cooperative</a>
            <a href="#members">Members</a>
            <a href="#impact">Impact</a>
            <a href="#stories">Stories</a>
            <span className="language">EN / FR</span>
            <a className="button button-small" href="#join">Join Us</a>
          </nav>

          <button className="menu-button" aria-label="Toggle menu" onClick={() => setMenuOpen(v => !v)}>
            <span /><span />
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            {[
              ["About", "#about"],
              ["What We Do", "#what"],
              ["Our Cooperative", "#coop"],
              ["Members", "#members"],
              ["Impact", "#impact"],
              ["Stories", "#stories"]
            ].map(([label, href]) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
            ))}
            <span>English / Français</span>
            <a className="button" href="#join" onClick={() => setMenuOpen(false)}>Join Us</a>
          </div>
        )}
      </header>

      <main id="top">
        <section className="hero">
          <img className="hero-bg" src="/assets/bg-light.webp" alt="" aria-hidden="true" />
          <div className="shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Local roots. Global reach.</p>
              <h1>Connected women.<br />Shared ownership.<br />Stronger communities.</h1>
              <p className="hero-lede">
                WisConnect is a worker-owned cooperative connecting women entrepreneurs,
                business opportunity, capital and communities to build shared prosperity across borders.
              </p>
              <div className="hero-actions">
                <a className="button" href="#join">Join the Cooperative <span>↗</span></a>
                <a className="text-link" href="#coop">Discover WisConnect <span>↓</span></a>
              </div>
            </div>
            <div className="hero-art">
              <span className="orbit orbit-a" />
              <span className="orbit orbit-b" />
              <img src="/assets/hero-visionary.webp" alt="WisConnect editorial portrait" />
            </div>
          </div>
        </section>

        <section id="about" className="section section-roomy manifesto">
          <div className="shell manifesto-grid">
            <div>
              <p className="eyebrow">The belief behind the cooperative</p>
              <h2>When women own,<br />communities grow.</h2>
            </div>
            <div className="manifesto-copy">
              <p>WisConnect brings people, capital, businesses and community assets into a cooperative model designed to create opportunity that can be shared.</p>
              <p>It is about ownership, dignity, professional growth and economic participation that strengthens the wider community.</p>
            </div>
          </div>
        </section>

        <section id="coop" className="section cooperative-section">
          <div className="shell">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow">How the cooperative works</p>
                <h2>People. Capital.<br />Communities.</h2>
              </div>
              <p>The WisConnect model connects ambitious women entrepreneurs with resources, opportunity and a community designed for shared success.</p>
            </div>
            <div className="model-grid">
              <article className="model-card">
                <span className="number">01</span>
                <h3>People</h3>
                <p>Members, entrepreneurs, professionals and community leaders.</p>
              </article>
              <article className="model-card featured">
                <span className="number">02</span>
                <h3>Capital</h3>
                <p>Shared resources, economic opportunity and investment-related access.</p>
              </article>
              <article className="model-card">
                <span className="number">03</span>
                <h3>Communities</h3>
                <p>Businesses, projects and local development that build shared prosperity.</p>
              </article>
            </div>
            <div className="ownership-line"><span />Collective ownership connects the system<span /></div>
          </div>
        </section>

        <section id="members" className="section members-section">
          <div className="shell">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow">Meet the collective</p>
                <h2>Real women.<br />Real businesses.</h2>
              </div>
              <p>Public profiles will use verified, consented member information. This layout is ready for the Phase 1 Member Directory.</p>
            </div>
            <div className="member-layout">
              <article className="member-feature portrait-placeholder">
                <div className="placeholder-copy">
                  <span>Featured member</span>
                  <strong>Name · Business · Location · Expertise</strong>
                </div>
              </article>
              <div className="member-stack">
                <article className="member-mini"><span>Member profile</span><strong>Business · Expertise</strong></article>
                <article className="member-mini"><span>Member profile</span><strong>Business · Expertise</strong></article>
              </div>
            </div>
          </div>
        </section>

        <section className="section businesses-section">
          <div className="shell">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow">Member businesses</p>
                <h2>What our members<br />are building.</h2>
              </div>
              <p>These sectors come from WisConnect discovery. Phase 1 creates visibility; Phase 2 can turn the same discovery layer into commerce.</p>
            </div>
            <div className="sector-tabs">
              {sectors.map(item => (
                <button key={item[0]} className={sector[0] === item[0] ? "active" : ""} onClick={() => setSector(item)}>{item[0]}</button>
              ))}
            </div>
            <div className="business-showcase">
              <div className="business-visual"><div className="business-symbol">{sector[1]}</div></div>
              <div className="business-copy">
                <p className="eyebrow">Selected sector</p>
                <h3>{sector[0]}</h3>
                <p>Verified member businesses in this category will be featured here with profile links, business information and stories.</p>
                <div className="phase-note">Phase 2 evolution: these entries can become marketplace listings.</div>
              </div>
            </div>
          </div>
        </section>

        <section id="what" className="section what-section">
          <div className="shell">
            <div className="section-heading">
              <p className="eyebrow">What WisConnect does</p>
              <h2>From ownership<br />to opportunity.</h2>
            </div>
            <div className="program-list">
              {[
                ["01", "Build collective ownership", "Create a cooperative foundation where members participate in shared value."],
                ["02", "Expand access to capital & opportunity", "Connect the network to relevant resources and economic opportunity."],
                ["03", "Strengthen member businesses", "Support growth, visibility, learning and business development."],
                ["04", "Invest in thriving communities", "Connect business growth to projects and outcomes that strengthen communities."]
              ].map(([n, title, copy]) => (
                <article key={n}><span>{n}</span><div><h3>{title}</h3><p>{copy}</p></div></article>
              ))}
            </div>
          </div>
        </section>

        <section id="impact" className="section dark-surface">
          <img className="impact-bg" src="/assets/bg-dark.webp" alt="" aria-hidden="true" />
          <div className="shell impact-inner">
            <div className="section-heading split-heading light-copy">
              <div><p className="eyebrow">Impact & proof</p><h2>Evidence before impressive-looking numbers.</h2></div>
              <p>Public metrics should only appear after WisConnect verifies them.</p>
            </div>
            <div className="impact-grid">
              {["Verified members", "Member businesses", "Projects / programs", "Measured outcomes"].map(label => (
                <div key={label}><span>{label}</span><strong>—</strong><p>Verified data pending</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="section global-section">
          <div className="shell global-layout">
            <div className="global-copy">
              <p className="eyebrow">Local roots. Global reach.</p>
              <h2>The orbit becomes the story.</h2>
              <p>WisConnect is rooted in Africa and building relationships across regions.</p>
              <div className="region-buttons">
                {Object.keys(regions).map(key => (
                  <button key={key} className={region === key ? "active" : ""} onClick={() => setRegion(key)}>{key}</button>
                ))}
              </div>
              <div className="region-note"><strong>{region}</strong><span>{regions[region]}</span></div>
            </div>
            <div className="orbit-visual">
              <span className="ring r1" /><span className="ring r2" /><span className="ring r3" />
              <img src="/assets/logo-symbol.webp" alt="WisConnect orbit symbol" />
              <i className="node us">US</i><i className="node br">BR</i><i className="node vn">VN</i><i className="node af">AF</i>
            </div>
          </div>
        </section>

        <section id="stories" className="section stories-section">
          <div className="shell">
            <div className="section-heading split-heading">
              <div><p className="eyebrow">Stories from the network</p><h2>Make the institution feel alive.</h2></div>
              <p>Member stories, cooperative updates and events should show real work and outcomes.</p>
            </div>
            <div className="stories-grid">
              <article className="story-feature"><div className="story-image" /><span>Featured story</span><h3>How a WisConnect member is building opportunity through her business.</h3></article>
              <div className="story-stack">
                <article><span>News</span><h3>Cooperative update</h3></article>
                <article><span>Event</span><h3>Upcoming event</h3></article>
                <article><span>Gallery</span><h3>Community moment</h3></article>
              </div>
            </div>
          </div>
        </section>

        <section id="join" className="section join-section">
          <div className="shell">
            <p className="eyebrow">Participation</p>
            <h2>Ownership is stronger<br />when it’s shared.</h2>
            <div className="join-grid">
              <a href="mailto:hello@wisconnect.co?subject=Membership%20Interest"><small>01 · Membership</small><strong>Become a Member</strong><span>Start the membership conversation. ↗</span></a>
              <a href="mailto:hello@wisconnect.co?subject=Partnership%20Interest"><small>02 · Partnership</small><strong>Partner with WisConnect</strong><span>Explore institutional collaboration. ↗</span></a>
              <a href="#members"><small>03 · Business</small><strong>Discover Member Businesses</strong><span>Explore the people and enterprises. ↗</span></a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="shell footer-grid">
          <div className="footer-brand"><img src="/assets/logo-horizontal.webp" alt="WisConnect" /><p>People · Capital · Communities · A Brighter Tomorrow</p></div>
          <div><strong>Explore</strong><a href="#about">About</a><a href="#what">What We Do</a><a href="#members">Members</a><a href="#impact">Impact</a></div>
          <div><strong>Connect</strong><a href="#join">Join</a><a href="#stories">Stories & Events</a><a href="mailto:hello@wisconnect.co">Contact</a></div>
          <div><strong>Next phase</strong><span>Marketplace</span><span>Member Portal</span><span>Mobile App</span></div>
        </div>
      </footer>
    </>
  );
}
