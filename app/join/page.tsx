"use client";

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import styles from './page.module.css';

const benefits = [
  ['Shared ownership', 'Have a voice in a cooperative built to create value with its members, not simply for them.'],
  ['Practical support', 'Connect with business knowledge, relationships and opportunities that help enterprises move forward.'],
  ['Collective reach', 'Build alongside women whose expertise, local insight and networks extend across communities and borders.']
] as const;

const expectations = [
  'Participate in the life and direction of the cooperative.',
  'Share useful knowledge, experience or connections with the network.',
  'Support opportunity that strengthens member businesses and communities.'
] as const;

function ArrowIcon(){
  return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6 14L14 6M8 6h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export default function JoinPage(){
  const [prepared,setPrepared]=useState(false);

  function prepareApplication(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    const data=new FormData(event.currentTarget);
    const name=String(data.get('name'));
    const body=[
      'WisConnect membership application',
      '',
      `Name: ${name}`,
      `Email: ${data.get('email')}`,
      `Location: ${data.get('location')}`,
      '',
      'Business or professional expertise:',
      String(data.get('expertise')),
      '',
      'What I hope to contribute:',
      String(data.get('contribution'))
    ].join('\n');

    setPrepared(true);
    window.location.href=`mailto:hello@wisconnect.co?subject=${encodeURIComponent(`Membership application — ${name}`)}&body=${encodeURIComponent(body)}`;
  }

  return <main className={styles.page}>
    <header className={styles.header}>
      <div className={styles.shell}>
        <Link className={styles.brand} href="/" aria-label="WisConnect home"><img src="../assets/logo-horizontal.webp" alt="WisConnect"/></Link>
        <Link className={styles.back} href="/">Back to WisConnect <ArrowIcon/></Link>
      </div>
    </header>

    <section className={styles.hero}>
      <div className={`${styles.shell} ${styles.heroGrid}`}>
        <div>
          <p className={styles.eyebrow}>WisConnect membership</p>
          <h1>Bring what you know.<br/>Build what we share.</h1>
          <p className={styles.lede}>WisConnect brings women entrepreneurs and professionals into a worker-owned cooperative where expertise, opportunity and community growth move together.</p>
          <a className={styles.primaryAction} href="#application">Start your application <ArrowIcon/></a>
        </div>
        <aside className={styles.heroAside}>
          <span>Who membership is for</span>
          <p>Women ready to contribute to a cooperative through enterprise, professional expertise, mentorship or community leadership.</p>
          <ul><li>Entrepreneurs and business owners</li><li>Professionals and subject-matter experts</li><li>Mentors, makers and community builders</li></ul>
        </aside>
      </div>
    </section>

    <section className={styles.benefits}>
      <div className={styles.shell}>
        <div className={styles.sectionHeading}><p className={styles.eyebrow}>Why join</p><h2>Membership turns individual strength into shared progress.</h2></div>
        <div className={styles.benefitGrid}>{benefits.map(([title,copy],index)=><article key={title}><span>0{index+1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div>
    </section>

    <section className={styles.expectations}>
      <div className={`${styles.shell} ${styles.expectationsGrid}`}>
        <div><p className={styles.eyebrow}>What membership asks</p><h2>A cooperative works when members take part.</h2></div>
        <ol>{expectations.map((item,index)=><li key={item}><span>0{index+1}</span><p>{item}</p></li>)}</ol>
      </div>
    </section>

    <section className={styles.process}>
      <div className={styles.shell}>
        <div className={styles.sectionHeading}><p className={styles.eyebrow}>What happens next</p><h2>A simple first conversation.</h2></div>
        <ol><li><span>01</span><strong>Tell us about yourself</strong><p>Share only the details needed to understand your experience and interest.</p></li><li><span>02</span><strong>WisConnect reviews your application</strong><p>The team considers how your goals and contribution align with the cooperative.</p></li><li><span>03</span><strong>Continue the conversation</strong><p>A WisConnect representative follows up with next steps after review.</p></li></ol>
      </div>
    </section>

    <section className={styles.application} id="application">
      <div className={`${styles.shell} ${styles.applicationGrid}`}>
        <div className={styles.applicationIntro}>
          <p className={styles.eyebrow}>Membership application</p>
          <h2>Start with what matters.</h2>
          <p>Complete the short application. It will open as a prepared email for you to review and send to WisConnect.</p>
          <small>This site does not save your answers. Your information is only shared when you send the prepared email.</small>
        </div>
        <form className={styles.form} onSubmit={prepareApplication}>
          <label>Full name<input name="name" type="text" autoComplete="name" maxLength={120} required/></label>
          <label>Email address<input name="email" type="email" autoComplete="email" maxLength={254} required/></label>
          <label>Location<input name="location" type="text" placeholder="City and country" maxLength={160} required/></label>
          <label>Business or professional expertise<textarea name="expertise" rows={4} maxLength={1200} required/></label>
          <label>What do you hope to contribute?<textarea name="contribution" rows={5} maxLength={1200} required/></label>
          <button type="submit">Prepare application email <ArrowIcon/></button>
          {prepared&&<p className={styles.confirmation} role="status">Your email draft is ready. Complete the last step in your email app by pressing Send; WisConnect will follow up after review.</p>}
        </form>
      </div>
    </section>

    <footer className={styles.footer}><div className={styles.shell}><p>People · Capital · Communities · A Brighter Tomorrow</p><a href="mailto:hello@wisconnect.co">hello@wisconnect.co</a></div></footer>
  </main>;
}
