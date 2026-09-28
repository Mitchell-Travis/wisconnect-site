import Link from 'next/link';
import { assetPath } from '../assets';
import styles from './page.module.css';

export const metadata = {
  title: 'Explore | WisConnect',
  description: 'Programs, directories, resources, updates and practical information from WisConnect.'
};

const groups = [
  {title:'People & businesses',body:'The homepage introduces the women and enterprise areas shaping WisConnect. Complete member and business directories will expand as profiles, publication permissions and listings are approved.',items:['Member directory','Business directory']},
  {title:'Programs & resources',body:'Webinars, tutorials, learning materials and recurring activities are being shaped around the outcomes WisConnect wants to create: stronger businesses, wider opportunity and shared ownership.',items:['Programs & activities','Resources & videos','Community work']},
  {title:'Updates & gatherings',body:'News, confirmed events and approved community photography will live here when there is something real to publish — not as empty homepage sections.',items:['News & announcements','Events','Gallery']},
] as const;

export default function ExplorePage(){
  return <main className={styles.page}>
    <header className={styles.header}><div className={styles.headerInner}>
      <Link className={styles.brand} href="/" aria-label="WisConnect home"><img src={assetPath('logo-nav.webp')} alt="WisConnect" width="480" height="160"/></Link>
      <div className={styles.headerActions}><Link href="/">Back to homepage</Link><Link className={styles.join} href="/join">Join WisConnect</Link></div>
    </div></header>

    <section className={styles.hero}><div className={styles.rail}>
      <p className={styles.eyebrow}>Explore WisConnect</p>
      <h1>The homepage tells the story.<br/><em>This is where you go deeper.</em></h1>
      <p>Programs, directories, updates and practical information belong here so they can grow without competing with the main WisConnect story.</p>
    </div></section>

    <section className={styles.groups}><div className={styles.rail}>
      {groups.map((group,index)=><article key={group.title}>
        <span>0{index+1}</span><div><h2>{group.title}</h2><p>{group.body}</p><ul>{group.items.map(item=><li key={item}>{item}<small>Content will be published as it is approved.</small></li>)}</ul></div>
      </article>)}
    </div></section>

    <section id="faq" className={styles.info}><div className={styles.rail}>
      <p className={styles.eyebrow}>Frequently asked questions</p>
      <h2>What can I do today?</h2>
      <details><summary>Can I join WisConnect?</summary><p>Yes. Use the membership-interest flow to introduce yourself, your location, your experience and what you would like to contribute. Submitting interest does not automatically grant membership.</p></details>
      <details><summary>Can I list my business?</summary><p>Business listings are being prepared. Contact WisConnect if you want to discuss a future listing or provide approved business information.</p></details>
      <details id="languages"><summary>Is the website available in French?</summary><p>English is available now. French content is awaiting translation, review and an agreed launch date.</p><p lang="fr">La version française est en préparation. La date de publication reste à confirmer.</p></details>
    </div></section>

    <section id="privacy" className={styles.info}><div className={styles.rail}>
      <p className={styles.eyebrow}>Privacy & form information</p>
      <h2>Before you share your details.</h2>
      <p>The current Contact and Join flows prepare an email draft in your browser. They do not save a submission to a website database. You decide whether to send the message in your email app.</p>
      <p>WisConnect's final privacy policy, retention rules and responsible privacy contact are still awaiting approval. Until then, share only the information needed for your inquiry.</p>
      <div className={styles.actions}><Link className={styles.join} href="/join">Join WisConnect</Link><Link href="/contact">Contact WisConnect</Link></div>
    </div></section>

    <footer className={styles.footer}><div className={styles.rail}><img src={assetPath('logo-horizontal.webp')} alt="WisConnect"/><p>People · Capital · Communities · A Brighter Tomorrow</p></div></footer>
  </main>;
}
