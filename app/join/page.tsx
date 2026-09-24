"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import EntryHeader from '../entry-header';
import styles from './page.module.css';

const steps=['Welcome','About you','Your contribution','Review'];
const titles=['A place for what you bring.','First, a little about you.','Your experience matters.','Make sure it feels like you.'];
const descriptions=[
  'Bring your experience into a community built on shared ownership. Let’s start with a simple introduction.',
  'Let us know who you are, where you’re based, and how to reach you.',
  'You don’t need a perfect pitch. Tell us what you do and what you’d like to share.',
  'Take a moment to check your details. You can edit anything before preparing your email.'
];
const benefits=[
  ['Shared ownership','Have a voice in what we build together.'],
  ['Practical support','Connect with knowledge, relationships and opportunity.'],
  ['Collective reach','Grow alongside women across communities and borders.']
];
const emptyAnswers={name:'',email:'',location:'',expertise:'',contribution:''};

function ArrowIcon(){
  return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export default function JoinPage(){
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState(emptyAnswers);
  const [editing,setEditing]=useState(false);
  const [prepared,setPrepared]=useState(false);
  const [copyStatus,setCopyStatus]=useState('');
  const heading=useRef<HTMLHeadingElement>(null);
  const moveFocus=useRef(false);

  useEffect(()=>{
    if(!moveFocus.current)return;
    heading.current?.focus({preventScroll:true});
    window.scrollTo({top:0,behavior:'instant'});
  },[step]);

  function goToStep(next:number,edit=false){
    moveFocus.current=true;
    setEditing(edit);
    setPrepared(false);
    setCopyStatus('');
    setStep(next);
  }

  function updateAnswer(event:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>){
    event.currentTarget.setCustomValidity('');
    const {name,value}=event.currentTarget;
    setAnswers(previous=>({...previous,[name]:value}));
  }

  function continueApplication(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    const form=event.currentTarget;
    for(const field of form.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>('input, textarea')){
      field.setCustomValidity(field.value.trim()?'':'Please add your answer before continuing.');
    }
    if(!form.reportValidity())return;
    if(step<3)goToStep(editing?3:step+1);
  }

  const application=[
    'WisConnect membership application','',
    `Name: ${answers.name.trim()}`,`Email: ${answers.email.trim()}`,`Location: ${answers.location.trim()}`,'',
    'Business or professional expertise:',answers.expertise.trim(),'',
    'What I hope to contribute:',answers.contribution.trim()
  ].join('\n');
  const emailUrl=`mailto:hello@wisconnect.co?subject=${encodeURIComponent(`Membership application — ${answers.name.trim()}`)}&body=${encodeURIComponent(application)}`;

  async function copyApplication(){
    try{
      await navigator.clipboard.writeText(application);
      setCopyStatus('Copied. Paste it into an email to hello@wisconnect.co, then send when you’re ready.');
    }catch{
      setCopyStatus('Copy isn’t available here. Open “View application text” below to select and copy your answers.');
    }
  }

  return <main className={styles.page} data-step={step}>
    <EntryHeader/>

    <div className={styles.layout}>
      <section id="application" className={styles.application} aria-labelledby="step-title">
        <nav className={styles.progress} aria-label="Application progress">
          <p><span>Membership application</span><span>Step {step+1} of 4</span></p>
          <ol>{steps.map((label,index)=><li key={label} aria-current={step===index?'step':undefined} data-complete={index<step}><span className={styles.stepMarker} aria-hidden="true">{index<step?'✓':`0${index+1}`}</span><span>{label}</span></li>)}</ol>
        </nav>

        <form className={styles.form} onSubmit={continueApplication} aria-labelledby="step-title">
          <div key={step} className={styles.stepContent}>
            <p className={styles.eyebrow}>{step===0?'A stronger future, together':steps[step]}</p>
            <h1 id="step-title" ref={heading} tabIndex={-1}>{titles[step]}</h1>
            <p className={styles.description}>{descriptions[step]}</p>

            {step===0&&<>
              <button className={`${styles.primaryAction} ${styles.startAction}`} type="submit">Let’s get started<ArrowIcon/></button>
              <p className={styles.deliveryNote}>A short introduction. No account needed. At the end, you’ll review and send your application through your email app.</p>
              <div className={styles.benefits}>{benefits.map(([title,copy],index)=><div key={title}><span aria-hidden="true">0{index+1}</span><div><h3>{title}</h3><p>{copy}</p></div></div>)}</div>
              <details className={styles.membershipDetails}><summary>Is membership for me?</summary><p>For women contributing through enterprise, professional expertise, mentorship or community leadership.</p><p>Members take part in the cooperative, share useful knowledge or connections, and support opportunities that strengthen businesses and communities.</p></details>
            </>}

            {step===1&&<div className={styles.fields}>
              <label htmlFor="full-name">Full name<input id="full-name" name="name" value={answers.name} onChange={updateAnswer} autoComplete="name" maxLength={120} placeholder="Your full name" required/></label>
              <label htmlFor="email">Email address<input id="email" name="email" type="email" value={answers.email} onChange={updateAnswer} autoComplete="email" maxLength={254} placeholder="you@example.com" aria-describedby="email-hint" required/><small id="email-hint">The address you’d like WisConnect to reply to.</small></label>
              <label htmlFor="location">Where are you based?<input id="location" name="location" value={answers.location} onChange={updateAnswer} autoComplete="off" maxLength={160} placeholder="City and country" required/></label>
            </div>}

            {step===2&&<div className={styles.fields}>
              <label htmlFor="expertise">What do you do?<small id="expertise-hint">Tell us about your business, profession, or skills.</small><textarea id="expertise" name="expertise" value={answers.expertise} onChange={updateAnswer} rows={4} maxLength={1200} placeholder="For example, I run a small business, work in education, or help others grow their ideas…" aria-describedby="expertise-hint" required/></label>
              <label htmlFor="contribution">What would you like to contribute?<small id="contribution-hint">This could be knowledge, mentorship, connections, or a community idea.</small><textarea id="contribution" name="contribution" value={answers.contribution} onChange={updateAnswer} rows={4} maxLength={1200} placeholder="I’d love to bring…" aria-describedby="contribution-hint" required/></label>
            </div>}

            {step===3&&<>
              <div className={styles.reviewGroup}><div className={styles.reviewHeading}><h3>About you</h3><button type="button" onClick={()=>goToStep(1,true)} aria-label="Edit your personal details">Edit <ArrowIcon/></button></div><dl><div><dt>Full name</dt><dd>{answers.name.trim()}</dd></div><div><dt>Email address</dt><dd>{answers.email.trim()}</dd></div><div><dt>Location</dt><dd>{answers.location.trim()}</dd></div></dl></div>
              <div className={styles.reviewGroup}><div className={styles.reviewHeading}><h3>Your contribution</h3><button type="button" onClick={()=>goToStep(2,true)} aria-label="Edit your contribution">Edit <ArrowIcon/></button></div><dl><div><dt>Business or expertise</dt><dd>{answers.expertise.trim()}</dd></div><div><dt>What you’d like to contribute</dt><dd>{answers.contribution.trim()}</dd></div></dl></div>
              <div className={styles.nextSteps}><h3>A first conversation, not automatic membership.</h3><p>Send your application to hello@wisconnect.co. The team will review it and follow up about next steps.</p></div>
              {prepared&&<div className={styles.confirmation} role="status"><strong>One last step: send your email.</strong><p>If your email app opened, check the draft and press Send there. Nothing has been submitted through this website.</p></div>}
            </>}

            {step>0&&<div className={styles.actions}>
              <button className={styles.backButton} type="button" onClick={()=>goToStep(step-1)}><ArrowIcon/>Back</button>
              {step<3?<button className={styles.primaryAction} type="submit">{editing?'Save and review':step===2?'Review application':'Continue'}<ArrowIcon/></button>:<a className={styles.primaryAction} href={emailUrl} onClick={()=>setPrepared(true)}>Open application email<ArrowIcon/></a>}
            </div>}

            {step===3&&<div className={styles.emailFallback}><button type="button" onClick={copyApplication}>Copy application instead</button><p role="status">{copyStatus}</p><details><summary>View application text</summary><label htmlFor="application-text" className={styles.textLabel}>Copy this text into an email to hello@wisconnect.co.</label><textarea id="application-text" value={application} readOnly rows={9}/></details></div>}
          </div>
        </form>
        <p className={styles.privacyNote}>Your answers stay in this tab during these steps. They aren’t saved for later or sent until you send the email. <Link href="/#privacy">Privacy & form information</Link></p>
        <noscript><p>Please enable JavaScript to use the guided application, or email <a href="mailto:hello@wisconnect.co">hello@wisconnect.co</a> to introduce yourself.</p></noscript>
      </section>
    </div>

    <footer className={styles.footer}><span>Your next chapter starts with a connection.</span><a href="mailto:hello@wisconnect.co">Questions? Get in touch <ArrowIcon/></a></footer>
  </main>;
}
