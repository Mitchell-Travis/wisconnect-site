'use client';

import Icon from "./site-icon";

import { useState } from 'react';
import Link from 'next/link';
import styles from './what-wisconnect-does.module.css';

const areas = [
  { name: 'Advising', title: 'Cooperative governance & operations advice', summary: 'Advice for your business. A voice in shared decisions.', description: 'Explore business operations and shared decisions with practical advice.', points: ['Operations advice', 'Business guidance', 'Shared decision-making'] },
  { name: 'Spaces', title: 'Commercial space & community ownership', summary: 'Space to work, grow and serve your community.', description: 'Our vision includes affordable commercial space and community-owned assets for local businesses.', points: ['Affordable commercial space', 'Inclusive development', 'Community-owned assets'] },
  { name: 'Growth', title: 'Business development & visibility', summary: 'Build your business. Help more people discover it.', description: 'Consulting, shared marketing and introductions. In Liberia, this includes construction, agriculture, and food and beverage businesses.', points: ['Business consulting', 'Shared marketing', 'Entrepreneur introductions'] },
  { name: 'Connections', title: 'Trade & relationships across borders', summary: 'Reach beyond your local market.', description: 'Explore ways to access markets and build relationships with partners, suppliers and customers across borders.', points: ['International markets', 'Business partnerships', 'Build a global value chain'] },
];

function SupportIllustration({ index }: { index: number }) {
  return <svg viewBox="0 0 320 220" fill="none" aria-hidden="true" className={styles.illustration}>
    {index === 0 ? <>
      <ellipse cx="160" cy="173" rx="102" ry="18" fill="var(--lilac)" opacity=".45"/>
      <path d="M70 107 160 56l90 51-90 54-90-54Z" fill="var(--lilac)" stroke="var(--purple)" strokeWidth="1.5"/>
      <path d="m70 107 90 54 90-54v18l-90 54-90-54v-18Z" fill="var(--purple)"/>
      <circle cx="160" cy="45" r="16" fill="var(--gold)"/><circle cx="67" cy="105" r="16" fill="var(--mauve)"/><circle cx="253" cy="105" r="16" fill="var(--mauve)"/><circle cx="160" cy="170" r="16" fill="var(--gold)"/>
      <path d="m146 103 10 10 22-25" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </> : index === 1 ? <>
      <ellipse cx="162" cy="194" rx="115" ry="10" fill="var(--lilac)" opacity=".45"/>
      <path d="M65 192V73l98-35 94 35v119H65Z" fill="var(--lilac)"/>
      <path d="M65 73h192M163 38v154" stroke="var(--purple)" strokeWidth="1.5"/>
      <path d="M85 192v-69a28 28 0 0 1 56 0v69M183 192v-69a28 28 0 0 1 56 0v69" fill="var(--purple)"/>
      <path d="M85 124h56M183 124h56" stroke="var(--gold)" strokeWidth="3"/>
      <circle cx="266" cy="51" r="21" fill="var(--gold)"/><path d="M51 192h221" stroke="var(--plum)" strokeWidth="2"/>
    </> : index === 2 ? <>
      <path d="M57 185h205" stroke="var(--purple)" strokeWidth="1.5"/>
      <rect x="64" y="134" width="51" height="51" rx="7" fill="var(--lilac)"/><rect x="134" y="99" width="51" height="86" rx="7" fill="var(--mauve)"/><rect x="204" y="57" width="51" height="128" rx="7" fill="var(--purple)"/>
      <path d="M63 105c68-5 103-35 131-67m-25 0h25v25" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="267" cy="33" r="10" fill="var(--gold)"/><circle cx="49" cy="127" r="4" fill="var(--mauve)"/>
    </> : <>
      <circle cx="160" cy="113" r="75" fill="var(--lilac)" fillOpacity=".5" stroke="var(--purple)" strokeWidth="1.5"/>
      <ellipse cx="160" cy="113" rx="33" ry="75" stroke="var(--purple)" strokeWidth="1.5"/><path d="M90 87h140M85 120h150M98 150h124" stroke="var(--purple)" strokeWidth="1.5"/>
      <path d="M47 157c23-87 161-120 224-75M55 67c81 0 123 121 212 108" stroke="var(--gold)" strokeWidth="3" strokeDasharray="5 6"/>
      <circle cx="52" cy="150" r="11" fill="var(--purple)"/><circle cx="266" cy="83" r="11" fill="var(--gold)"/><circle cx="239" cy="168" r="9" fill="var(--mauve)"/>
    </>}
  </svg>;
}

export function WhatWisConnectDoes() {
  const [active, setActive] = useState(0);

  return <section id="what-we-do" data-divider="background" className={styles.section} aria-labelledby="what-we-do-title">
    <div className={styles.inner} data-content-rail>
      <header className={styles.heading} data-home-reveal>
        <p className={styles.eyebrow}>What WisConnect does</p>
        <h2 id="what-we-do-title" data-section-headline>Expertise, space<br/>{' '}and <em>connections.</em></h2>
        <p data-section-description className={styles.intro}>Share expertise, find room to grow and build relationships across Africa and the diaspora.</p>
        <Link className={styles.cta} href="/contact">Talk about your business <Icon kind="external" size={18}/></Link>
      </header>
      <div className={styles.deck}>
        {areas.map((area, index) => <article key={area.name} className={styles.card} data-active={active === index} onPointerEnter={event => { if (event.pointerType === 'mouse' && window.matchMedia('(min-width: 1151px) and (hover: hover)').matches) setActive(index); }}>
          <h3 className={styles.cardHeading}><button type="button" aria-expanded={active === index} aria-controls={`support-detail-${index}`} onClick={() => setActive(index)} onFocus={() => setActive(index)}>
            <span className={styles.number}>0{index + 1}</span><span>{area.name}</span><span className={styles.toggle} aria-hidden="true"><Icon kind={active === index ? "minus" : "plus"}/></span>
          </button></h3>
          {active !== index && <p className={styles.summary}>{area.summary}</p>}
          <div id={`support-detail-${index}`} className={styles.detail} hidden={active !== index}>
            <p className={styles.fullTitle}>{area.title}</p>
            <p className={styles.description}>{area.description}</p>
            <ul>{area.points.map(point => <li key={point}><span aria-hidden="true"><Icon kind="sparkle"/></span>{point}</li>)}</ul>
          </div>
          <div className={styles.artwork}><div className={styles.loop}/><SupportIllustration index={index}/></div>
        </article>)}
      </div>
      <p className={styles.note}>Support is still taking shape and varies by location. Ask the team what’s available for your business today.</p>
    </div>
  </section>;
}
