'use client';

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
  const heading=useRef<HTMLHeadingElement>(null);
  const moveFocus=useRef(false);

  useEffect(()=>{
    if(moveFocus.current)heading.current?.focus({preventScroll:true});
  },[step]);

  function goToStep(next:number){moveFocus.current=true;setStep(next);}
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
    if(event.currentTarget.reportValidity()&&step<2)goToStep(step+1);
  }

  return <div className={styles.formWrap}>
    <section className={styles.card} aria-labelledby="contact-title" data-step={step}>
      <ol className={styles.progress} aria-label="Contact form progress">
        {steps.map((label,index)=><li key={label} aria-current={step===index?'step':undefined} data-complete={index<step}>
          <button type="button" disabled={index>=step} onClick={()=>goToStep(index)} aria-label={index<step?`Back to ${label}`:undefined}><span aria-hidden="true">{index<step?'✓':''}</span>{label}</button>
        </li>)}
      </ol>
      <form onSubmit={continueForm} aria-describedby="contact-preview-note">
        <div className={styles.stepContent} key={step}>
          <div className={styles.formHeading}><h1 id="contact-title" ref={heading} tabIndex={-1}>{titles[step]}</h1><p>{descriptions[step]}</p></div>
          <div className={styles.fields}>
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
          </div>
          <div className={styles.formActions}>
            {step>0&&<button type="button" className={styles.backButton} onClick={()=>goToStep(step-1)}><Arrow/> Back</button>}
            <button className={styles.continueButton} type="submit" disabled={step===2}>{step===2?'Send message':'Continue'}<Arrow/></button>
          </div>
        </div>
      </form>
    </section>
    <p className={styles.previewNote} id="contact-preview-note">Design preview — messages aren’t sent yet.</p>
    <noscript><p className={styles.previewNote}>Enable JavaScript to preview the form steps.</p></noscript>
  </div>;
}
