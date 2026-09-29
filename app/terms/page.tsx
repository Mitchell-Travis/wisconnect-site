import Link from 'next/link';
import EntryHeader from '../entry-header';
import styles from './page.module.css';

export const metadata = {
  title: 'Terms & Conditions | WisConnect',
  description: 'Current terms and form-handling information for WisConnect website visitors.'
};

export default function TermsPage(){
  return <main className={styles.page}>
    <EntryHeader/>
    <section className={styles.hero}>
      <div className={styles.rail}>
        <p className={styles.eyebrow}>Terms & Conditions</p>
        <h1>Website use and form information.</h1>
        <p>This page explains how the current WisConnect website and its Contact and Join forms work today. It is not a substitute for the final legal terms or privacy policy that WisConnect may adopt later.</p>
      </div>
    </section>

    <section className={styles.section}>
      <div className={styles.rail}>
        <h2>Contact and membership forms</h2>
        <p>Where online submissions are enabled, pressing Submit on the Contact form saves your inquiry in the WisConnect database for administrators to review. The service also attempts an email notification to hello@wisconnect.co. A saved inquiry remains available in the dashboard if the email notification fails.</p>
        <p>The current local preview uses a test inbox unless real email delivery is configured. The hosted website does not yet accept online submissions and provides a direct email alternative.</p>
        <p>The Join form still prepares an email draft. It keeps your answers in the current tab and does not save an application to the website database. Nothing is sent from Join until you send the draft through your email app.</p>
      </div>
    </section>

    <section className={styles.section}>
      <div className={styles.rail}>
        <h2>Information you may provide</h2>
        <p>The Contact form asks for your name, email, topic and message. Submitted inquiries also have a reference, submission time and email-notification status. The Join form may ask for your name, email, location, business or professional experience, and the contribution you would like to make.</p>
        <p>Please provide only the information needed for your inquiry or membership interest.</p>
      </div>
    </section>

    <section className={styles.section}>
      <div className={styles.rail}>
        <h2>Privacy and data handling</h2>
        <p>WisConnect still needs to finalize its approved privacy policy, responsible organization or privacy contact, data-retention rules, access rules, and the process for requesting corrections or deletion.</p>
        <p>Until those items are formally approved, this page describes only the current behavior of the website forms.</p>
      </div>
    </section>

    <section className={styles.section}>
      <div className={styles.rail}>
        <h2>Website content</h2>
        <p>Some website content is still being reviewed or awaiting approval. Program details, impact figures, business listings, geographic claims, biographies, photographs and other public information should be treated as current project content rather than final legal or operational commitments unless WisConnect confirms otherwise.</p>
      </div>
    </section>

    <section className={styles.section}>
      <div className={styles.rail}>
        <h2>Questions</h2>
        <p>If you have a question about these terms or how the forms work, contact WisConnect directly.</p>
        <Link className={styles.action} href="/contact">Contact WisConnect</Link>
      </div>
    </section>
  </main>;
}
