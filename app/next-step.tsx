'use client';

import Link from 'next/link';
import { assetPath } from './assets';
import { NewsletterSignup } from './newsletter/signup';
import styles from './next-step.module.css';

export function NextStep() {
  return <section id="join" data-divider="background" className={styles.section} aria-labelledby="join-title">
    <div className={styles.inner}>
      <div className={styles.composition}>
      <div className={styles.statement}>
        <p className={styles.eyebrow}>Your next step · Our shared future</p>
        <h2 id="join-title">Bring your<br/>experience.<em>Shape what grows.</em></h2>
        <p className={styles.lede}>A business to grow. Knowledge to share.<br/>{' '}A community you care about. Start here.</p>
        <Link className={styles.primary} href="/join">Introduce yourself <span aria-hidden="true">↗</span></Link>
      </div>
      <img className={styles.art} src={assetPath('next-step-gold-ribbon.png')} width="1254" height="1254" alt="" aria-hidden="true" loading="lazy"/>
      <div className={styles.connection}><NewsletterSignup/></div>
      </div>
      <div className={styles.otherSteps}><p>Have something in mind?</p><Link href="/contact">Explore a partnership <span aria-hidden="true">↗</span></Link><Link href="/contact">Ask a question <span aria-hidden="true">↗</span></Link></div>
    </div>
  </section>;
}
