
import { AccountHeader, AccountFooter } from '../account-chrome';
import styles from './page.module.css';
import ContactForm from './contact-form';
import BackgroundGlow from '../background-glow';

export const metadata = { title: 'Contact | WisConnect' };

export default function ContactPage() {
  return <div className={styles.page}>
    <AccountHeader skipTarget="contact-title" skipLabel="Skip to contact"/>
    <main className={styles.main} aria-labelledby="contact-title">
      <BackgroundGlow/>
      <ContactForm/>
    </main>
    <AccountFooter showInvitationNote={false}/>
  </div>;
}
