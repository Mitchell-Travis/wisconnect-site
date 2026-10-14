'use client';

import { Fragment, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import styles from './section-entrance.module.css';

// Enhance readable server-rendered content only when it enters the viewport.
// Each paragraph/step owns its trigger, so mobile content never plays offscreen.
function useEntrance<T extends HTMLElement>(kind: 'words' | 'steps') {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !('IntersectionObserver' in window)) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;
    const targets = kind === 'words' ? [root] : Array.from(root.children) as HTMLElement[];
    const observer = new IntersectionObserver(entries => {
      const arriving = entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => targets.indexOf(a.target as HTMLElement) - targets.indexOf(b.target as HTMLElement));
      arriving.forEach((entry, index) => {
        const element = entry.target as HTMLElement;
        if (kind === 'steps') element.style.setProperty('--entrance-delay', `${index * 110}ms`);
        element.dataset.entrance = 'visible';
        observer.unobserve(element);
      });
    }, { threshold: .2, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(target => {
      if (!target.dataset.entrance) observer.observe(target);
    });
    const stopMotion = () => {
      if (!preference.matches) return;
      observer.disconnect();
      targets.forEach(target => { target.dataset.entrance = 'static'; });
    };
    preference.addEventListener('change', stopMotion);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', stopMotion);
    };
  }, [kind]);

  return ref;
}

export function WordReveal({ children }: { children: string }) {
  const ref = useEntrance<HTMLSpanElement>('words');
  const words = children.split(' ');
  // Keep longer copy under 1.2 seconds; expose one uninterrupted reading to AT.
  const stagger = Math.min(30, 650 / Math.max(words.length - 1, 1));
  return <><span className={styles.readableText}>{children}</span><span ref={ref} className={styles.words} aria-hidden="true">
    {words.map((word, index) => <Fragment key={index}>
      {index > 0 && ' '}<span className={styles.word} style={{ '--entrance-delay': `${index * stagger}ms` } as CSSProperties}>{word}</span>
    </Fragment>)}
  </span></>;
}

export function ParticipationSteps({ children, className }: { children: ReactNode; className: string }) {
  const ref = useEntrance<HTMLOListElement>('steps');
  return <ol ref={ref} className={`${className} ${styles.steps}`} role="list">{children}</ol>;
}
