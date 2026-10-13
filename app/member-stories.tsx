'use client';

import { useEffect, useRef, useState } from 'react';
import { assetPath } from './assets';
import Icon from './site-icon';
import styles from './member-stories.module.css';

const people = [
  { name: 'Nikki Bravo', display: 'Nikki Bravo', image: 'nikki', business: 'Momentum Coffee', businessId: 'momentum' },
  { name: 'Tiffany “Chef Mama” Williams', display: 'Tiffany Williams', image: 'tiffany', business: 'Exquisite Kitchen', businessId: 'exquisite-kitchen' },
  { name: 'Kailyn Harrington', display: 'Kailyn Harrington', image: 'kailyn', business: 'Bunnyland', businessId: 'bunnyland' },
  { name: 'Brandi Davis-Fitch', display: 'Brandi Davis-Fitch', image: 'brandi', business: 'BDavis Designs', businessId: 'bdavis' },
  { name: 'Chipo Nyambuya', display: 'Chipo Nyambuya', image: 'chipo', business: 'CZL P.C.', businessId: 'czl' },
  { name: 'Ade Wede Wee-Wee Kekuleh', display: 'Ade Wede Kekuleh', image: 'ade-wede', business: 'ZE’AD Advisors', businessId: 'zead' },
];
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ramp = (n: number, start: number, end: number) => clamp((n - start) / (end - start));

export function MemberStories({ onBusiness }: { onBusiness: (id: string, trigger: HTMLButtonElement) => void }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [portraitStep, setPortraitStep] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const root = section.current;
    const frame = stage.current;
    if (!root || !frame || paused) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let lastScroll = 0;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: .35 });
    observer.observe(frame);
    const scrolling = () => { lastScroll = performance.now(); };
    window.addEventListener('scroll', scrolling, { passive: true });
    const timer = window.setInterval(() => {
      if (!visible || document.hidden || reduced.matches || performance.now() - lastScroll < 1400) return;
      if (root.contains(document.activeElement) || root.querySelector('[data-portrait]:hover') || document.querySelector('dialog[open]')) return;
      setPortraitStep(step => step + 1);
    }, 6000);
    return () => { clearInterval(timer); observer.disconnect(); window.removeEventListener('scroll', scrolling); };
  }, [paused]);

  useEffect(() => {
    const root = section.current;
    const frame = stage.current;
    if (!root || !frame) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-portrait]'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const short = window.matchMedia('(max-height: 560px)');
    let enabled = false;
    let request = 0;
    let focused = false;
    let top = 0, height = 0, distance = 1, x = 0, y = 0;

    const draw = () => {
      request = 0;
      if (!enabled) return;
      const rect = root.getBoundingClientRect();
      if (!focused && (rect.bottom < 0 || rect.top > window.innerHeight)) return;
      const progress = focused ? 1 : clamp((top - rect.top) / distance);
      const spread = ramp(progress, .02, .76);
      root.style.setProperty('--reveal-opacity', String(ramp(progress, .42, .7)));
      root.style.setProperty('--portrait-label-opacity', String(ramp(progress, .64, .8)));
      root.style.setProperty('--hint-opacity', String(1 - ramp(progress, .08, .24)));
      root.dataset.revealed = progress >= .7 ? 'true' : 'false';
      cards.forEach((card, index) => {
        const scale = 1 + ([.94, 1, .97, .92][index] - 1) * spread;
        card.style.transform = `translate(-50%, -50%) translate(${(index % 2 ? 1 : -1) * x * spread}px, ${(index < 2 ? -1 : 1) * y * spread}px) scale(${scale})`;
      });
    };
    const schedule = () => { if (enabled && !request) request = requestAnimationFrame(draw); };
    const measure = () => {
      top = parseFloat(getComputedStyle(frame).top) || 0;
      height = frame.clientHeight;
      distance = Math.max(1, root.offsetHeight - height);
      const rail = frame.querySelector<HTMLElement>('[data-portrait-rail]')!;
      const cardWidth = cards[0].offsetWidth;
      x = Math.max(0, (rail.clientWidth - cardWidth) / 2);
      y = Math.max(0, Math.min(height * .3, (height - cardWidth) / 2 - 24));
      draw();
    };
    const configure = () => {
      enabled = !reduced.matches && !short.matches;
      root.dataset.motion = enabled ? 'on' : 'off';
      if (enabled) measure();
      else {
        cancelAnimationFrame(request); request = 0;
        cards.forEach(card => card.style.removeProperty('transform'));
      }
    };
    const focusIn = (event: FocusEvent) => { focused = event.target instanceof HTMLElement && event.target.matches(':focus-visible'); draw(); };
    const focusOut = (event: FocusEvent) => {
      if (event.relatedTarget instanceof Node && root.contains(event.relatedTarget)) return;
      focused = false; schedule();
    };
    configure();
    const resize = new ResizeObserver(measure);
    resize.observe(frame);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    reduced.addEventListener('change', configure);
    short.addEventListener('change', configure);
    root.addEventListener('focusin', focusIn);
    root.addEventListener('focusout', focusOut);
    return () => {
      cancelAnimationFrame(request); resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      reduced.removeEventListener('change', configure);
      short.removeEventListener('change', configure);
      root.removeEventListener('focusin', focusIn);
      root.removeEventListener('focusout', focusOut);
    };
  }, []);

  return <section ref={section} id="member-stories" className={styles.section} aria-labelledby="member-stories-title">
    <div ref={stage} className={styles.stage}>
      <div className={styles.glow} aria-hidden="true"/>
      <img className={styles.threads} src={assetPath('member-stories-threads.png')} alt="" aria-hidden="true" width="1920" height="1080" loading="lazy" decoding="async"/>
      <div className={styles.rail} data-portrait-rail>
        <div className={styles.heading}>
          <p className="eyebrow">People behind the businesses</p>
          <h2 id="member-stories-title" data-section-headline>Experience worth<br/><em>sharing.</em></h2>
          <p className={styles.description} data-section-description>Meet the people in our cooperative.<br/>Select a portrait to discover their business.</p>
        </div>
        <div className={styles.portraits}>
          {[0, 1, 2, 3].map(slot => {
            const person = people[(slot + portraitStep) % people.length];
            const previous = people[(slot + Math.max(0, portraitStep - 1)) % people.length];
            return <button key={slot} data-portrait data-dialog-control className={styles.portrait} type="button" aria-label={`Explore ${person.business} — ${person.name}`} aria-haspopup="dialog" onClick={event => { event.currentTarget.focus({ preventScroll: true }); onBusiness(person.businessId, event.currentTarget); }}>
              {portraitStep > 0 && <span className={styles.portraitLayer} aria-hidden="true">
                <img src={assetPath(`${previous.image}-studio-480.webp`)} alt="" width="480" height="480" decoding="async"/>
                <span className={styles.caption}><strong>{previous.display}</strong><span>{previous.business}</span><Icon kind="external" size={14}/></span>
              </span>}
              <span key={portraitStep} className={`${styles.portraitLayer} ${portraitStep > 0 ? styles.portraitEnter : ''}`}>
                <img src={assetPath(`${person.image}-studio-480.webp`)} alt={`Portrait of ${person.name}`} width="480" height="480" loading="lazy" decoding="async"/>
                <span className={styles.caption}><strong>{person.display}</strong><span>{person.business}</span><Icon kind="external" size={14}/></span>
              </span>
            </button>;
          })}
        </div>
      </div>
      <p className={styles.hint}>Scroll to meet the people <Icon kind="arrowDown" size={16}/></p>
      <button className={styles.rotationToggle} type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}><Icon kind={paused ? 'play' : 'pause'} size={12}/>{paused ? 'Resume portraits' : 'Pause portraits'}</button>
    </div>
  </section>;
}
