'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { cooperativeStories as stories } from './cooperative-stories';
import { ProjectStoryImage } from './project-story-image';
import styles from './community-projects.module.css';

function Arrow(){
  return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
export function CommunityProjects(){
  const [desktop,setDesktop]=useState(false);
  const [active,setActive]=useState<number|null>(0);
  const [stackEnabled,setStackEnabled]=useState(false);
  const storyStack=useRef<HTMLDivElement>(null);
  const reducedMotion=useReducedMotion();

  useEffect(()=>{
    const query=window.matchMedia('(min-width: 761px)');
    const update=()=>setDesktop(query.matches);
    update();query.addEventListener('change',update);
    return()=>query.removeEventListener('change',update);
  },[]);

  useEffect(()=>{
    const stack=storyStack.current;
    if(!stack)return;
    // Keep every story's reading link reachable on short screens and at larger text sizes.
    const update=()=>{
      const cards=Array.from(stack.children) as HTMLElement[];
      const fits=cards.every((card,index)=>card.offsetHeight+88+index*48+24<=window.innerHeight);
      setStackEnabled(!desktop&&!reducedMotion&&fits);
    };
    const observer=new ResizeObserver(update);
    Array.from(stack.children).forEach(card=>observer.observe(card));
    window.addEventListener('resize',update);
    update();
    return()=>{observer.disconnect();window.removeEventListener('resize',update);};
  },[desktop,reducedMotion]);

  return <section id="community-projects" data-divider="background" className={`section ${styles.section}`} aria-labelledby="projects-title"><div className="shell">
    <div className={`section-heading split-heading ${styles.heading}`}>
      <div><p className="eyebrow">The work taking shape</p><h2 id="projects-title">Business growth.<br/><em>Community ownership.</em></h2></div>
      <div className={styles.intro}><p>Stories, project updates and development visions from across the cooperative. See how local people, businesses and communities shape the work.</p><Link href="/contact" className={styles.contact}>Talk with WisConnect <Arrow/></Link></div>
    </div>
    <div ref={storyStack} className={styles.storyStack} data-stack={stackEnabled}>
      {stories.map((item,index)=>{
        const expanded=!desktop||active===index;
        return <article key={item.id} className={styles.story} data-open={expanded} style={{'--story-index':index} as CSSProperties}>
          <div className={styles.storyHeader}>
            <h3 id={`project-heading-${item.id}`}>
              <button type="button" className={styles.toggle} aria-expanded={expanded} aria-controls={`project-panel-${item.id}`} onClick={()=>setActive(active===index?null:index)}>
                <span className={styles.number} aria-hidden="true">0{index+1}</span><span>{item.title}</span><span className={styles.toggleIcon} aria-hidden="true">{expanded?'−':'+'}</span>
              </button>
              <span className={styles.mobileTitle}><span className={styles.number} aria-hidden="true">0{index+1}</span>{item.title}</span>
            </h3>
            {expanded&&<Link className={`${styles.readStory} ${styles.desktopRead}`} href={`/stories/${item.id}`} aria-label={`Read the story: ${item.title}`}>Read the story <Arrow/></Link>}
          </div>
          <motion.div id={`project-panel-${item.id}`} className={styles.panel} role="region" aria-labelledby={`project-heading-${item.id}`} aria-hidden={!expanded} inert={!expanded} initial={false} animate={{height:expanded?'auto':0,opacity:expanded?1:0}} transition={{duration:reducedMotion?0:.35,ease:[.22,1,.36,1]}}>
            <div className={styles.panelInner}>
              <figure className={styles.photo}><ProjectStoryImage story={item}/><figcaption>{item.imageLabel}</figcaption></figure>
              <dl className={styles.facts}><div><dt>Location</dt><dd>{item.place}</dd></div><div><dt>Stage</dt><dd>{item.status}</dd></div><div><dt>Focus</dt><dd>{item.focus}</dd></div></dl>
              <Link className={`${styles.readStory} ${styles.mobileRead}`} href={`/stories/${item.id}`} aria-label={`Read the story: ${item.title}`}>Read the story <Arrow/></Link>
            </div>
          </motion.div>
        </article>;
      })}
    </div>
  </div></section>;
}
