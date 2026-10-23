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

const cardLabels=['Wisdom Connection','Enterprise in Liberia','Building Bridges in Panama','ILAVA in Chicago'];

export function CommunityProjects(){
  const [desktop,setDesktop]=useState(false);
  const [active,setActive]=useState(0);
  const storyTrack=useRef<HTMLDivElement>(null);
  const reducedMotion=useReducedMotion();

  useEffect(()=>{
    const query=window.matchMedia('(min-width: 960px)');
    const update=()=>setDesktop(query.matches);
    update();query.addEventListener('change',update);
    return()=>query.removeEventListener('change',update);
  },[]);

  useEffect(()=>{
    const track=storyTrack.current;
    if(!track||desktop||reducedMotion)return;
    const steps=Array.from(track.querySelectorAll<HTMLElement>('[data-story-step]'));
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting)
        .sort((a,b)=>{
          const center=window.innerHeight/2;
          const distanceA=Math.abs((a.boundingClientRect.top+a.boundingClientRect.bottom)/2-center);
          const distanceB=Math.abs((b.boundingClientRect.top+b.boundingClientRect.bottom)/2-center);
          return distanceA-distanceB;
        })[0];
      if(visible)setActive(Number((visible.target as HTMLElement).dataset.storyStep));
    },{threshold:0,rootMargin:'-40% 0px -40% 0px'});
    steps.forEach(step=>observer.observe(step));
    return()=>observer.disconnect();
  },[desktop,reducedMotion]);

  return <section id="community-projects" data-divider="background" className={`section ${styles.section}`} aria-labelledby="projects-title">
    <div className="shell">
      <motion.div className={`section-heading split-heading ${styles.heading}`} initial={reducedMotion?false:{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.3}} transition={{duration:reducedMotion?0:.55,ease:[.22,1,.36,1]}}>
        <div><p className="eyebrow">The work taking shape</p><h2 id="projects-title" data-section-headline>Business growth.<br/><em>Community ownership.</em></h2></div>
        <div className={styles.intro}><p data-section-description>Explore the projects, events and experiences shaping our cooperative’s work.</p><Link href="/contact" className={styles.contact}>Talk with WisConnect <Arrow/></Link></div>
      </motion.div>
      <div className={styles.storyStack} data-desktop={desktop}>
        {stories.map((item,index)=>{
          const expanded=active===index;
          return <motion.article key={item.id} className={styles.story} data-open={expanded} data-story-index={index} style={{'--story-index':index} as CSSProperties}
            initial={reducedMotion?false:{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}}
            transition={{duration:reducedMotion?0:.55,delay:reducedMotion?0:index*.09,ease:[.22,1,.36,1]}}>
            <button type="button" className={styles.card} aria-label={`Show ${item.title}`} aria-expanded={expanded} aria-controls={`project-panel-${item.id}`}
              onClick={()=>setActive(index)} onFocus={()=>setActive(index)} onPointerEnter={event=>{if(event.pointerType==='mouse'&&desktop)setActive(index);}}>
              <ProjectStoryImage story={item} eager={index===0}/>
              <span className={styles.shade} aria-hidden="true"/>
              <span className={styles.place} aria-hidden="true">{item.place}</span>
              <span className={styles.imageLabel} aria-hidden="true">{item.imageLabel}</span>
              <span className={styles.cardTitle}>{expanded&&desktop?item.title:(cardLabels[index]??item.title)}</span>
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
      <div ref={storyTrack} className={styles.storyTrack} aria-hidden="true">
        {stories.slice(1).map((item,index)=>(
          <span key={item.id} className={styles.storyStep} data-story-step={index+1}/>
        ))}
      </div>
    </div>
  </section>;
}
