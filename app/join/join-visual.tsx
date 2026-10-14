import { assetPath } from '../assets';
import styles from './page.module.css';

export default function JoinVisual() {
  return <figure className={styles.visual}>
    <img src={assetPath('account-join-conversation-640.webp')} srcSet={`${assetPath('account-join-conversation-640.webp')} 640w, ${assetPath('account-join-conversation-1200.webp')} 1200w`} sizes="(max-width: 959px) 1px, (max-width: 1280px) 40vw, 500px" width="1200" height="800" alt="Three women sharing ideas with notebooks and a laptop"/>
    <figcaption>Illustrative photography · PICHA Stock / Pexels</figcaption>
  </figure>;
}
