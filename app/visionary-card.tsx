"use client";

import { useEffect, useId, useRef, useState } from 'react';
import { assetPath } from './assets';
import styles from './visionary-card.module.css';

type Visionary = { name: string; cardRole: string; role: string; image: string; bio: string };

function TurnIcon() {
  return <svg viewBox="0 0 24 16" fill="none" aria-hidden="true"><path d="M15 11c4-.5 7-2 7-4 0-2.8-4.5-5-10-5S2 4.2 2 7s4.5 5 10 5m-3-3 3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export function VisionaryCard({ member, onReadProfile }: { member: Visionary; onReadProfile: () => void }) {
  const [flipped, setFlipped] = useState(false);
  const previous = useRef(false);
  const front = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (previous.current === flipped) return;
    previous.current = flipped;
    if (flipped && body.current) body.current.scrollTop = 0;
    (flipped ? close : front).current?.focus({ preventScroll: true });
  }, [flipped]);

  return <article className={styles.card} data-flipped={flipped} onKeyDown={event => {
    if (event.key === 'Escape' && flipped) { event.preventDefault(); setFlipped(false); }
  }}>
    <button ref={front} className={styles.front} type="button" inert={flipped} aria-hidden={flipped} aria-expanded={flipped} aria-controls={id} aria-label={`View bio for ${member.name}`} onClick={() => setFlipped(true)}>
      <span className={styles.portrait}>
        <img src={assetPath(`${member.image}-studio-480.webp`)} srcSet={`${assetPath(`${member.image}-studio-480.webp`)} 480w, ${assetPath(`${member.image}-studio-800.webp`)} 800w`} sizes="(max-width: 760px) 45vw, (max-width: 1100px) 30vw, 285px" alt="" width="800" height="800" loading="lazy" decoding="async"/>
        <span className={styles.view}>View bio <TurnIcon/></span>
      </span>
      <span className={styles.info}><strong>{member.name}</strong><span className={styles.role}>{member.cardRole}</span></span>
    </button>
    <div id={id} className={styles.back} inert={!flipped} aria-hidden={!flipped}>
      <button ref={close} type="button" className={styles.close} aria-label={`Close bio for ${member.name}`} onClick={() => setFlipped(false)}>Close <TurnIcon/></button>
      <h3>{member.name}</h3>
      <div ref={body} className={styles.bio} tabIndex={flipped ? 0 : -1} role="region" aria-label={`${member.name} biography`}>
        <p className={styles.bioRole}>{member.role}</p>
        {member.bio.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
      <button type="button" className={styles.fullProfile} data-dialog-control onClick={event => { event.currentTarget.focus({ preventScroll: true }); onReadProfile(); }} aria-haspopup="dialog">Read full profile <span aria-hidden="true">↗</span></button>
    </div>
  </article>;
}
