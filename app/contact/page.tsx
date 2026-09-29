import EntryHeader from '../entry-header';
import styles from './page.module.css';
import ContactForm from './contact-form';
import Link from 'next/link';
import { assetPath } from '../assets';

export const metadata = { title: 'Contact | WisConnect' };

export default function ContactPage() {
  return <div className={styles.page}>
    <EntryHeader/>
    <main className={styles.main} aria-label="Contact WisConnect">
      <div className={styles.intro}>
        <p className={styles.eyebrow}>Get in touch</p>
        <h1 id="contact-title">Let’s start a conversation.</h1>
        <p className={styles.lede}>A question, an idea, or an opportunity to work together. We’d love to hear what you have in mind.</p>
        <a className={styles.directContact} href="mailto:hello@wisconnect.co">hello@wisconnect.co <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 12 8-8M4 4h8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>
        <figure className={styles.photo}>
          <img src={assetPath('purpose-connection-640.webp')} srcSet={`${assetPath('purpose-connection-640.webp')} 640w, ${assetPath('purpose-connection-1400.webp')} 1400w`} sizes="(max-width: 800px) 1px, (max-width: 1280px) 36vw, 460px" width="1400" height="933" alt="Three women sharing ideas around a laptop"/>
          <figcaption>Illustrative community photography · PICHA Stock</figcaption>
        </figure>
        <Link className={styles.membershipLink} href="/join"><span><small>Ready to take the next step?</small><strong>Explore membership</strong></span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 12 8-8M4 4h8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
      </div>
      <ContactForm/>
    </main>
  </div>;
}
