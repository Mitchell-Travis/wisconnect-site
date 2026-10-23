'use client';

import Icon from "./site-icon";
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { cooperativeStories as stories } from './cooperative-stories';
import { ProjectStoryImage } from './project-story-image';
import styles from './community-projects.module.css';

function Arrow(){
  return <Icon kind="arrow" size={18}/>;
}

const cardLabels=['Wisdom Connection','Liberia','Panama','ILAVA · Chicago Fashion Week'];

export function CommunityProjects(){
  const [desktop,setDesktop]=useState(false);
  const [active,setActive]=useState(0);
  const storyStack=useRef<HTMLDivElement>(null);
  const reducedMotion=useReducedMotion();

  useEffect(()=>{
    const query=window.matchMedia('(min-width: 960px)');
    const update=()=>setDesktop(query.matches);
    update();query.addEventListener('change',update);
    return()=>query.removeEventListener('change',update);
  },[]);

  useEffect(()=>{
    const stack=storyStack.current;
    if(!stack||desktop)return;
    const cards=Array.from(stack.querySelectorAll<HTMLElement>('[data-story-index]'));
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting)
        .sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(visible)setActive(Number((visible.target as HTMLElement).dataset.storyIndex));
    },{threshold:[.4,.55,.7],rootMargin:'-12% 0px -18% 0px'});
    cards.forEach(card=>observer.observe(card));
    return()=>observer.disconnect();
  },[desktop]);

  return <section id="community-projects" data-divider="background" className={`section ${styles.section}`} aria-labelledby="projects-title">
    <div className="shell">
      <motion.div className={`section-heading split-heading ${styles.heading}`} initial={reducedMotion?false:{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.3}} transition={{duration:reducedMotion?0:.55,ease:[.22,1,.36,1]}}>
        <div><p className="eyebrow">The work taking shape</p><h2 id="projects-title" data-section-headline>Business growth.<br/><em>Community ownership.</em></h2></div>
        <div className={styles.intro}><p data-section-description>Explore the projects, events and experiences shaping our cooperative’s work.</p><Link href="/contact" className={styles.contact}>Talk with WisConnect <Arrow/></Link></div>
      </motion.div>
      <div ref={storyStack} className={styles.storyStack} data-desktop={desktop}>
        {stories.map((item,index)=>{
          const expanded=active===index;
          return <motion.article key={item.id} className={styles.story} data-open={expanded} data-story-index={index} style={{'--story-index':index} as CSSProperties}
            initial={reducedMotion?false:{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}}
            transition={{duration:reducedMotion?0:.55,delay:reducedMotion?0:index*.09,ease:[.22,1,.36,1]}}>
            <button type="button" className={styles.card} aria-label={`Show ${item.title}`} aria-expanded={expanded} aria-controls={`project-panel-${item.id}`}
              onClick={()=>setActive(index)} onFocus={()=>setActive(index)} onPointerEnter={event=>{if(event.pointerType==='mouse'&&desktop)setActive(index);}}>
              <ProjectStoryImage story={item}/>
              <span className={styles.shade} aria-hidden="true"/>
              <span className={styles.place}>{item.place}</span>
              <span className={styles.imageLabel}>{item.imageLabel}</span>
              <span className={styles.cardTitle}>{cardLabels[index]??item.title}</span>
            </button>
            <motion.div id={`project-panel-${item.id}`} className={styles.details} role="region" aria-labelledby={`project-heading-${item.id}`} aria-hidden={!expanded} inert={!expanded}
              initial={false} animate={{opacity:expanded?1:0,y:expanded?0:14}} transition={{duration:reducedMotion?0:.3,ease:[.22,1,.36,1]}}>
              <p className={styles.stage}>{item.status}</p>
              <h3 id={`project-heading-${item.id}`}>{item.title}</h3>
              <p className={styles.summary}>{item.summary}</p>
              <div className={styles.detailFooter}><span>{item.focus}</span><Link href={`/stories/${item.id}`} aria-label={`Read the story: ${item.title}`}>Read the story <Arrow/></Link></div>
            </motion.div>
          </motion.article>;
        })}
      </div>
    </div>
  </section>;
}
