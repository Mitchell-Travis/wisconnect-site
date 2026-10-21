"use client";

import Icon from "./site-icon";

import { useEffect, useId, useRef, useState } from 'react';
import { assetPath } from './assets';
import styles from './visionary-card.module.css';

type Visionary = { name: string; cardRole: string; image: string; summary: string; location?: string; portraitPosition?: string; portraitScale?: number };

function TurnIcon() {
  return <Icon kind="rotate"/>;
}

export function VisionaryCard({ member, onReadProfile }: { member: Visionary; onReadProfile: () => void }) {
  const [flipped, setFlipped] = useState(false);
  const previous = useRef(false);
  const front = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (previous.current === flipped) return;
    previous.current = flipped;
    (flipped ? close : front).current?.focus({ preventScroll: true });
  }, [flipped]);

  return <article className={styles.card} data-flipped={flipped} onKeyDown={event => {
    if (event.key === 'Escape' && flipped) { event.preventDefault(); setFlipped(false); }
  }}>
    <button ref={front} className={styles.front} type="button" inert={flipped} aria-hidden={flipped} aria-expanded={flipped} aria-controls={id} aria-label={`View profile for ${member.name}`} onClick={() => setFlipped(true)}>
      <span className={styles.portrait}>
        <img style={{objectPosition: member.portraitPosition, transform: member.portraitScale ? `scale(${member.portraitScale})` : undefined, transformOrigin: member.portraitScale ? "center 25%" : undefined}} src={assetPath(`${member.image}-studio-480.webp`)} srcSet={`${assetPath(`${member.image}-studio-320.webp`)} 320w, ${assetPath(`${member.image}-studio-480.webp`)} 480w, ${assetPath(`${member.image}-studio-800.webp`)} 800w`} sizes="(max-width: 760px) 45vw, (max-width: 1100px) 30vw, 285px" alt="" width="800" height="800" loading="lazy" decoding="async"/>
      </span>
      <span className={styles.info}><strong>{member.name}</strong><span className={styles.role}>{member.cardRole}</span>{member.location && <span className={styles.location}>{member.location}</span>}<span className={styles.view}>View profile <Icon kind="external" size={13}/></span></span>
    </button>
    <div id={id} className={styles.back} inert={!flipped} aria-hidden={!flipped}>
      <button ref={close} type="button" className={styles.close} aria-label={`Close bio for ${member.name}`} onClick={() => setFlipped(false)}>Close <TurnIcon/></button>
      <h3>{member.name}</h3>
      <p className={styles.bio}>{member.summary}</p>
      <button type="button" className={styles.fullProfile} data-dialog-control onClick={event => { event.currentTarget.focus({ preventScroll: true }); onReadProfile(); }} aria-haspopup="dialog">Read full profile <span aria-hidden="true"><Icon kind="external"/></span></button>
    </div>
  </article>;
}
