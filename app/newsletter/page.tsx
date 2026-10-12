import EntryHeader from '../entry-header';
import NewsletterAction from './subscription-action';
import styles from './signup.module.css';

export const metadata = { title: 'Email updates | WisConnect', robots: { index: false, follow: false }, referrer: 'no-referrer' as const };
export default function NewsletterPage() {
  return <div className={styles.page}><EntryHeader/><main className={styles.panel}><NewsletterAction/></main></div>;
}
