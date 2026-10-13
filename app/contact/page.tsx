
import Icon from "../site-icon";
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
        <a className={styles.directContact} href="mailto:hello@wisconnect.co">hello@wisconnect.co <Icon kind="external" size={16}/></a>
        <figure className={styles.photo}>
          <img src={assetPath('contact-conversation-640.webp')} srcSet={`${assetPath('contact-conversation-640.webp')} 640w, ${assetPath('contact-conversation-1000.webp')} 1000w`} sizes="(max-width: 800px) 1px, (max-width: 1280px) 36vw, 460px" width="1000" height="1200" alt="A woman smiling while speaking on the phone"/>
          <figcaption>Illustrative photography · Wundef Media / Pexels</figcaption>
        </figure>
        <Link className={styles.membershipLink} href="/join"><span><small>Ready to take the next step?</small><strong>Explore membership</strong></span><Icon kind="external" size={16}/></Link>
      </div>
      <ContactForm/>
    </main>
  </div>;
}
