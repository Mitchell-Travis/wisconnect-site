import styles from './background-glow.module.css';

export default function BackgroundGlow() {
  return <div className={styles.glow} aria-hidden="true">
    <div className={styles.layers}><span/><span/></div>
  </div>;
}
