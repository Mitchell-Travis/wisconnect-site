import Link from 'next/link';
import { assetPath } from '../assets';
import styles from './page.module.css';

export const metadata = {
  title: 'Explore | WisConnect',
  description: 'Detailed Phase 1 information about WisConnect people, businesses, programs, resources, updates and participation.'
};

const memberProfiles = [
  {name:'Chipo Nyambuya, Esq',role:'International Legal, Governance, and Economic Development Leader',summary:'International law, governance and economic development.'},
  {name:'Elizabeth L. Carter',role:'Business and Corporate Securities Attorney, Legal & Business',summary:'Business law, corporate securities and enterprise foundations.'},
  {name:'Priscilla Cadette',role:'Entrepreneur, mentor and fundraising specialist',summary:'Entrepreneurship, mentorship and fundraising.'},
  {name:'Ade Wede Wee-Wee Kekuleh',role:'Advocate, legal professional and chartered accountant',summary:'Gender, human rights, peacebuilding, law and accounting.'},
] as const;

const programIdeas = [
  {title:'Webinars',body:'Proposed conversations around business growth, ownership, markets and practical operating knowledge.'},
  {title:'Tutorials',body:'Proposed practical learning sessions members can apply directly to their businesses.'},
  {title:'Coffee meetings',body:'Proposed recurring conversations designed to build relationships and peer exchange.'},
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
      <p>Phase 1 includes more than the homepage. This area keeps the detailed institutional content accessible without interrupting the main WisConnect narrative.</p>
      <nav className={styles.jumpNav} aria-label="Explore sections">
        <a href="#about">About</a><a href="#members">Members</a><a href="#businesses">Businesses</a><a href="#programs">Programs</a><a href="#resources">Resources</a><a href="#community">Community</a><a href="#updates">Updates</a><a href="#faq">FAQs</a>
      </nav>
    </div></section>

    <section id="about" className={styles.section}><div className={styles.rail}>
      <div className={styles.sectionHeading}><p className={styles.eyebrow}>About WisConnect</p><h2>Purpose, identity and the cooperative idea.</h2></div>
      <div className={styles.twoCol}>
        <article><span>Purpose</span><h3>Build opportunity together.</h3><p>WisConnect is being shaped as a cooperative business-development and resource network centered on Black women entrepreneurs, shared ownership and stronger communities.</p></article>
        <article><span>Status</span><h3>Some public language is still awaiting approval.</h3><p>The official legal/public name, organizational history, mission, vision, values and some cooperative claims still need final client confirmation before they are treated as approved copy.</p></article>
      </div>
    </div></section>

    <section id="members" className={styles.section}><div className={styles.rail}>
      <div className={styles.sectionHeading}><p className={styles.eyebrow}>Member directory</p><h2>People, expertise and contribution.</h2><p>The current public profiles remain limited to people already represented in the approved site direction. Additional profiles should be published only after consent and final wording approval.</p></div>
      <div className={styles.profileGrid}>{memberProfiles.map(profile=><article key={profile.name}><h3>{profile.name}</h3><strong>{profile.role}</strong><p>{profile.summary}</p></article>)}</div>
      <p className={styles.note}>New bios and portraits for Nikki Bravo, Tiffany Williams and Elizabeth L. Carter have been received, but publication should wait for confirmed authorization and final public wording.</p>
    </div></section>

    <section id="businesses" className={styles.section}><div className={styles.rail}>
      <div className={styles.sectionHeading}><p className={styles.eyebrow}>Business directory</p><h2>Member-owned businesses will live here.</h2><p>The homepage shows enterprise sectors. This directory will hold real businesses once WisConnect approves the business and owner name, sector, description, image or logo, and contact link.</p></div>
      <div className={styles.emptyState}><strong>Listings awaiting approval.</strong><p>No business listings are published yet. This directory is not a marketplace and does not provide checkout in Phase 1.</p><Link href="/contact">Ask about a future listing →</Link></div>
    </div></section>

    <section id="programs" className={styles.section}><div className={styles.rail}>
      <div className={styles.sectionHeading}><p className={styles.eyebrow}>Programs & activities</p><h2>Support should lead to outcomes.</h2><p>The homepage organizes value around Grow, Connect, Access and Own. These are the proposed activities that may support those outcomes.</p></div>
      <div className={styles.cardGrid}>{programIdeas.map(program=><article key={program.title}><span>Proposed</span><h3>{program.title}</h3><p>{program.body}</p></article>)}</div>
      <p className={styles.note}>Topics, presenters, frequency, format and dates are not yet confirmed. No registration should be advertised until WisConnect approves a real event or recurring program.</p>
    </div></section>

    <section id="resources" className={styles.section}><div className={styles.rail}>
      <div className={styles.sectionHeading}><p className={styles.eyebrow}>Resources & videos</p><h2>Knowledge that members can use.</h2><p>Guides, videos and learning materials belong here once the team approves the content, credits, links, captions and transcripts.</p></div>
      <div className={styles.twoCol}>
        <div className={styles.emptyState}><strong>Resource library awaiting content.</strong><p>Approved guides, templates and learning materials will be added here.</p></div>
        <div className={styles.emptyState}><strong>Video library awaiting content.</strong><p>Approved videos will include clear credits and accessibility information.</p></div>
      </div>
    </div></section>

    <section id="community" className={styles.section}><div className={styles.rail}>
      <div className={styles.sectionHeading}><p className={styles.eyebrow}>Community contributions</p><h2>What members bring matters.</h2><p>WisConnect wants to document the talents, assets, motivations and contributions members bring into the cooperative — not just what they receive from it.</p></div>
      <div className={styles.emptyState}><strong>Community initiatives awaiting approval.</strong><p>Verified initiatives, contributors, outcomes and approved media will be added as they are supplied.</p><Link href="/join">Tell WisConnect what you would like to contribute →</Link></div>
    </div></section>

    <section id="updates" className={styles.section}><div className={styles.rail}>
      <div className={styles.sectionHeading}><p className={styles.eyebrow}>News, events & gallery</p><h2>Publish only what is real.</h2><p>Phase 1 includes space for ongoing updates, confirmed gatherings and approved photography, but empty sections do not need to dominate the homepage.</p></div>
      <div className={styles.cardGrid}>
        <article><span>News</span><h3>No approved updates yet.</h3><p>Dated announcements will appear when WisConnect confirms content and an approver.</p></article>
        <article><span>Events</span><h3>No confirmed events yet.</h3><p>Future events will include date, timezone, location or online link, host and RSVP route.</p></article>
        <article><span>Gallery</span><h3>Approved photography pending.</h3><p>Member, event, program and community images will be published with captions, credits and consent.</p></article>
      </div>
    </div></section>

    <section id="faq" className={styles.info}><div className={styles.rail}>
      <p className={styles.eyebrow}>Frequently asked questions</p>
      <h2>Practical information.</h2>
      <details><summary>Can I join WisConnect?</summary><p>Yes. Use the membership-interest flow to introduce yourself, your location, your experience and what you would like to contribute. Submission does not automatically grant membership.</p></details>
      <details><summary>Can I list my business?</summary><p>Business listings are being prepared. Contact WisConnect if you want to discuss a future listing or provide approved business information.</p></details>
      <details><summary>Does WisConnect offer online payments or marketplace checkout?</summary><p>No. Those capabilities are not part of the current Phase 1 public website. A business directory is not a marketplace.</p></details>
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
