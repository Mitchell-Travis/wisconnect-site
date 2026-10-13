
import Icon from "./site-icon";
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
        <Icon kind="arrowLeft"/>
        <span>Back to website</span>
      </Link>
    </div>
  </header>;
}
