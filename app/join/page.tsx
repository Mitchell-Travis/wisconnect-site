"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import EntryHeader from '../entry-header';
import JoinVisual from './join-visual';
import styles from './page.module.css';

const steps=['Welcome','About you','Your contribution','Review'];
const titles=['Let’s get to know you.','Tell us about yourself.','What would you bring?','Review your introduction.'];
const descriptions=[
  'Tell us about your work and your interest in becoming part of WisConnect.',
  'Let us know who you are, where you’re based, and how to reach you.',
  'Share a little about your experience and how you’d like to take part.',
  'Check your introduction. You can edit any answer before preparing your email.'
];
const fieldLabels={name:'Full name',email:'Email address',location:'Location',expertise:'Your business or expertise',contribution:'Your contribution'};
type Field = keyof typeof fieldLabels;
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
  const [errors,setErrors]=useState<Partial<Record<Field,string>>>({});
  const summary=useRef<HTMLDivElement>(null);
  const copyAttempt=useRef(0);
  const beforeEdit=useRef(emptyAnswers);
  const heading=useRef<HTMLHeadingElement>(null);
  const moveFocus=useRef(false);

  useEffect(()=>{
    if(!moveFocus.current)return;
    heading.current?.focus({preventScroll:true});
    window.scrollTo({top:0,behavior:'instant'});
  },[step]);

  function goToStep(next:number,edit=false){
    if(edit)beforeEdit.current={...answers};
    copyAttempt.current++;
    setErrors({});
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
    setErrors(previous=>({...previous,[name]:undefined}));
  }

  function continueApplication(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    const form=event.currentTarget;
    const nextErrors:Partial<Record<Field,string>>={};
    for(const field of form.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>('input, textarea')){
      if(!field.value.trim())nextErrors[field.name as Field]='Please add your answer.';
      else if(field instanceof HTMLInputElement && field.type==='email' && field.validity.typeMismatch)nextErrors.email='Enter an email address like maya@example.com.';
    }
    setErrors(nextErrors);
    if(Object.keys(nextErrors).length){requestAnimationFrame(()=>summary.current?.focus());return;}
    if(step<3)goToStep(editing?3:step+1);
  }

  const application=[
    'WisConnect membership interest — introduction','',
    `Name: ${answers.name.trim()}`,`Email: ${answers.email.trim()}`,`Location: ${answers.location.trim()}`,'',
    'Business or professional expertise:',answers.expertise.trim(),'',
    'What I hope to contribute:',answers.contribution.trim()
  ].join('\n');
  const emailUrl=`mailto:hello@wisconnect.co?subject=${encodeURIComponent(`Membership interest — ${answers.name.trim()}`)}&body=${encodeURIComponent(application)}`;

  async function copyApplication(){
    const attempt=++copyAttempt.current;
    try{
      await navigator.clipboard.writeText(application);
      if(attempt!==copyAttempt.current)return;
      setCopyStatus('Copied. Paste it into an email to hello@wisconnect.co, then send when you’re ready.');
    }catch{
      if(attempt!==copyAttempt.current)return;
      setCopyStatus('Copy isn’t available here. Open “View introduction text” below to select and copy your answers.');
    }
  }

  const invalidFields=(Object.keys(fieldLabels) as Field[]).filter(key=>errors[key]);
  const fieldFeedback=(key:Field)=>({
    'aria-invalid':!!errors[key],
    'aria-describedby':errors[key]?'join-'+key+'-error':undefined,
  });

  return <div className={styles.page} data-step={step}>
    <EntryHeader/>

    <main className={styles.layout}>
      <JoinVisual/>
      <section id="application" className={styles.application} aria-labelledby="step-title">
        {step>0&&<nav className={styles.progress} aria-label="Introduction progress">
          <p><span>Membership interest</span><span>Step {step} of 3</span></p>
          <ol>{steps.slice(1).map((label,index)=><li key={label} aria-current={step===index+1?'step':undefined} data-complete={index+1<step}><span className={styles.stepMarker} aria-hidden="true">{index+1<step?'✓':`0${index+1}`}</span><span>{label}</span></li>)}</ol>
        </nav>}

        <form className={styles.form} onSubmit={continueApplication} noValidate aria-labelledby="step-title">
          <div key={step} className={styles.stepContent}>
            <p className={styles.eyebrow}>{step===0?'Membership interest':steps[step]}</p>
            <h1 id="step-title" ref={heading} tabIndex={-1}>{titles[step]}</h1>
            <p className={styles.description}>{descriptions[step]}</p>

            {invalidFields.length>0&&<div ref={summary} className={styles.errorSummary} role="alert" tabIndex={-1}><strong>Check these details.</strong><ul>{invalidFields.map(key=><li key={key}><a href={'#'+(key==='name'?'full-name':key)} onClick={event=>{event.preventDefault();document.getElementById(key==='name'?'full-name':key)?.focus();}}>{fieldLabels[key]}: {errors[key]}</a></li>)}</ul></div>}
            {step===0&&<>
              <button className={`${styles.primaryAction} ${styles.startAction}`} type="submit">Introduce yourself<ArrowIcon/></button>
              <p className={styles.deliveryNote}>Five questions. Review your answers, then send by email. No account needed.</p>
              <details className={styles.membershipDetails}><summary>What happens next?</summary><p>Your introduction starts a conversation with WisConnect. Membership is subject to eligibility, review and the cooperative’s onboarding process.</p></details>
            </>}

            {step===1&&<div className={styles.fields}>
              <label htmlFor="full-name">Full name<input id="full-name" name="name" {...fieldFeedback('name')} value={answers.name} onChange={updateAnswer} autoComplete="name" maxLength={120} placeholder="e.g. Maya Johnson" required/></label>{errors.name&&<p className={styles.fieldError} id="join-name-error">{errors.name}</p>}
              <label htmlFor="email">Email address<input id="email" name="email" type="email" {...fieldFeedback('email')} value={answers.email} onChange={updateAnswer} autoComplete="email" maxLength={254} placeholder="e.g. maya@example.com" autoCapitalize="none" spellCheck={false} aria-describedby={errors.email?'email-hint join-email-error':'email-hint'} required/><small id="email-hint">The address you’d like WisConnect to reply to.</small></label>{errors.email&&<p className={styles.fieldError} id="join-email-error">{errors.email}</p>}
              <label htmlFor="location">Where are you based?<input id="location" name="location" {...fieldFeedback('location')} value={answers.location} onChange={updateAnswer} autoComplete="off" maxLength={160} placeholder="e.g. Roseland, Chicago" required/></label>{errors.location&&<p className={styles.fieldError} id="join-location-error">{errors.location}</p>}
            </div>}

            {step===2&&<div className={styles.fields}>
              <label htmlFor="expertise">What do you do?<small id="expertise-hint">Tell us about your business, profession, or skills.</small><textarea id="expertise" name="expertise" {...fieldFeedback('expertise')} value={answers.expertise} onChange={updateAnswer} rows={4} maxLength={1200} placeholder="For example, I run a small business, work in education, or help others grow their ideas…" aria-describedby={errors.expertise?'expertise-hint join-expertise-error':'expertise-hint'} required/></label>{errors.expertise&&<p className={styles.fieldError} id="join-expertise-error">{errors.expertise}</p>}
              <label htmlFor="contribution">What would you like to contribute?<small id="contribution-hint">This could be knowledge, mentorship, connections, or a community idea.</small><textarea id="contribution" name="contribution" {...fieldFeedback('contribution')} value={answers.contribution} onChange={updateAnswer} rows={4} maxLength={1200} placeholder="I’d love to bring…" aria-describedby={errors.contribution?'contribution-hint join-contribution-error':'contribution-hint'} required/></label>{errors.contribution&&<p className={styles.fieldError} id="join-contribution-error">{errors.contribution}</p>}
            </div>}

            {step===3&&<>
              <div className={styles.reviewGroup}><div className={styles.reviewHeading}><h3>About you</h3><button type="button" onClick={()=>goToStep(1,true)} aria-label="Edit your personal details">Edit <ArrowIcon/></button></div><dl><div><dt>Full name</dt><dd>{answers.name.trim()}</dd></div><div><dt>Email address</dt><dd>{answers.email.trim()}</dd></div><div><dt>Location</dt><dd>{answers.location.trim()}</dd></div></dl></div>
              <div className={styles.reviewGroup}><div className={styles.reviewHeading}><h3>Your contribution</h3><button type="button" onClick={()=>goToStep(2,true)} aria-label="Edit your contribution">Edit <ArrowIcon/></button></div><dl><div><dt>Business or expertise</dt><dd>{answers.expertise.trim()}</dd></div><div><dt>What you’d like to contribute</dt><dd>{answers.contribution.trim()}</dd></div></dl></div>
              <div className={styles.nextSteps}><h3>An introduction is the first step.</h3><p>This expresses interest in WisConnect. Membership is subject to eligibility, review and the cooperative’s onboarding process.</p></div>
              {prepared&&<div className={styles.confirmation} role="status"><strong>One last step: send your email.</strong><p>If your email app opened, check the draft and press Send there. Nothing has been submitted through this website.</p></div>}
            </>}

            {step>0&&<div className={styles.actions}>
              <button className={styles.backButton} type="button" onClick={()=>{if(editing)setAnswers(beforeEdit.current);goToStep(editing?3:step-1);}}><ArrowIcon/>{editing?'Cancel edit':'Back'}</button>
              {step<3?<button className={styles.primaryAction} type="submit">{editing?'Save and review':step===2?'Review introduction':'Continue'}<ArrowIcon/></button>:<a className={styles.primaryAction} href={emailUrl} onClick={()=>setPrepared(true)}>Open email draft<ArrowIcon/></a>}
            </div>}

            {step===3&&<div className={styles.emailFallback}><button type="button" onClick={copyApplication}>Copy introduction</button><p role="status">{copyStatus}</p><details><summary>View introduction text</summary><label htmlFor="application-text" className={styles.textLabel}>Copy this text into an email to hello@wisconnect.co.</label><textarea id="application-text" value={application} readOnly rows={9}/></details></div>}
          </div>
        </form>
        <p className={styles.privacyNote}>{step===0?'Already a member? ':'Your answers stay in this tab. Reloading clears them. Nothing is sent until you send the email. '}{step===0&&<><Link href="/login">Sign in</Link><span aria-hidden="true"> · </span></>} <Link href="/terms">Terms & Conditions</Link></p>
        <noscript><p>Please enable JavaScript to use the guided application, or email <a href="mailto:hello@wisconnect.co">hello@wisconnect.co</a> to introduce yourself.</p></noscript>
      </section>
    </main>

    <footer className={styles.footer}><span>WisConnect Holding Cooperative</span><a href="mailto:hello@wisconnect.co">Questions? Get in touch <ArrowIcon/></a></footer>
  </div>;
}
