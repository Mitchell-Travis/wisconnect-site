import { assetPath } from '../assets';
import styles from './page.module.css';

export default function JoinVisual() {
  return <figure className={styles.visual}>
    <img src={assetPath('purpose-community-640.webp')} srcSet={`${assetPath('purpose-community-640.webp')} 640w, ${assetPath('purpose-community-1400.webp')} 1400w`} sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1280px) 48vw, 600px" width="640" height="427" alt="Four Black women sharing a conversation around a coffee table" fetchPriority="high"/>
  </figure>;
}
