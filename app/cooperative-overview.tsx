'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { assetPath } from './assets';
import styles from './cooperative-overview.module.css';

// An original wing-shaped W, drawn for this section rather than a brand logo.
const wingPath='M50 100 C180 45 280 110 310 200 L370 400 L500 180 L630 400 L690 200 C720 110 820 45 950 100 L800 570 C780 630 700 650 650 590 L500 390 L350 590 C300 650 220 630 200 570 Z';
const wingMask=`url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700"><path fill="white" d="${wingPath}"/></svg>`)}")`;
const scenes=[
  {label:'01 · The businesses',image:'cooperative-model',title:'Distinct strengths.',paragraphs:[
    'WisConnect Holding Cooperative is a worker-owned cooperative connecting Black women entrepreneurs, their businesses and the communities they serve.',
    'Food, child care, design, agriculture and professional expertise. Each business brings knowledge of its work and its community.',
  ]},
  {label:'02 · The cooperative',image:'cooperative-businesses',title:'A shared structure.',paragraphs:[
    'Its holding company model brings different enterprises into a shared structure, with professional support and a long-term vision for community-owned assets.',
    'Members pool experience, build relationships and take part in decisions. WisConnect’s current members make collective decisions by consensus.',
  ]},
  {label:'03 · The community',image:'cooperative-community',title:'Value that stays close.',paragraphs:[
    'The ambition reaches beyond individual enterprise: commercial space, local livelihoods and community ownership that support lasting growth.',
  ]},
];
const clamp=(value:number)=>Math.min(1,Math.max(0,value));
const ramp=(value:number,start:number,end:number)=>clamp((value-start)/(end-start));

export function CooperativeOverview(){
  const section=useRef<HTMLElement>(null);
  const track=useRef<HTMLDivElement>(null);
  const stage=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const root=section.current;
    const frame=stage.current;
    const scrollTrack=track.current;
    if(!root||!frame||!scrollTrack)return;
    const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
    const shortViewport=window.matchMedia('(max-height: 500px)');
    const supported=CSS.supports('mask-image',wingMask)||CSS.supports('-webkit-mask-image',wingMask);
    const images=Array.from(root.querySelectorAll<HTMLElement>('[data-scene-image]'));
    const panels=Array.from(root.querySelectorAll<HTMLElement>('[data-scene-copy]'));
    const markers=Array.from(root.querySelectorAll<HTMLElement>('[data-scene-marker]'));
    let request=0;
    let enabled=false;

    const draw=()=>{
      request=0;
      if(!enabled)return;
      const rect=scrollTrack.getBoundingClientRect();
      const height=frame.clientHeight;
      const progress=clamp(-rect.top/Math.max(1,rect.height-height));
      const opening=ramp(progress,0,.24);
      const maskWidth=frame.clientWidth*1.06*(1+Math.pow(opening,2)*23);
      root.style.setProperty('--wing-size',`${maskWidth}px`);
      // Start the phone-sized W just below the heading, then center its expansion.
      root.style.setProperty('--mobile-wing-position',`${opening*50}%`);
      root.style.setProperty('--opening-opacity',`${1-ramp(progress,.04,.15)}`);
      root.style.setProperty('--collage-opacity',`${1-ramp(progress,.09,.23)}`);
      root.style.setProperty('--veil-opacity',`${ramp(progress,.15,.26)}`);
      root.style.setProperty('--story-progress',`${progress}`);
      root.dataset.expanded=progress>=.24?'true':'false';
      const starts=[.23,.49,.75];
      images.forEach((image,index)=>{
        const opacity=index===0?1:ramp(progress,starts[index]-.06,starts[index]);
        image.style.opacity=String(opacity);
        image.style.transform=`scale(${1.06-.06*ramp(progress,starts[index]-.1,starts[index]+.17)})`;
      });
      panels.forEach((panel,index)=>{
        const enter=ramp(progress,starts[index]-.025,starts[index]+.025);
        const leave=index===scenes.length-1?0:ramp(progress,starts[index+1]-.06,starts[index+1]-.02);
        panel.style.opacity=String(enter*(1-leave));
        panel.style.transform=`translateY(${(1-enter)*22-leave*14}px)`;
        markers[index].dataset.active=progress>=starts[index]-.025&&(index===scenes.length-1||progress<starts[index+1]-.025)?'true':'false';
      });
    };
    const schedule=()=>{if(enabled&&!request)request=requestAnimationFrame(draw);};
    const configure=()=>{
      enabled=!preference.matches&&!shortViewport.matches&&supported;
      root.dataset.motion=enabled?'on':'off';
      if(enabled)draw();
      else {
        cancelAnimationFrame(request);request=0;
        panels.forEach(panel=>{panel.style.removeProperty('opacity');panel.style.removeProperty('transform');});
      }
    };
    configure();
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule);
    preference.addEventListener('change',configure);
    shortViewport.addEventListener('change',configure);
    const resize=new ResizeObserver(schedule);
    resize.observe(scrollTrack);resize.observe(frame);
    return()=>{
      cancelAnimationFrame(request);resize.disconnect();
      window.removeEventListener('scroll',schedule);
      window.removeEventListener('resize',schedule);
      preference.removeEventListener('change',configure);
      shortViewport.removeEventListener('change',configure);
    };
  },[]);

  return <section ref={section} id="cooperative-model" data-divider="background" className={styles.journey} aria-labelledby="model-title" style={{'--wing-mask':wingMask} as CSSProperties}>
    <div className={styles.sectionHeading}>
      <p className={styles.eyebrow}>A cooperative of businesses</p>
      <h2 id="model-title">Own together.<br/><em>Build for each other.</em></h2>
    </div>
    <div ref={track} className={styles.track}>
    <div ref={stage} className={styles.stage}>
      <div className={styles.visual} aria-hidden="true">
        {scenes.map((scene,index)=><img key={scene.image} data-scene-image className={styles.sceneImage} src={assetPath(`${scene.image}-1400.webp`)} srcSet={`${assetPath(`${scene.image}-640.webp`)} 640w, ${assetPath(`${scene.image}-1400.webp`)} 1400w`} sizes="100vw" width="1400" height="1000" alt="" loading="lazy" style={{opacity:index===0?1:0}}/>)}
        <div className={styles.wingCollage}>
          {scenes.map(scene=><img key={scene.image} src={assetPath(`${scene.image}-640.webp`)} srcSet={`${assetPath(`${scene.image}-640.webp`)} 640w, ${assetPath(`${scene.image}-1400.webp`)} 1400w`} sizes="34vw" width="640" height="960" alt="" loading="lazy"/>)}
        </div>
      </div>
      <div className={styles.veil} aria-hidden="true"/>
      <div className={styles.opening}>
        <svg className={styles.staticMark} viewBox="0 0 1000 700" aria-hidden="true"><path d={wingPath} fill="currentColor"/></svg>
        <p className={styles.scrollHint}>Scroll to see what we build together <span aria-hidden="true">↓</span></p>
      </div>
      <div className={styles.chapters}>
        {scenes.map(scene=><article key={scene.label} data-scene-copy className={styles.chapter}>
          <img className={styles.fallbackImage} src={assetPath(`${scene.image}-1400.webp`)} width="1400" height="1000" alt="" loading="lazy"/>
          <div className={styles.chapterContent}><p className={styles.chapterLabel}>{scene.label}</p>{scene.title&&<h3>{scene.title}</h3>}{scene.paragraphs.map(text=><p key={text}>{text}</p>)}</div>
        </article>)}
      </div>
      <div className={styles.storyFooter}>
        <div className={styles.markers} aria-hidden="true">{scenes.map(scene=><span data-scene-marker key={scene.label}>{scene.label}</span>)}</div>
        <p>Illustrative photography</p>
        <a href="#cooperative-story-end">Skip story <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 5 10 10M5 15h10V5" stroke="currentColor" strokeWidth="1.5"/></svg></a>
      </div>
      <div className={styles.progress} aria-hidden="true"/>
    </div>
    <div id="cooperative-story-end" className={styles.end} tabIndex={-1}/>
    </div>
  </section>;
}
