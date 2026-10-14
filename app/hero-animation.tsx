"use client";

import { useEffect, useRef, useState } from 'react';
import { assetPath } from './assets';
import Icon from './site-icon';
import styles from './page.module.css';

export function HeroAnimation() {
  const container = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  // Render the still first, including before hydration and with reduced motion.
  const [reducedMotion, setReducedMotion] = useState(true);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const enabled = !reducedMotion && !failed;

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const player = video.current;
    const element = container.current;
    if (!enabled || !player || !element) return;
    let visible = false;
    let active = true;
    const syncPlayback = () => {
      if (paused || !visible || document.hidden) {
        player.pause();
        return;
      }
      void player.play().catch((error: unknown) => {
        // A pause during loading can abort play without indicating a failure.
        if (active && error instanceof DOMException && error.name === 'NotAllowedError') {
          setPaused(true);
        }
      });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0 });
    observer.observe(element);
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      active = false;
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      player.pause();
    };
  }, [enabled, paused]);

  return <div ref={container} className={styles.heroArt} data-video-ready={enabled && ready}>
    <img
      className={styles.heroPortrait}
      src={assetPath('hero-shared-enterprise-960.webp')}
      width="1122" height="1402" fetchPriority="high"
      alt="Illustration of three Black women entrepreneurs sharing ideas, a laptop and textile samples around a table"
    />
    {enabled && <>
      <video
        ref={video}
        className={`${styles.heroPortrait} ${styles.heroVideo}`}
        src={assetPath('hero-shared-enterprise-exchange.mp4')}
        poster={assetPath('hero-shared-enterprise-960.webp')}
        width="1122" height="1402" muted playsInline preload="none"
        aria-hidden="true" tabIndex={-1}
        onPlaying={() => setReady(true)}
        onEnded={() => setPaused(true)}
        onError={() => { setFailed(true); setReady(false); }}
      />
      <button
        type="button" className={styles.heroPlayback}
        aria-label={paused ? 'Resume hero animation' : 'Pause hero animation'}
        title={paused ? 'Resume animation' : 'Pause animation'}
        onClick={() => setPaused(value => !value)}
      ><Icon kind={paused ? 'play' : 'pause'} size={17}/></button>
    </>}
  </div>;
}
