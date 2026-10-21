'use client';

import Icon from "./site-icon";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { accountAvailable } from './account-api';
import styles from './frequently-asked-questions.module.css';

const questions = [
  {id:'faq-who',title:'Who is WisConnect for?',answer:<p>Our focus is Black women entrepreneurs and visionaries across Africa and the diaspora. If you have a business, expertise or an idea to contribute, <Link href="/join">introduce yourself</Link>. The team can discuss membership eligibility and next steps with you.</p>},
  {id:'faq-ownership',title:'What does shared ownership mean?',answer:<p>WisConnect brings businesses into a holding cooperative, with members participating in collective decisions by consensus. The aim is to build shared value across enterprises and community assets. Membership agreements set out each member’s rights, responsibilities and financial terms.</p>},
  {id:'faq-membership',title:'How do I express interest in membership?',answer:<IntroductionAnswer/>},
  {id:'faq-contribute',title:'What can I contribute?',answer:<p>Your business experience, professional skills, mentorship, local knowledge and relationships can all be part of the conversation. Tell us what you know, what you care about and where you would like to take part.</p>},
  {id:'faq-opportunities',title:'What opportunities are available now?',answer:<p>You can introduce yourself or <Link href="/contact">contact the team</Link> about membership and partnership ideas. Funding, program schedules and business support services are still being developed; ask WisConnect what is available for your situation.</p>},
  {id:'languages',title:'Is the website available in French?',answer:<><p>English is available now. French content is awaiting translation, review and an agreed launch date.</p><p lang="fr">La version française est en préparation. La date de publication reste à confirmer.</p></>},
];

function Arrow(){
  return <Icon kind="arrow"/>;
}

export function FrequentlyAskedQuestions(){
  const answers = useRef<HTMLDivElement>(null);

  function revealAnswer(id:string){
    const answer = document.getElementById(id);
    if(!(answer instanceof HTMLDetailsElement)||!answers.current?.contains(answer))return;
    answer.open=true;
    answer.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }

  useEffect(()=>{
    function revealHash(){
      const id=window.location.hash.slice(1);
      if(questions.some(question=>question.id===id))revealAnswer(id);
    }
    revealHash();
    window.addEventListener('hashchange',revealHash);
    return()=>window.removeEventListener('hashchange',revealHash);
  },[]);

  return <section id="faq" data-divider="background" className={styles.section} aria-labelledby="faq-title">
    <div className="shell">
      <div className={styles.answerLayout}>
        <header className={styles.heading}>
          <p className={styles.eyebrow}>Frequently asked questions</p>
          <h2 id="faq-title" data-section-headline>A little more<br/>{' '}<em>clarity.</em></h2>
          <p data-section-description className={styles.intro}>Membership, shared ownership and how to get started.</p>
          <Link href="/contact" className={styles.contact}>Ask our team <Arrow/></Link>
        </header>
        <div ref={answers} className={styles.answers}>
          {questions.map((question,index)=><details key={question.id} id={question.id} name="wisconnect-faq" className={styles.answer}>
            <summary><span className={styles.questionNumber} aria-hidden="true">0{index+1}</span><span>{question.title}</span><span className={styles.plus} aria-hidden="true"><Icon kind="plus"/><Icon kind="minus"/></span></summary>
            <div className={styles.answerBody}>{question.answer}</div>
          </details>)}
        </div>
      </div>
    </div>
  </section>;
}

function IntroductionAnswer(){
  const [direct,setDirect]=useState(false);useEffect(()=>setDirect(accountAvailable()),[]);
  return <p>Complete the <Link href="/join">five-question introduction</Link>, review your answers and {direct ? 'submit them for the team to review' : 'send the prepared draft from your own email app'}. Completing the form does not send it automatically or make you a member.</p>;
}
