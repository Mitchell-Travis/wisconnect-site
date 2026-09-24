'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import styles from './page.module.css';

const steps=['Your email','Your details','Let’s talk'];
const titles=['Let’s start a conversation.','A little more about you.','How can we help?'];
const descriptions=['A few details to help us get to know you.','Introduce yourself and your business or organization.','Tell us what you have in mind for WisConnect.'];


function Arrow(){
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h9m-3-3 3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export default function ContactForm({countries}:{countries:{code:string;name:string}[]}){
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState({email:'',country:'',name:'',organization:'',topic:'',message:''});
  const [prepared,setPrepared]=useState(false);
  const [copyStatus,setCopyStatus]=useState('');
  const heading=useRef<HTMLHeadingElement>(null);
  const moveFocus=useRef(false);

  useEffect(()=>{
    if(moveFocus.current)heading.current?.focus({preventScroll:true});
  },[step,prepared]);

  function goToStep(next:number){moveFocus.current=true;setPrepared(false);setCopyStatus('');setStep(next);}
  function updateAnswer(event:ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>){
    event.currentTarget.setCustomValidity('');
    const {name,value}=event.currentTarget;
    setAnswers(previous=>({...previous,[name]:value}));
  }
  function continueForm(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    for(const field of event.currentTarget.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>('input[required],textarea[required]')){
      field.setCustomValidity(field.value.trim()?'':'Please add your answer before continuing.');
    }
    if(!event.currentTarget.reportValidity())return;
    if(step<2)goToStep(step+1);
    else {moveFocus.current=true;setPrepared(true);}
  }
  const country=countries.find(country=>country.code===answers.country)?.name??answers.country;
  const message=[`Name: ${answers.name.trim()}`,`Email: ${answers.email.trim()}`,`Country: ${country}`,...(answers.organization.trim()?[`Organization: ${answers.organization.trim()}`]:[]),`Topic: ${answers.topic}`,'',answers.message.trim()].join('\n');
  const emailUrl=`mailto:hello@wisconnect.co?subject=${encodeURIComponent(`WisConnect — ${answers.topic}`)}&body=${encodeURIComponent(message)}`;
  async function copyMessage(){
    try {await navigator.clipboard.writeText(message);setCopyStatus('Copied. Paste into an email to hello@wisconnect.co.');}
    catch {setCopyStatus('Open “View message text” below to select and copy your message.');}
  }

  return <div className={styles.formWrap}>
    <section className={styles.card} aria-labelledby="contact-title" data-step={step}>
      <ol className={styles.progress} aria-label="Contact form progress">
        {steps.map((label,index)=><li key={label} aria-current={step===index?'step':undefined} data-complete={index<step}>
          <button type="button" disabled={index>=step} onClick={()=>goToStep(index)} aria-label={index<step?`Back to ${label}`:undefined}><span aria-hidden="true">{index<step?'✓':''}</span>{label}</button>
        </li>)}
      </ol>
      <form onSubmit={continueForm} aria-describedby="contact-delivery-note">
        <div className={styles.stepContent} key={step}>
          <div className={styles.formHeading}><h1 id="contact-title" ref={heading} tabIndex={-1}>{prepared?'Ready to connect.':titles[step]}</h1><p>{prepared?'Review your message, then send it through your email app.':descriptions[step]}</p></div>
          {prepared?<div className={styles.review}>
            <dl><div><dt>From</dt><dd>{answers.name.trim()}<br/>{answers.email.trim()}</dd></div><div><dt>Based in</dt><dd>{country}</dd></div>{answers.organization.trim()&&<div><dt>Organization</dt><dd>{answers.organization.trim()}</dd></div>}<div><dt>Topic</dt><dd>{answers.topic}</dd></div></dl>
            <p>{answers.message.trim()}</p>
          </div>:<div className={styles.fields}>
            {step===0&&<>
              <label htmlFor="contact-email">Email address</label>
              <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={answers.email} onChange={updateAnswer} maxLength={254} required/>
              <label htmlFor="contact-country">Country/region</label>
              <select id="contact-country" name="country" autoComplete="country" value={answers.country} onChange={updateAnswer} required><option value="" disabled>Select your country</option>{countries.map(country=><option key={country.code} value={country.code}>{country.name}</option>)}</select>
            </>}
            {step===1&&<>
              <label htmlFor="contact-name">Full name</label>
              <input id="contact-name" name="name" autoComplete="name" placeholder="Your full name" value={answers.name} onChange={updateAnswer} maxLength={120} required/>
              <label htmlFor="contact-organization">Business or organization <span>Optional</span></label>
              <input id="contact-organization" name="organization" autoComplete="organization" placeholder="Business or organization name" value={answers.organization} onChange={updateAnswer} maxLength={160}/>
            </>}
            {step===2&&<>
              <label htmlFor="contact-topic">I’m interested in</label>
              <select id="contact-topic" name="topic" value={answers.topic} onChange={updateAnswer} required><option value="" disabled>Select a topic</option><option>Membership</option><option>Partnerships</option><option>Member enterprises</option><option>General inquiry</option></select>
              <label htmlFor="contact-message">Your message</label>
              <textarea id="contact-message" name="message" rows={4} maxLength={3000} placeholder="Share a little about how you’d like to connect." value={answers.message} onChange={updateAnswer} required/>
            </>}
          </div>}
          <div className={styles.formActions}>
            {step>0&&<button type="button" className={styles.backButton} onClick={()=>goToStep(prepared?2:step-1)}><Arrow/> {prepared?'Edit message':'Back'}</button>}
            {prepared?<a className={styles.continueButton} href={emailUrl}>Open email app<Arrow/></a>:<button className={styles.continueButton} type="submit">{step===2?'Review message':'Continue'}<Arrow/></button>}
          </div>
          {prepared&&<div className={styles.emailFallback}>
            <button type="button" onClick={copyMessage}>Copy message instead</button><p role="status">{copyStatus}</p>
            <details><summary>View message text</summary><label htmlFor="contact-message-copy">Send this to hello@wisconnect.co.</label><textarea id="contact-message-copy" value={message} readOnly rows={7}/></details>
          </div>}
        </div>
      </form>
    <p className={styles.deliveryNote} id="contact-delivery-note">{prepared?'Your message is ready. It is sent only when you press Send in your email app.':'No account needed. Review your message before sending it through your email app.'}</p>
    <p className={styles.directContact}>Your answers stay in this tab until you send the email. <Link href="/#privacy">Privacy & form information</Link></p>
    <p className={styles.directContact}>Prefer to write directly? <a href="mailto:hello@wisconnect.co">hello@wisconnect.co</a></p>
    </section>
    <noscript><p className={styles.deliveryNote}>Enable JavaScript to use the guided form, or email us directly using the link above.</p></noscript>
  </div>;
}
