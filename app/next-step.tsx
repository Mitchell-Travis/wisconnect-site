'use client';

import Icon from "./site-icon";

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { assetPath } from './assets';
import { NewsletterSignup } from './newsletter/signup';
import styles from './next-step.module.css';

const closingPhotos = [
  { position: 'northWest', source: 'involvement-conversation-640.webp' },
  { position: 'northEast', source: 'story-enterprise-640.webp' },
  { position: 'west', source: 'business-agriculture.webp' },
  { position: 'east', source: 'business-catering.webp' },
  { position: 'southWest', source: 'account-join-conversation-1200.webp' },
  { position: 'southEast', source: 'account-contact-cafe-640.webp' },
] as const;

export function NextStep() {
  const scene = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scene.current;
    const stage = root?.querySelector<HTMLElement>('[data-scene-stage]');
    const field = root?.querySelector<HTMLElement>('[data-photo-field]');
    if (!root || !stage || !field) return;

    const photos = Array.from(root.querySelectorAll<HTMLElement>('[data-scene-photo]'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const update = () => {
      frame = 0;
      const rootRect = root.getBoundingClientRect();
      const stageHeight = stage.getBoundingClientRect().height;
      const travel = Math.max(1, root.offsetHeight - stageHeight);
      const stickyTop = Number.parseFloat(window.getComputedStyle(stage).top) || 0;
      const progress = reducedMotion.matches
        ? 0
        : Math.max(0, Math.min(1, (stickyTop - rootRect.top) / travel));
      const centerX = field.clientWidth / 2;
      const centerY = field.clientHeight / 2;
      const angle = progress * 1.02;
      const cosine = Math.cos(angle);
      const sine = Math.sin(angle);

      for (const photo of photos) {
        const offsetX = photo.offsetLeft + photo.offsetWidth / 2 - centerX;
        const offsetY = photo.offsetTop + photo.offsetHeight / 2 - centerY;
        const nextX = offsetX * cosine - offsetY * sine;
        const nextY = offsetX * sine + offsetY * cosine;
        photo.style.setProperty('--scroll-x', `${(nextX - offsetX).toFixed(1)}px`);
        photo.style.setProperty('--scroll-y', `${(nextY - offsetY).toFixed(1)}px`);
      }
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    reducedMotion.addEventListener('change', scheduleUpdate);
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(root);
    observer.observe(stage);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      reducedMotion.removeEventListener('change', scheduleUpdate);
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <section id="join" data-divider="background" className={styles.section} aria-labelledby="join-title">
    <div className={styles.inner} data-content-rail>
      <div className={styles.composition}>
      <div ref={scene} className={styles.scene}>
        <div className={styles.sceneStage} data-scene-stage>
          <div className={styles.photoField} data-photo-field aria-hidden="true">
            {closingPhotos.map(photo => <div key={photo.position} className={styles.photo} data-position={photo.position} data-scene-photo>
              <img src={assetPath(photo.source)} alt="" width="640" height="427" loading="lazy"/>
            </div>)}
          </div>
          <div className={styles.statement} data-home-reveal>
            <p className={styles.eyebrow}>Your next step · Our shared future</p>
            <h2 id="join-title" data-section-headline>Bring your<br/>experience.<em>Shape what grows.</em></h2>
            <p data-section-description className={styles.lede}>Bring your business, knowledge or ideas. Start a conversation.</p>
            <Link className={styles.primary} href="/join">Introduce yourself <span aria-hidden="true"><Icon kind="external"/></span></Link>
          </div>
        </div>
      </div>
      <img className={styles.art} data-home-reveal src={assetPath('next-step-gold-ribbon.png')} width="1254" height="1254" alt="" aria-hidden="true" loading="lazy"/>
      <div className={styles.connection} data-home-reveal><NewsletterSignup tone="dark"/></div>
      </div>
      <div className={styles.otherSteps}><p>Have something in mind?</p><Link href="/contact">Explore a partnership <span aria-hidden="true"><Icon kind="external"/></span></Link><Link href="/contact">Ask a question <span aria-hidden="true"><Icon kind="external"/></span></Link></div>
    </div>
  </section>;
}
