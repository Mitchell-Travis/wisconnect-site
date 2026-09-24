import Link from 'next/link';
import { assetPath } from './assets';
import styles from './entry-header.module.css';

export default function EntryHeader() {
  return <header className={styles.header}>
    <div className={styles.inner}>
      <Link className={styles.brand} href="/" aria-label="WisConnect home">
        <img src={assetPath('logo-nav.webp')} alt="WisConnect" width="480" height="160"/>
      </Link>
      <Link className={styles.backLink} href="/">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M16 10H4m5-5-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span>Back to website</span>
      </Link>
    </div>
  </header>;
}
