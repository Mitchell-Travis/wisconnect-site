'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { assetPath } from './assets';
import styles from './frequently-asked-questions.module.css';

const questions = [
  {id:'faq-who',title:'Who is WisConnect for?',answer:<p>Our focus is Black women entrepreneurs and visionaries across Africa and the diaspora. If you have a business, expertise or an idea to contribute, <Link href="/join">introduce yourself</Link>. The team can discuss membership eligibility and next steps with you.</p>},
  {id:'faq-ownership',title:'What does shared ownership mean?',answer:<p>WisConnect brings businesses into a holding cooperative, with members participating in collective decisions by consensus. The aim is to build shared value across enterprises and community assets. Membership agreements set out each member’s rights, responsibilities and financial terms.</p>},
  {id:'faq-membership',title:'How do I express interest in membership?',answer:<p>Complete the <Link href="/join">five-question introduction</Link>, review your answers and send the prepared draft from your own email app. Completing the form does not send it automatically or make you a member.</p>},
  {id:'faq-contribute',title:'What can I contribute?',answer:<p>Your business experience, professional skills, mentorship, local knowledge and relationships can all be part of the conversation. Tell us what you know, what you care about and where you would like to take part.</p>},
  {id:'faq-opportunities',title:'What opportunities are available now?',answer:<p>You can introduce yourself or <Link href="/contact">contact the team</Link> about membership and partnership ideas. Funding, program schedules and business support services are still being developed; ask WisConnect what is available for your situation.</p>},
  {id:'languages',title:'Is the website available in French?',answer:<><p>English is available now. French content is awaiting translation, review and an agreed launch date.</p><p lang="fr">La version française est en préparation. La date de publication reste à confirmer.</p></>},
];

const featured = [
  {id:'faq-who',label:'The people',title:'Who is WisConnect for?',image:'story-enterprise',height:1050,position:'65% center',alt:'An entrepreneur sewing fabric in her workshop'},
  {id:'faq-ownership',label:'The cooperative',title:'What does shared ownership mean?',image:'story-ownership',height:935,position:'65% center',alt:'Three women listening and taking notes around a meeting table'},
  {id:'faq-membership',label:'Your first step',title:'How do I get started?',image:'story-skills',height:933,position:'65% center',alt:'Two women exchanging ideas across a table'},
];

function Arrow(){
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export function FrequentlyAskedQuestions(){
  const answers = useRef<HTMLDivElement>(null);

  function revealAnswer(id:string,focus=false){
    const answer = document.getElementById(id);
    if(!(answer instanceof HTMLDetailsElement)||!answers.current?.contains(answer))return;
    answer.open=true;
    if(focus)answer.querySelector('summary')?.focus({preventScroll:true});
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
    <div className={`shell ${styles.content}`}>
      <div className={styles.heading}>
        <p className={styles.eyebrow}>Frequently asked questions</p>
        <h2 id="faq-title">Before you take<br/><em>the next step.</em></h2>
        <p className={styles.intro}>Get to know the cooperative, what membership means<br className={styles.desktopBreak}/> and where your experience could fit.</p>
      </div>

      <div className={styles.featured} role="group" aria-label="Explore popular questions">
        {featured.map(item=><button key={item.id} type="button" className={styles.card} aria-controls={item.id} onClick={()=>revealAnswer(item.id,true)}>
          <img src={assetPath(`${item.image}-1400.webp`)} srcSet={`${assetPath(`${item.image}-640.webp`)} 640w, ${assetPath(`${item.image}-1400.webp`)} 1400w`} sizes="(max-width: 760px) 80vw, (max-width: 1280px) 33vw, 400px" width="1400" height={item.height} loading="lazy" decoding="async" alt={item.alt} style={{objectPosition:item.position}}/>
          <span className={styles.cardLabel}>{item.label}</span>
          <span className={styles.cardBottom}><span className={styles.cardTitle}>{item.title}</span><span className={styles.cardArrow}><Arrow/></span></span>
        </button>)}
      </div>
      <div className={styles.photoNotes}>
        <span className={styles.swipeHint}>Swipe to explore all three <span aria-hidden="true">→</span></span>
        <p>Illustrative photography · <a href="https://www.pexels.com/photo/african-woman-sewing-fabric-with-vintage-machine-37409120/" target="_blank" rel="noreferrer">Joaquin Reyes Ramos</a> &amp; <a href="https://www.pexels.com/photo/photo-of-women-listening-during-discussion-1181624/" target="_blank" rel="noreferrer">Christina Morillo</a> / Pexels</p>
      </div>

      <div className={styles.answerLayout}>
        <div className={styles.answerIntro}>
          <p className={styles.eyebrow}>A little more clarity</p>
          <h3>Your questions,<br/><em>answered.</em></h3>
          <p>Something else on your mind?<br/>Start a conversation with our team.</p>
          <Link href="/contact" className={styles.contact}>Talk with WisConnect <Arrow/></Link>
        </div>
        <div ref={answers} className={styles.answers}>
          {questions.map((question,index)=><details key={question.id} id={question.id} name="wisconnect-faq" className={styles.answer}>
            <summary><span className={styles.questionNumber} aria-hidden="true">0{index+1}</span><span>{question.title}</span><span className={styles.plus} aria-hidden="true"/></summary>
            <div className={styles.answerBody}>{question.answer}</div>
          </details>)}
        </div>
      </div>
    </div>
  </section>;
}
