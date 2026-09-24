"use client";

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import Link from 'next/link';
import { animate, motion, MotionConfig, useInView, useScroll, useSpring, useTransform, type MotionStyle } from 'motion/react';
import { assetPath } from './assets';
import styles from './page.module.css';

const sectors = ['Food & Beverages','Consulting Services','Agriculture','Textiles & Apparel','Handmade Crafts','Training'] as const;
const navigationMenus = [
  {label:'About',groups:[
    {title:'Why we exist',links:[{label:'Purpose, mission & values',description:'Our direction and what motivates it.',href:'#purpose'},{label:'Cooperative model',description:'People, capital and communities.',href:'#about'}]},
    {title:'Our ambition',links:[{label:'Impact',description:'Outcomes and evidence to be shared.',href:'#impact'},{label:'Diaspora connections',description:'Local roots and a wider circle.',href:'#global-reach'}]}
  ],feature:{image:'story-community-640.webp',title:'Rooted in community.',description:'Explore the purpose behind a shared future.'}},
  {label:'Our people',groups:[
    {title:'People',links:[{label:'Meet the visionaries',description:'The women behind WisConnect.',href:'#members'},{label:'Member directory',description:'Profiles, expertise and contributions.',href:'#member-directory'}]},
    {title:'Enterprise',links:[{label:'Business sectors',description:'Explore six areas of enterprise.',href:'#businesses'},{label:'Business directory',description:'Member-owned business listings.',href:'#business-directory'}]}
  ],feature:{image:'story-enterprise-640.webp',title:'Individual strengths.',description:'People, experience and enterprise shape the cooperative.'}},
  {label:'Our work',groups:[
    {title:'Support & learning',links:[{label:'Services & support',description:'The practical role of the cooperative.',href:'#what-we-do'},{label:'Programs & activities',description:'Proposed ways to learn and connect.',href:'#programs'}]},
    {title:'Shared knowledge',links:[{label:'Resources & videos',description:'Guides and learning materials.',href:'#resources'},{label:'Community work',description:'Contributions and local initiatives.',href:'#community-work'}]}
  ],feature:{image:'story-skills-640.webp',title:'Knowledge, shared.',description:'Explore the ideas behind practical support.'}},
  {label:'Updates',groups:[
    {title:'From the network',links:[{label:'Stories',description:'People, ideas and everyday contributions.',href:'#stories'},{label:'News & announcements',description:'Updates from WisConnect.',href:'#news'}]},
    {title:'Gather & explore',links:[{label:'Events calendar',description:'Confirmed gatherings will appear here.',href:'#events'},{label:'Photo gallery',description:'Space for approved community photographs.',href:'#gallery'}]}
  ],feature:{image:'story-ownership-640.webp',title:'A shared perspective.',description:'Discover the stories behind our vision.'}}
] as const;
const networkStories = [
  {image:'enterprise',category:'Enterprise',title:'Made by her. Ready for more.',description:'A good product is a beginning. The next chapter takes connections, practical support and room to grow.',alt:'A woman sewing fabric at her workshop table',position:'65% center',credit:'Joaquin Reyes Ramos',source:'https://www.pexels.com/photo/african-woman-sewing-fabric-with-vintage-machine-37409120/',paragraphs:[
    'Picture the work behind a finished garment: choosing the cloth, cutting the pattern, stitching the seams and finding the person who will wear it. The maker brings the skill. Building a business around that skill asks something more of her every day.',
    'A conversation about pricing, an introduction to a supplier or a recommendation from another business owner can open a next step. That is the possibility behind WisConnect: a place where individual enterprise can meet shared knowledge, resources and ambition. The craft stays hers. The circle around it can grow.'
  ]},
  {image:'ownership',category:'Cooperative thinking',title:'A seat at the table. A stake in tomorrow.',description:'Shared ownership starts with a simple idea: the people building the future should help shape it.',alt:'Three women listening and taking notes around a meeting table',position:'75% center',credit:'Christina Morillo',source:'https://www.pexels.com/photo/photo-of-women-listening-during-discussion-1181624/',paragraphs:[
    'What should we build together? It is a small question with a big consequence: it invites people to bring their experience into the decisions ahead. A maker may see a need for better access to materials. An adviser may see a chance to share practical expertise. Each perspective adds something the others cannot.',
    'WisConnect’s cooperative vision brings those perspectives into a shared project. Ownership is a reason to take part, ask questions and consider what a decision means beyond one business. A stronger institution begins with people who can see a place for themselves in its future.'
  ]},
  {image:'skills',category:'Knowledge exchange',title:'One conversation. New possibilities.',description:'The lesson you learned the hard way could be the starting point someone else needs.',alt:'Two women exchanging ideas across a table by a window',position:'80% center',credit:'Christina Morillo',source:'https://www.pexels.com/photo/photography-of-women-talking-to-each-other-1181717/',paragraphs:[
    'Sometimes the useful question comes after the presentation: how did you price your first order, find a reliable partner or explain your work to a new customer? Experience becomes especially valuable when someone is willing to share the detail behind it.',
    'Imagine a network where a conversation can connect a first-time founder with someone who remembers that same uncertainty. This is the spirit of knowledge exchange at WisConnect: practical questions, generous listening and lessons people can put to work. Everyone brings something to learn. Everyone may have something to teach.'
  ]},
  {image:'community',category:'Community connections',title:'Local roots. A wider circle.',description:'Behind every exchange is a relationship. Stronger connections can help local enterprise reach further.',alt:'Women exchanging goods at an outdoor market',position:'72% center',credit:'Kold Shots',source:'https://www.pexels.com/photo/vibrant-african-market-scene-with-women-33489791/',paragraphs:[
    'A market is a place to buy and sell, but it is also a place to meet. People exchange recommendations, remember a regular customer and learn what their neighbours need. Business grows out of those everyday relationships.',
    'WisConnect’s vision starts close to that local life and looks outward. Connections across communities can introduce new ideas, potential collaborators and different ways of working. The ambition is to widen the circle of opportunity while keeping people, their work and their communities at its centre.'
  ]}
] as const;
const beliefPillars = [
  {label:'People',title:'Knowledge becomes collective capacity.',description:'Member expertise, shared experience and meaningful connections are where the cooperative begins.'},
  {label:'Capital',title:'Resources become opportunity.',description:'Shared resources support the ideas and enterprises that members bring to the cooperative.'},
  {label:'Communities',title:'Value belongs close to home.',description:'Our vision is for business opportunity to strengthen local life and circulate value back through the cooperative.'}
] as const;
const cooperativeCards = [
  {id:'capital',label:'Capital',step:'02',heading:'Resources become',accent:'enterprise.',description:beliefPillars[1].description,detail:beliefPillars[1].title,image:'cooperative-shop.jpg',alt:'A Tanzanian shop owner inside her business'},
  {id:'communities',label:'Communities',step:'03',heading:'Local commerce',accent:'strengthens local life.',description:beliefPillars[2].description,detail:beliefPillars[2].title,image:'cooperative-market.jpg',alt:'A Nairobi market vendor at her place of work'}
] as const;
const memberProfiles = [
  {name:'Chipo Nyambuya, Esq',role:'International Legal, Governance, and Economic Development Leader',bio:'Her areas of leadership bring together international law, governance and economic development.',expertise:['International law','Governance','Economic development'],image:'chipo'},
  {name:'Elizabeth L. Carter',role:'Business and Corporate Securities Attorney, Legal & Business',bio:'Her work connects business law, corporate securities and the legal foundations that support enterprise.',expertise:['Business law','Corporate securities','Legal & business'],image:'elizabeth'},
  {name:'Priscilla Cadette',role:'Entrepreneur, mentor and fundraising specialist',bio:'Her experience connects entrepreneurship, mentorship and fundraising support.',expertise:['Entrepreneurship','Mentorship','Fundraising'],image:'priscilla'},
  {name:'Ade Wede Wee-Wee Kekuleh',role:'Advocate, legal professional and chartered accountant',bio:'Ade Wede Wee-Wee Kekuleh is a Liberian advocate, legal professional, chartered accountant, journalist, lecturer and published author. Her work focuses on gender, human rights, peacebuilding and social justice, with particular attention to women, children and underserved communities. She is a Partner at ZE’AD Advisors and Consultants and teaches Managerial Accounting and Legal Aspects of Business at the United Methodist University Graduate School.',expertise:['Gender & human rights','Peacebuilding','Social justice','Law & accounting'],image:'ade-wede'}
] as const;
// Six portrait positions per scene; additional members get another scene.
const portraitPositions = [
  {x:-30,y:-28,scale:.8}, {x:30,y:24,scale:1.06},
  {x:30,y:-30,scale:.9}, {x:-30,y:30,scale:.95},
  {x:0,y:-36,scale:1}, {x:0,y:36,scale:.75}
] as const;
const regions = {
  Africa: 'WisConnect’s cultural and strategic root — where local businesses, communities and cooperative opportunity connect.',
  'United States': 'A relationship and partnership market for cooperative leadership, resources and cross-border opportunity.',
  'Brazil / South America': 'A priority direction within WisConnect’s wider global-connection vision.',
  'Vietnam / Southeast Asia': 'A priority direction within WisConnect’s wider global-connection vision.'
} as const;

type Sector = (typeof sectors)[number];
type Region = keyof typeof regions;

const impactPlaces: {region:Region;label:string;x:number;y:number;route?:string}[] = [
  // Approximate country anchors in the map's equirectangular projection, not office locations.
  {region:'Africa',label:'Liberia',x:474,y:220},
  {region:'United States',label:'United States',x:228,y:129,route:'M474 220 Q355 20 228 129'},
  {region:'Brazil / South America',label:'Brazil',x:356,y:277,route:'M474 220 Q388 167 356 277'},
  {region:'Vietnam / Southeast Asia',label:'Vietnam',x:800,y:199,route:'M474 220 Q658 40 800 199'}
];

const sectorStories: Record<Sector,{image:string;alt:string;kicker:string;description:string}> = {
  'Food & Beverages': {
    image:assetPath('member-food.jpg'),
    alt:'A Black woman welcoming customers from a café counter',
    kicker:'Products & hospitality',
    description:'Food brands, hospitality concepts and local producers creating products people can gather around.'
  },
  'Consulting Services': {
    image:assetPath('member-consulting.jpg'),
    alt:'Black women collaborating around a conference table',
    kicker:'Strategy & expertise',
    description:'Advisors turning professional expertise into strategy, stronger systems and more resilient organizations.'
  },
  Agriculture: {
    image:assetPath('member-agriculture.jpg'),
    alt:'A Black agricultural professional inspecting plants in a greenhouse',
    kicker:'Production & food systems',
    description:'Growers and agribusiness builders strengthening the path from production to market.'
  },
  'Textiles & Apparel': {
    image:assetPath('member-textiles.jpg'),
    alt:'A textile artisan hand-stitching richly detailed fabric',
    kicker:'Design & making',
    description:'Designers and makers bringing heritage, craft and contemporary style into new markets.'
  },
  'Handmade Crafts': {
    image:assetPath('member-crafts.jpg'),
    alt:'A smiling artisan preparing a handmade candle',
    kicker:'Artisan products',
    description:'Skilled hands shaping distinctive products through cultural knowledge and thoughtful design.'
  },
  Training: {
    image:assetPath('member-training.jpg'),
    alt:'A Black facilitator leading a professional training session',
    kicker:'Learning & capacity',
    description:'Facilitators sharing practical knowledge that helps people and enterprises move forward.'
  }
};

function ArrowUpRightIcon(){
  return <svg className="inline-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6 14L14 6M8 6h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function ArrowDownIcon(){
  return <svg className="inline-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 4v11m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

const backgroundAssets = {
  '--belief-background': `url("${assetPath('bg-light.webp')}")`,
  '--textile-background': `url("${assetPath('Royal Purple and Gold Ornamental Textile.png')}")`
} as CSSProperties;

function useScrollEdges(ref:RefObject<HTMLElement|null>){
  const [edges,setEdges]=useState({start:true,end:false});
  useEffect(()=>{
    const track=ref.current;
    if(!track)return;
    const update=()=>{
      const start=track.scrollLeft<=2;
      const end=track.scrollLeft+track.clientWidth>=track.scrollWidth-2;
      setEdges(previous=>previous.start===start&&previous.end===end?previous:{start,end});
    };
    const observer=new ResizeObserver(update);
    observer.observe(track);
    track.addEventListener('scroll',update,{passive:true});
    update();
    return()=>{observer.disconnect();track.removeEventListener('scroll',update)};
  },[ref]);
  return edges;
}

function browseCards(track:HTMLElement|null,direction:number|'start'|'end'){
  if(!track?.firstElementChild)return;
  const step=track.firstElementChild.getBoundingClientRect().width+parseFloat(getComputedStyle(track).columnGap);
  const left=direction==='start'?0:direction==='end'?track.scrollWidth:track.scrollLeft+direction*step;
  track.scrollTo({left,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}

export default function Home(){
  const [reducedMotion,setReducedMotion]=useState<boolean|null>(null);
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setReducedMotion(media.matches);
    update();
    media.addEventListener('change',update);
    return()=>media.removeEventListener('change',update);
  },[]);
  const [beliefPillar,setBeliefPillar]=useState(0);
  const beliefStack=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const stack=beliefStack.current;
    if(!stack)return;
    const cards=Array.from(stack.children);
    const update=()=>stack.style.setProperty('--belief-card-height',`${Math.max(...cards.map(card=>card.getBoundingClientRect().height))}px`);
    const observer=new ResizeObserver(update);
    cards.forEach(card=>observer.observe(card));
    update();
    return()=>observer.disconnect();
  },[]);
  const [menuOpen,setMenuOpen]=useState(false);
  const [activeNav,setActiveNav]=useState<number|null>(null);
  const navHover=useRef(false);
  const navFocus=useRef<string|null>(null);
  const navCloseTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  function cancelNavClose(){if(navCloseTimer.current)clearTimeout(navCloseTimer.current);}
  function openNav(index:number,hover=false){
    cancelNavClose();
    navHover.current=hover;
    setActiveNav(index);
    if(languagePicker.current)languagePicker.current.open=false;
  }
  function backToNavigation(){
    const index=activeNav;
    if(index!==null)navFocus.current=`#nav-trigger-${index}`;
    setActiveNav(null);
  }
  useEffect(()=>{
    if(navFocus.current){document.querySelector<HTMLElement>(navFocus.current)?.focus();navFocus.current=null;}
    else if(menuOpen&&activeNav!==null)header.current?.querySelector<HTMLButtonElement>(`.${styles.navBack}`)?.focus();
  },[activeNav,menuOpen]);
  useEffect(()=>()=>cancelNavClose(),[]);
  useEffect(()=>{
    if(activeNav===null)return;
    const dismiss=(event:KeyboardEvent)=>{if(event.key==='Escape'&&!event.defaultPrevented){cancelNavClose();backToNavigation();}};
    document.addEventListener('keydown',dismiss);
    return()=>document.removeEventListener('keydown',dismiss);
  },[activeNav]);
  const [region,setRegion]=useState<Region>('Africa');
  const [impactMetric,setImpactMetric]=useState(0);
  const [impactHover,setImpactHover]=useState<number|null>(null);
  const impactIndicator=impactHover??impactMetric;
  const impactVisual=useRef<HTMLDivElement>(null);
  const impactInView=useInView(impactVisual,{amount:.2});
  const animateImpact=impactInView&&reducedMotion===false;
  const [scrolled,setScrolled]=useState(false);
  const [navHidden,setNavHidden]=useState(false);
  const [selectedMember,setSelectedMember]=useState<number|null>(null);
  const [activeStory,setActiveStory]=useState(0);
  const [selectedStory,setSelectedStory]=useState<number|null>(null);
  const storyTrack=useRef<HTMLDivElement>(null);
  const storyDialog=useRef<HTMLDialogElement>(null);
  function selectStory(index:number){
    const next=Math.max(0,Math.min(networkStories.length-1,index));
    setActiveStory(next);
    const track=storyTrack.current;
    if(track&&window.matchMedia('(max-width: 760px)').matches){
      track.scrollTo({left:next*(track.clientWidth+16),behavior:reducedMotion?'instant':'smooth'});
    }
  }
  useEffect(()=>{
    const align=()=>{const track=storyTrack.current;if(track)track.scrollTo({left:window.innerWidth<=760?activeStory*(track.clientWidth+16):0,behavior:'instant'});};
    window.addEventListener('resize',align);
    return()=>window.removeEventListener('resize',align);
  },[activeStory]);
  const enterpriseTrack=useRef<HTMLUListElement>(null);
  const enterpriseEdges=useScrollEdges(enterpriseTrack);
  const enterpriseMotion=useRef<ReturnType<typeof animate>|null>(null);
  const enterpriseDestination=useRef(0);
  const enterpriseDrag=useRef<{x:number;left:number;moved:boolean;lastX:number;lastTime:number;velocity:number}|null>(null);
  function stopEnterpriseSlide(){
    enterpriseMotion.current?.stop();
    enterpriseMotion.current=null;
    enterpriseTrack.current?.style.removeProperty('scroll-snap-type');
  }
  function scrollEnterpriseTo(left:number){
    const track=enterpriseTrack.current;
    if(!track)return;
    stopEnterpriseSlide();
    const target=Math.max(0,Math.min(track.scrollWidth-track.clientWidth,left));
    enterpriseDestination.current=target;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){track.scrollTo({left:target,behavior:'instant'});return;}
    track.style.scrollSnapType='none';
    enterpriseMotion.current=animate(track.scrollLeft,target,{duration:1,ease:[.165,.84,.44,1],onUpdate:value=>{track.scrollLeft=value;},onComplete:()=>{enterpriseMotion.current=null;track.style.removeProperty('scroll-snap-type');}});
  }
  function slideEnterprise(direction:number|'start'|'end'){
    const track=enterpriseTrack.current;
    if(!track?.firstElementChild)return;
    const step=track.firstElementChild.getBoundingClientRect().width+parseFloat(getComputedStyle(track).columnGap);
    const current=enterpriseMotion.current?enterpriseDestination.current:track.scrollLeft;
    scrollEnterpriseTo(direction==='start'?0:direction==='end'?track.scrollWidth:(Math.round(current/step)+direction)*step);
  }
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const finish=()=>{if(media.matches&&enterpriseMotion.current){stopEnterpriseSlide();enterpriseTrack.current?.scrollTo({left:enterpriseDestination.current,behavior:'instant'});}};
    window.addEventListener('resize',stopEnterpriseSlide);
    media.addEventListener('change',finish);
    return()=>{stopEnterpriseSlide();window.removeEventListener('resize',stopEnterpriseSlide);media.removeEventListener('change',finish);};
  },[]);
  const memberTrack=useRef<HTMLDivElement>(null);
  const header=useRef<HTMLElement>(null);
  const menuButton=useRef<HTMLButtonElement>(null);
  const languagePicker=useRef<HTMLDetailsElement>(null);
  const profileDialog=useRef<HTMLDialogElement>(null);
  function closeProfile(){
    const dialog=profileDialog.current;
    if(!dialog?.open||dialog.dataset.closing)return;
    if(reducedMotion){dialog.close();return;}
    dialog.dataset.closing='true';
    const exit=dialog.animate([{transform:'translateY(0)',opacity:1},{transform:'translateY(100dvh)',opacity:0}],{duration:260,easing:'cubic-bezier(.4,0,1,1)'});
    exit.finished.then(()=>dialog.close()).catch(()=>{}).finally(()=>{delete dialog.dataset.closing;});
  }
  const membersSection=useRef<HTMLElement>(null);
  const [membersAnimated,setMembersAnimated]=useState(false);
  const [memberScene,setMemberScene]=useState(0);
  const [featuredMember,setFeaturedMember]=useState(0);
  const [portraitsPaused,setPortraitsPaused]=useState(false);
  const memberSceneCount=Math.ceil(memberProfiles.length/portraitPositions.length);
  const visibleMemberCount=Math.min(portraitPositions.length,memberProfiles.length-memberScene*portraitPositions.length);
  const {scrollYProgress:memberProgress}=useScroll({target:membersSection,offset:['start start','end end']});
  const memberSpring=useSpring(memberProgress,{stiffness:100,damping:30,restDelta:.001});
  const memberSpread=useTransform(memberSpring,[.08,.45],[0,1]);
  const memberReveal=useTransform(memberSpring,[.45,.55],[0,1]);
  const memberPointer=useTransform(memberReveal,value=>value>.9?'auto':'none');
  useEffect(()=>{
    if(!membersAnimated||portraitsPaused||selectedMember!==null)return;
    const timer=window.setInterval(()=>{
      const track=memberTrack.current;
      if(!track||document.hidden||memberSpread.get()>.001||track.matches(':hover, :focus-within'))return;
      const bounds=track.getBoundingClientRect();
      const center=bounds.top+bounds.height/2;
      if(center<0||center>window.innerHeight)return;
      setFeaturedMember(index=>(index+1)%visibleMemberCount);
    },3000);
    return()=>window.clearInterval(timer);
  },[membersAnimated,portraitsPaused,selectedMember,memberSpread,visibleMemberCount]);
  useEffect(()=>{
    if(reducedMotion!==false||!('IntersectionObserver' in window))return;
    // Content stays readable before hydration and if motion is unavailable.
    const targets=document.querySelectorAll('#main-content :is(.section-heading > *, #enterprise-cards > li, .program-list > article, #impact-title, #impact-metrics > div, #story-gallery, #join > .shell > :not(.join-grid), .join-grid > a, .footer-grid > div, .footer-bottom)');
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(!entry.isIntersecting)continue;
        (entry.target as HTMLElement).dataset.scrollReveal='visible';
        observer.unobserve(entry.target);
      }
    },{threshold:.08,rootMargin:'0px 0px -24px 0px'});
    targets.forEach(target=>{
      if(!(target as HTMLElement).dataset.scrollReveal)observer.observe(target);
    });
    return()=>observer.disconnect();
  },[reducedMotion]);
  useEffect(()=>{
    const media=window.matchMedia('(min-height: 720px) and (prefers-reduced-motion: no-preference)');
    const update=()=>setMembersAnimated(media.matches);
    update();
    media.addEventListener('change',update);
    return()=>media.removeEventListener('change',update);
  },[]);
  useEffect(()=>{
    let previousY=Math.max(0,window.scrollY);
    const onScroll=()=>{
      const y=Math.max(0,window.scrollY);
      setScrolled(y>24);
      if(y<96){setNavHidden(false);previousY=y;return}
      if(Math.abs(y-previousY)<12)return;
      setNavHidden(y>previousY);
      previousY=y;
    };
    onScroll();
    window.addEventListener('scroll',onScroll,{passive:true});
    return()=>window.removeEventListener('scroll',onScroll);
  },[]);
  useEffect(()=>{
    const desktop=window.matchMedia('(min-width: 960px)');
    const closeOnResize=()=>{setMenuOpen(false);setActiveNav(null);};
    const closeOutside=(event:PointerEvent)=>{
      if(!(event.target instanceof Element))return;
      const insideMenu=desktop.matches
        ? event.target.closest(`.${styles.navTrigger}, .${styles.megaPanel}`)
        : header.current?.contains(event.target);
      if(!insideMenu){cancelNavClose();setMenuOpen(false);setActiveNav(null);}
    };
    desktop.addEventListener('change',closeOnResize);
    document.addEventListener('pointerdown',closeOutside);
    return()=>{
      desktop.removeEventListener('change',closeOnResize);
      document.removeEventListener('pointerdown',closeOutside);
    };
  },[]);
  useEffect(()=>{
    if(!menuOpen)return;
    const previous=document.documentElement.style.overflow;
    document.documentElement.style.overflow='hidden';
    return()=>{document.documentElement.style.overflow=previous;};
  },[menuOpen]);
  useEffect(()=>{
    const closeLanguageOutside=(event:PointerEvent)=>{
      if(languagePicker.current&&event.target instanceof Node&&!languagePicker.current.contains(event.target))languagePicker.current.open=false;
    };
    document.addEventListener('pointerdown',closeLanguageOutside);
    return()=>document.removeEventListener('pointerdown',closeLanguageOutside);
  },[]);
  useEffect(()=>{
    if(selectedMember===null&&selectedStory===null)return;
    const dialog=selectedStory!==null?storyDialog.current:profileDialog.current;
    if(!dialog?.open)dialog?.showModal();
    const previousOverflow=document.documentElement.style.overflow;
    document.documentElement.style.overflow='hidden';
    return()=>{
      document.documentElement.style.overflow=previousOverflow;
      if(dialog?.open)dialog.close();
    };
  },[selectedMember,selectedStory]);
  const close=()=>{cancelNavClose();setMenuOpen(false);setActiveNav(null);if(languagePicker.current)languagePicker.current.open=false};
  return <MotionConfig reducedMotion="user"><div className={styles.page} style={backgroundAssets}>
    <a className={styles.skipLink} href="#main-content">Skip to content</a>
    {(activeNav!==null||menuOpen)&&<div className={styles.navBackdrop} aria-hidden="true" onPointerDown={close}/>}
    <header ref={header} className={styles.header} data-scrolled={scrolled} data-hidden={navHidden&&!menuOpen&&activeNav===null} data-menu-open={menuOpen} data-submenu-open={activeNav!==null}
      onFocusCapture={()=>setNavHidden(false)}
      onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))close()}}
      onKeyDown={event=>{
        if(event.key==='Escape'){if(activeNav!==null){event.preventDefault();cancelNavClose();backToNavigation();}else if(menuOpen){close();menuButton.current?.focus();}}
        if(event.key==='Tab'&&menuOpen){const items=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not(:disabled),summary')).filter(el=>el.getClientRects().length>0&&getComputedStyle(el).visibility==='visible');const first=items[0],last=items.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}
      }}>
      <div className={styles.navShell}>
        <a className={styles.brand} href="#top" aria-label="WisConnect home" onClick={close}><img src={assetPath('logo-nav.webp')} alt="WisConnect" width="480" height="160"/></a>
        <button ref={menuButton} className={styles.menuToggle} type="button" onClick={()=>{if(menuOpen)close();else setMenuOpen(true);}} aria-controls="primary-navigation" aria-expanded={menuOpen} aria-label={menuOpen?'Close navigation':'Open navigation'}><span aria-hidden="true"/><span aria-hidden="true"/></button>
        {activeNav!==null&&<button type="button" className={styles.navBack} onClick={backToNavigation}><ArrowDownIcon/> Back</button>}
        <div id="primary-navigation" className={styles.navPanel} data-open={menuOpen}>
        <nav className={styles.navigation} aria-label="Primary navigation">
          {navigationMenus.map((menu,index)=><div className={styles.navItem} key={menu.label}
            onPointerEnter={cancelNavClose}
            onPointerLeave={event=>{if(event.pointerType==='mouse'&&window.innerWidth>=960){cancelNavClose();navCloseTimer.current=setTimeout(()=>setActiveNav(null),180);}}}>
            <button id={`nav-trigger-${index}`} type="button" className={styles.navTrigger} aria-expanded={activeNav===index} aria-controls={`nav-dropdown-${index}`}
              onPointerEnter={event=>{if(event.pointerType==='mouse'&&window.innerWidth>=960)openNav(index,true);}}
              onClick={()=>{if(activeNav===index&&!navHover.current)setActiveNav(null);else openNav(index);navHover.current=false;}}
              onKeyDown={event=>{
                if(event.key==='ArrowDown'){event.preventDefault();if(activeNav===index)document.querySelector<HTMLAnchorElement>(`#nav-dropdown-${index} a`)?.focus();else{navFocus.current=`#nav-dropdown-${index} a`;openNav(index);}}
                if(window.innerWidth>=960&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?navigationMenus.length-1:(index+(event.key==='ArrowRight'?1:-1)+navigationMenus.length)%navigationMenus.length;openNav(next);document.getElementById(`nav-trigger-${next}`)?.focus();}
              }}>{menu.label}<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.6"/></svg></button>
            <div id={`nav-dropdown-${index}`} className={styles.megaPanel} hidden={activeNav!==index} aria-labelledby={`nav-trigger-${index}`}>
              <div className={styles.megaMain}><div className={styles.megaColumns}>
                {menu.groups.map(group=><div key={group.title}><p>{group.title}</p><ul>{group.links.map(link=><li key={link.label}><Link href={link.href} onClick={close}><strong>{link.label}</strong><span>{link.description}</span></Link></li>)}</ul></div>)}
              </div></div>
              <aside className={styles.megaFeature}><p>Inside WisConnect</p><img src={assetPath(menu.feature.image)} alt="" width="640" height="360"/><strong>{menu.feature.title}</strong><p>{menu.feature.description}</p></aside>
            </div>
          </div>)}
        </nav>
        <details ref={languagePicker} className={styles.languagePicker} onToggle={event=>{if(event.currentTarget.open)setActiveNav(null);}}
          onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))event.currentTarget.open=false}}
          onKeyDown={event=>{if(event.key==='Escape'&&event.currentTarget.open){event.stopPropagation();event.currentTarget.open=false;event.currentTarget.querySelector('summary')?.focus()}}}>
          <summary aria-label="Choose language" className={styles.languageTrigger}>EN / FR <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></summary>
          <div className={styles.languageDropdown}>
            <p>Language</p>
            <button type="button" lang="en" aria-current="true" onClick={()=>{if(languagePicker.current){languagePicker.current.open=false;languagePicker.current.querySelector('summary')?.focus()}}}>English <span>Selected</span></button>
            <button type="button" lang="fr" disabled>Français <span lang="en">Awaiting translation</span></button>
            <Link className={styles.contentLink} href="#languages" onClick={close}>Language availability</Link>
          </div>
        </details>
        <div className={styles.mobileNavActions}><Link href="/join" onClick={close}>Join the cooperative <ArrowUpRightIcon/></Link><Link href="/contact" onClick={close}>Contact us</Link></div>
        </div>
        <Link className={styles.navContact} href="/contact" onClick={close}>Contact</Link>
        <Link className={styles.navJoin} href="/join" onClick={close}>Join us <ArrowUpRightIcon/></Link>
      </div>
    </header>

    <main id="main-content" tabIndex={-1} inert={menuOpen}>
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className="hero-textile-ribbon" aria-hidden="true"/>
      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <p className={styles.identity}>Black Women Business Development<br/>&amp; Resource Center</p>
          <h1 id="hero-title">Build your business.<br/><em>Share in <br/>what grows.</em></h1>
          <p className={styles.heroLede}>A cooperative connecting women entrepreneurs to shared ownership, business opportunity, and each other.</p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryAction} href="/join">Join the Cooperative <ArrowUpRightIcon/></Link>
            <a className={styles.secondaryAction} href="#about">Discover WisConnect <ArrowDownIcon/></a>
          </div>
        </div>
        <div className={styles.heroArt}>
          <span className={styles.heroThread} aria-hidden="true"/>
          <img className={styles.heroPortrait} src={assetPath('hero-visionary-960.webp')} srcSet={`${assetPath('hero-visionary-640.webp')} 640w, ${assetPath('hero-visionary-960.webp')} 960w`} sizes="(max-width: 699px) 90vw, 50vw" width="1122" height="1402" fetchPriority="high" alt="Portrait of a woman in a purple and gold headwrap, looking ahead"/>
        </div>
      </div>
      <div className={styles.heroFoot}>
        <p>People. Capital. Communities.</p>
        <a href="#members">Meet the women behind WisConnect <ArrowDownIcon/></a>
      </div>
    </section>

    <section id="purpose" className={`section ${styles.contentSection}`} aria-labelledby="purpose-title"><div className="shell">
      <div className="section-heading split-heading"><div><p className="eyebrow">Purpose & identity</p><h2 id="purpose-title">Why we come together.</h2></div><p>A place for Black women’s enterprise, knowledge and ambition to shape a shared future.</p></div>
      <p className={styles.contentNote}>Draft direction for review. WisConnect’s official mission, vision, values and organizational history await approval.</p>
      <div className={styles.contentGrid}>
        <article><span className={styles.contentLabel}>Mission · Draft</span><h3>Build opportunity together.</h3><p>Connect Black women business owners through shared knowledge, relationships and cooperative opportunity.</p></article>
        <article><span className={styles.contentLabel}>Vision · Draft</span><h3>Prosperity with local roots.</h3><p>A future where women’s businesses strengthen their communities and connections across the diaspora widen what is possible.</p></article>
        <article><span className={styles.contentLabel}>Values · Draft</span><h3>People. Ownership. Contribution.</h3><p>Shared ownership, the exchange of experience and value that stays close to communities guide this proposed direction.</p></article>
      </div>
      <details className={styles.contentDetails}><summary>Why Black women-owned businesses?</summary><p>Draft perspective: a shared space can make women’s expertise, cultural knowledge and business ambitions more visible, while creating room to exchange support on their own terms. WisConnect will confirm the public wording and the experiences behind this focus.</p></details>
    </div></section>

    <section id="about" className={styles.beliefSection} aria-labelledby="belief-title"><div id="cooperative" ref={beliefStack} className={`shell ${styles.beliefStack}`}>
      <div className={styles.beliefCard} data-pillar="people">
        <div className={styles.beliefCopy}>
          <div>
            <p className={styles.beliefEyebrow}><span>People · The belief behind the cooperative</span></p>
            <h2 id="belief-title">When women own,<span>communities grow.</span></h2>
            <p className={styles.beliefDescription}>Ownership creates opportunity. Opportunity strengthens communities. We bring people, capital and shared ambition together to build something that belongs to all of us.</p>
          </div>
          <div className={styles.beliefBottom}>
            <div className={styles.beliefChoices} role="group" aria-label="Explore our cooperative belief">
              {beliefPillars.map((pillar,index)=><button key={pillar.label} type="button" aria-pressed={beliefPillar===index} aria-controls="belief-detail" onClick={()=>setBeliefPillar(index)}><span aria-hidden="true">0{index+1}</span>{pillar.label}</button>)}
            </div>
            <div id="belief-detail" className={styles.beliefDetail} aria-live="polite" aria-atomic="true"><p><strong>{beliefPillars[beliefPillar].title}</strong> {beliefPillars[beliefPillar].description}</p></div>
            <div className={styles.beliefActions}><Link href="/join">Find your place <ArrowUpRightIcon/></Link><a href="#belief-capital">Explore the cooperative <ArrowUpRightIcon/></a></div>
          </div>
        </div>
        <figure className={styles.beliefVisual}>
          <img src={assetPath('belief-orange-1080.webp')} srcSet={`${assetPath('belief-orange-640.webp')} 640w, ${assetPath('belief-orange-1080.webp')} 1080w`} sizes="(max-width: 760px) 90vw, 45vw" width="1086" height="1448" loading="lazy" decoding="async" alt="Confident woman wearing an orange blazer with her arms crossed"/>
        </figure>
      </div>
      {cooperativeCards.map(card=><article key={card.id} id={`belief-${card.id}`} className={styles.beliefCard} data-pillar={card.id} aria-labelledby={`belief-${card.id}-title`}>
        <div className={styles.beliefCopy}>
          <div>
            <p className={styles.beliefEyebrow}><span>{card.step} · {card.label}</span></p>
            <h3 id={`belief-${card.id}-title`}>{card.heading}<span>{card.accent}</span></h3>
            <p className={styles.beliefDescription}>{card.description}</p>
          </div>
          <div className={styles.beliefBottom}>
            <div className={styles.beliefDetail}><p><strong>{card.detail}</strong></p></div>
            <div className={styles.beliefActions}><Link href="/join">Find your place <ArrowUpRightIcon/></Link><a href={card.id==='capital'?'#belief-communities':'#businesses'}>{card.id==='capital'?'Explore communities':'Explore member enterprises'} <ArrowUpRightIcon/></a></div>
          </div>
        </div>
        <figure className={styles.beliefVisual}><img src={assetPath(card.image)} loading="lazy" decoding="async" alt={card.alt}/></figure>
      </article>)}
    </div></section>

    <section id="members" ref={membersSection} className={styles.members} data-animated={membersAnimated} data-profile-open={selectedMember!==null} aria-labelledby="members-title">
      <motion.div className={styles.memberStage} style={{'--member-spread':memberSpread,'--member-reveal':memberReveal,'--member-pointer':memberPointer} as MotionStyle}>
        <svg className={styles.memberThreads} viewBox="0 0 1600 1000" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
          {Array.from({length:24},(_,i)=><path key={i} d={`M-100 ${i*55-130} C430 ${i*30+90} 940 ${i*13+345} 1260 535 S1510 ${i*34+150} 1700 ${i*39+50}`} stroke={i%5===0?'#b99561':'#7b5aa6'} strokeWidth="1"/>)}
        </svg>
        <div className={styles.membersHeading}>
          <p className="eyebrow">Meet the visionaries</p>
          <h2 id="members-title">Individual strengths.<br/><em>A shared vision.</em></h2>
          <p className={styles.memberLede}>Meet the women bringing legal, business, and entrepreneurial experience to the cooperative.</p>
          <div className={styles.memberActions}>
            <Link className={styles.memberJoin} href="/join">Join the cooperative <ArrowUpRightIcon/></Link>
            <Link className={`${styles.memberJoin} ${styles.memberContact}`} href="/contact">Contact <ArrowUpRightIcon/></Link>
          </div>
          <p className={styles.memberHint}>Select a portrait to meet her.</p>
          {memberSceneCount>1&&<div className={styles.memberScenes} aria-label="More visionaries">
            <button type="button" aria-label="Previous visionaries" disabled={memberScene===0} onClick={()=>setMemberScene(scene=>scene-1)}>←</button>
            <span aria-live="polite">{memberScene+1} / {memberSceneCount}</span>
            <button type="button" aria-label="Next visionaries" disabled={memberScene===memberSceneCount-1} onClick={()=>setMemberScene(scene=>scene+1)}>→</button>
          </div>}
        </div>
        <div id="member-cards" ref={memberTrack} className={styles.memberGrid} role="group" aria-label="Visionary profiles" onKeyDown={event=>{
          if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
          event.preventDefault();
          const cards=Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not([hidden])'));
          const index=cards.indexOf(document.activeElement as HTMLButtonElement);
          const next=event.key==='Home'?0:event.key==='End'?cards.length-1:Math.max(0,Math.min(cards.length-1,index+(event.key==='ArrowLeft'?-1:1)));
          cards[next]?.focus({preventScroll:true});
        }}>
          {memberProfiles.map((member,index)=>{
            const slot=portraitPositions[index%portraitPositions.length];
            return <button type="button" className={styles.memberCard} hidden={Math.floor(index/portraitPositions.length)!==memberScene} data-slot={index%portraitPositions.length} data-featured={index%portraitPositions.length===featuredMember%visibleMemberCount} style={{'--portrait-x':slot.x,'--portrait-y':slot.y,'--portrait-scale':slot.scale} as CSSProperties} key={member.name} onClick={event=>{event.currentTarget.focus({preventScroll:true});setSelectedMember(index);}} aria-label={`View profile for ${member.name}`} aria-haspopup="dialog">
              <img src={assetPath(`${member.image}-studio-480.webp`)} srcSet={`${assetPath(`${member.image}-studio-480.webp`)} 480w, ${assetPath(`${member.image}-studio-800.webp`)} 800w`} sizes="(max-width: 699px) 30vw, (max-width: 1279px) 22vw, 280px" alt="" width="800" height="800" loading="lazy" decoding="async"/>
              <span className={styles.memberInfo}><strong>{member.name}</strong><span>View profile ↗</span></span>
            </button>;
          })}
        </div>
        {membersAnimated&&<button className={styles.portraitPlayback} type="button" aria-controls="member-cards" aria-pressed={portraitsPaused} onClick={()=>setPortraitsPaused(paused=>!paused)}>{portraitsPaused?'Resume portraits':'Pause portraits'}</button>}
      </motion.div>
    </section>

    <dialog className={`${styles.profileDialog} ${styles.visionarySheet}`} ref={profileDialog} aria-labelledby="profile-name" aria-describedby="profile-role" onClose={()=>setSelectedMember(null)} onCancel={event=>{event.preventDefault();closeProfile();}} onClick={event=>{
      if(event.target!==event.currentTarget)return;
      const bounds=event.currentTarget.getBoundingClientRect();
      if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)closeProfile();
    }}>
      {selectedMember!==null&&<>
        <div className={styles.sheetToolbar}><span className={styles.sheetHandle} aria-hidden="true"/><button className={styles.sheetClose} type="button" onClick={closeProfile} aria-label="Close profile" autoFocus><span aria-hidden="true">×</span></button></div>
        <div className={styles.sheetGrid}>
          <div className={styles.sheetIntro}><p className="eyebrow">Meet the visionaries · {String(selectedMember+1).padStart(2,'0')} / {String(memberProfiles.length).padStart(2,'0')}</p><h2 id="profile-name">{memberProfiles[selectedMember].name}</h2><p id="profile-role" className={styles.sheetRole}>{memberProfiles[selectedMember].role}</p></div>
          <img className={styles.sheetPortrait} src={assetPath(`${memberProfiles[selectedMember].image}-studio-800.webp`)} alt={`Portrait of ${memberProfiles[selectedMember].name}`} width="800" height="800"/>
          <div className={styles.sheetBio}><p>{memberProfiles[selectedMember].bio}</p><ul aria-label="Areas of expertise">{memberProfiles[selectedMember].expertise.map(item=><li key={item}>{item}</li>)}</ul><Link className={styles.sheetAction} href="/join">Find your place in the cooperative <ArrowUpRightIcon/></Link></div>
        </div>
      </>}
    </dialog>

    <section id="member-directory" className={`section ${styles.contentSection}`} aria-labelledby="directory-title"><div className="shell">
      <div className="section-heading split-heading"><div><p className="eyebrow">Member directory</p><h2 id="directory-title">Get to know what we bring.</h2></div><p>Explore the profiles already featured above. The full member register, locations and preferred contact links await publication approval.</p></div>
      <ul className={styles.directoryList}>
        {memberProfiles.map((member,index)=><li key={member.name}><div><h3>{member.name}</h3><p>{member.bio}</p><p><strong>Expertise:</strong> {member.expertise.join(' · ')}</p><p className={styles.contentNote}>Location & direct contact: awaiting approval.</p></div><button type="button" className={styles.storyRead} aria-label={`Read biography for ${member.name}`} aria-haspopup="dialog" onClick={event=>{event.currentTarget.focus({preventScroll:true});setSelectedMember(index);}}>View profile <ArrowUpRightIcon/></button></li>)}
      </ul>
      <Link className={styles.contentLink} href="/contact">Ask WisConnect about an introduction <ArrowUpRightIcon/></Link>
    </div></section>

    <section id="businesses" className={`section ${styles.enterprises}`} aria-labelledby="enterprises-title"><div className="shell"><div className="section-heading split-heading"><div><p className="eyebrow">Business sectors · Preview</p><h2 id="enterprises-title">Built by members. Backed by the cooperative.</h2></div><p>Across six practical sectors, members are turning professional skill, cultural knowledge and local resources into enterprises with room to grow.</p></div>
      <p className={styles.contentNote}>Illustrative sector descriptions and photographs. Approved business listings appear in the directory below.</p>
      <div className={styles.enterpriseControls}>
        <p>Explore our six sectors</p>
        <button type="button" aria-label="Previous enterprise" aria-controls="enterprise-cards" disabled={enterpriseEdges.start} onClick={()=>slideEnterprise(-1)}><ArrowDownIcon/></button>
        <button type="button" aria-label="Next enterprise" aria-controls="enterprise-cards" disabled={enterpriseEdges.end} onClick={()=>slideEnterprise(1)}><ArrowDownIcon/></button>
      </div>
      <ul id="enterprise-cards" ref={enterpriseTrack} className={styles.enterpriseTrack} tabIndex={0} aria-label="Member enterprise sectors, scroll to browse"
        onWheel={stopEnterpriseSlide}
        onPointerDown={event=>{
          stopEnterpriseSlide();
          enterpriseDrag.current=null;
          if(event.pointerType==='mouse'&&event.button===0)enterpriseDrag.current={x:event.clientX,left:event.currentTarget.scrollLeft,moved:false,lastX:event.clientX,lastTime:performance.now(),velocity:0};
        }}
        onPointerMove={event=>{
          const drag=enterpriseDrag.current;
          if(!drag||event.buttons!==1)return;
          const distance=event.clientX-drag.x;
          if(!drag.moved&&Math.abs(distance)<6)return;
          drag.moved=true;
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.dataset.dragging='true';
          event.currentTarget.style.scrollSnapType='none';
          const now=performance.now();
          drag.velocity=(event.clientX-drag.lastX)/Math.max(1,now-drag.lastTime);
          drag.lastX=event.clientX;drag.lastTime=now;
          event.currentTarget.scrollLeft=drag.left-distance;
        }}
        onPointerUp={event=>{
          const drag=enterpriseDrag.current;
          if(!drag?.moved)return;
          delete event.currentTarget.dataset.dragging;
          const step=event.currentTarget.firstElementChild!.getBoundingClientRect().width+parseFloat(getComputedStyle(event.currentTarget).columnGap);
          const momentum=performance.now()-drag.lastTime<100?Math.max(-step,Math.min(step,drag.velocity*180)):0;
          scrollEnterpriseTo(Math.round((event.currentTarget.scrollLeft-momentum)/step)*step);
        }}
        onPointerCancel={event=>{enterpriseDrag.current=null;delete event.currentTarget.dataset.dragging;stopEnterpriseSlide();}}
        onClickCapture={event=>{if(enterpriseDrag.current?.moved){event.preventDefault();event.stopPropagation();enterpriseDrag.current=null;}}}
        onDragStart={event=>event.preventDefault()}
        onKeyDown={event=>{
          enterpriseDrag.current=null;
          if(event.target!==event.currentTarget)return;
          if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();slideEnterprise(event.key==='ArrowLeft'?-1:1)}
          if(event.key==='Home'||event.key==='End'){event.preventDefault();slideEnterprise(event.key==='Home'?'start':'end')}
        }}>
        {sectors.map((sector,index)=><li id={`enterprise-${index}`} className={styles.enterpriseCard} key={sector}>
          <Link className={styles.enterpriseLink} href="/join" aria-label={`Explore membership in ${sector}`}>
            <div className={styles.enterpriseImage}><img src={sectorStories[sector].image} alt={sectorStories[sector].alt} loading="lazy" draggable={false}/><h3>{sector}</h3></div>
            <p>{sectorStories[sector].description}</p>
            <span className={styles.enterpriseCta}>Explore membership <ArrowDownIcon/></span>
          </Link>
        </li>)}
      </ul>
    </div></section>

    <section id="business-directory" className={`section ${styles.contentSection}`} aria-labelledby="business-directory-title"><div className="shell">
      <div className="section-heading split-heading"><div><p className="eyebrow">Business directory</p><h2 id="business-directory-title">Discover member-owned businesses.</h2></div><p>Meet the enterprises behind the cooperative, with approved details and a direct way to connect.</p></div>
      <div className={styles.emptyContent}><h3>Listings awaiting approval.</h3><p>No business listings are published here yet. Each listing will include the business and owner’s name, sector, description, approved photo or logo, and contact link.</p><p>This directory introduces businesses. Purchases and payments are not available on this website.</p><Link className={styles.contentLink} href="/contact">Ask about listing your business <ArrowUpRightIcon/></Link></div>
    </div></section>

    <section id="what-we-do" className="section what-section"><div className="shell"><div className="section-heading split-heading"><div><p className="eyebrow">What WisConnect does</p><h2>Turn shared ownership into shared progress.</h2></div><p>WisConnect connects members to the resources, relationships and practical support that help enterprises grow.</p></div><p className={styles.contentNote}>Service direction for review. Availability, eligibility and named programs are still to be confirmed.</p><div className="program-list">
      <article><span>01</span><div><h3>Put ownership in members’ hands</h3><p>Give members a voice in the cooperative and a stake in the value they help create.</p></div></article>
      <article><span>02</span><div><h3>Open doors to capital and opportunity</h3><p>Connect entrepreneurs with funding pathways, trusted partners and opportunities to move forward.</p></div></article>
      <article><span>03</span><div><h3>Help member businesses grow</h3><p>Bring practical learning, visibility and business support closer to the needs of each enterprise.</p></div></article>
      <article><span>04</span><div><h3>Keep value moving through communities</h3><p>Link business growth to stronger local networks, livelihoods and opportunity that stays in the community.</p></div></article>
    </div></div></section>

    <section id="programs" className={`section ${styles.contentSection}`} aria-labelledby="programs-title"><div className="shell">
      <div className="section-heading split-heading"><div><p className="eyebrow">Programs & activities</p><h2 id="programs-title">Ways to learn. Reasons to connect.</h2></div><p>Ideas raised for regular engagement with Black women business owners. These activities are proposed; no schedule or registration is confirmed.</p></div>
      <div className={styles.contentGrid}>
        <article><span className={styles.contentLabel}>Proposed</span><h3>Webinars</h3><p>Conversations around members’ questions and experience. Topics, presenters and frequency await the team’s decision.</p></article>
        <article><span className={styles.contentLabel}>Proposed</span><h3>Tutorials</h3><p>Practical learning led by shared expertise. Content, format and contributors are still to be agreed.</p></article>
        <article><span className={styles.contentLabel}>Proposed</span><h3>Coffee meetings</h3><p>Space for introductions and regular exchange. Hosts, locations and meeting frequency are still to be agreed.</p></article>
      </div><a className={styles.contentLink} href="#events">See the events calendar <ArrowDownIcon/></a>
    </div></section>

    <section id="resources" className={`section ${styles.contentSection}`} aria-labelledby="resources-title"><div className="shell">
      <div className="section-heading"><p className="eyebrow">Resources & videos</p><h2 id="resources-title">Knowledge to share.</h2></div>
      <div className={styles.contentGrid}>
        <article><span className={styles.contentLabel}>Awaiting content</span><h3>Guides & learning materials</h3><p>Approved resources, authors and accessible download links will be listed here when supplied.</p></article>
        <article><span className={styles.contentLabel}>Awaiting content</span><h3>Watch & listen</h3><p>Member conversations and approved videos will appear here with captions or transcripts. No videos are published yet.</p></article>
      </div><Link className={styles.contentLink} href="/contact">Suggest a resource <ArrowUpRightIcon/></Link>
    </div></section>

    <section id="community-work" className={`section ${styles.contentSection}`} aria-labelledby="community-title"><div className="shell">
      <div className="section-heading split-heading"><div><p className="eyebrow">Community work</p><h2 id="community-title">What each of us can contribute.</h2></div><p>Skills, mentorship, local knowledge and relationships can all be part of a member’s contribution.</p></div>
      <div className={styles.emptyContent}><h3>Community initiatives awaiting approval.</h3><p>We are making space for members to describe their work, why it matters, the people involved and the contributions behind it. Project details and outcomes will be shared after verification and publication consent.</p><Link className={styles.contentLink} href="/join">Tell us what you would like to contribute <ArrowUpRightIcon/></Link></div>
    </div></section>

    <section id="impact" className={styles.impact} aria-labelledby="impact-title">
      <div className={styles.impactFrame}>
        <div className={styles.impactHeading}>
          <p className="eyebrow">Impact & proof</p>
          <h2 id="impact-title">The power of<br/><em>shared ownership.</em></h2>
        </div>
        <dl id="impact-metrics" className={styles.impactMetrics} aria-describedby="impact-note" style={{'--metric-index':impactIndicator,'--metric-column':impactIndicator%2,'--metric-row':Math.floor(impactIndicator/2)} as CSSProperties} onPointerLeave={()=>setImpactHover(null)}>
          {['Members','Member businesses','Projects & programs','Community outcomes'].map((label,index)=><div key={label} data-active={impactMetric===index} onPointerEnter={event=>{if(event.pointerType==='mouse')setImpactHover(index);}}>
            <dt id={`impact-label-${index}`}>{label}</dt><dd aria-label="Awaiting verification"><button type="button" aria-label={`${label}: awaiting verification`} aria-pressed={impactMetric===index} aria-controls="impact-map" onFocus={()=>setImpactHover(index)} onBlur={()=>setImpactHover(null)} onClick={()=>setImpactMetric(index)}><span aria-hidden="true">—</span></button></dd>
          </div>)}
        </dl>
        <p id="impact-note" className={styles.impactNote}>Awaiting verification. Member totals, business totals, project activity and community outcomes will be published with sources and reporting dates once approved.</p>
        <div id="global-reach" ref={impactVisual} className={styles.impactVisual}>
          <h3 className={styles.connectionTitle}>Local roots. Diaspora connections.</h3>
          <p className={styles.connectionCopy}>Draft perspective: connections between Black women business owners in Africa and the diaspora can create space to exchange skills, cultural knowledge and business relationships. Members’ own experiences will help tell that story.</p>
          <div className={styles.impactMapIntro}><span className="eyebrow">Local roots. Shared possibilities.</span><span>Connection vision · locations and partnerships await confirmation.</span></div>
          <svg id="impact-map" className={styles.impactMap} viewBox="0 0 1000 440" fill="none" aria-hidden="true" focusable="false">
            <image href={assetPath('impact-world.svg')} width="1000" height="440"/>
            {impactPlaces.filter(place=>place.route).map(place=><g key={place.region} className={styles.impactRoute} data-active={region==='Africa'||region===place.region}>
              <path d={place.route} stroke="currentColor" strokeOpacity=".18"/>
              <motion.path key={`${impactMetric}-${region}`} d={place.route} stroke="currentColor" strokeWidth="2" strokeLinecap="round" initial={false} animate={{pathLength:animateImpact?[0,1]:1}} transition={{duration:animateImpact?1.4:0,ease:'easeOut'}}/>
            </g>)}
            {impactPlaces.map((place,index)=><g key={place.region} className={styles.impactPin} data-active={region===place.region}>
              <circle cx={place.x} cy={place.y} r="15" fill="currentColor" opacity=".12"/>
              <motion.circle cx={place.x} cy={place.y} r="15" opacity=".35" stroke="currentColor" strokeWidth="1.5" initial={false} animate={{r:animateImpact?[6,28]:15,opacity:animateImpact?[.7,0]:.35}} transition={{duration:animateImpact?2.4:0,repeat:animateImpact?Infinity:0,delay:animateImpact?index*.35:0,ease:'easeOut'}}/>
              <circle cx={place.x} cy={place.y} r="7" fill="currentColor" stroke="#fff" strokeWidth="2"/>
              <text x={place.x} y={place.y+32} textAnchor="middle" fill="currentColor">{place.label}</text>
            </g>)}
          </svg>
          <div className={styles.impactRegions} role="group" aria-label="Countries in the connection vision">
            {impactPlaces.map(place=><button key={place.region} type="button" aria-pressed={region===place.region} aria-controls="impact-region-detail" onClick={()=>setRegion(place.region)}>{place.label}</button>)}
          </div>
          <p id="impact-region-detail" className={styles.impactRegionDetail} aria-live="polite">{regions[region]}</p>
        </div>
      </div>
    </section>

    <section id="stories" className="section stories-section" aria-labelledby="stories-title"><div className="shell">
      <div className={styles.storiesHeader}>
        <div><p className="eyebrow">Stories from the network</p><h2 id="stories-title">Good things grow together.</h2><p>People, ideas and everyday work behind a shared future. Member stories will explore what motivates the work, the talents and assets people bring, and the impact of their contributions.</p></div>
        <div className={styles.enterpriseControls} role="group" aria-label="Story navigation">
          <span className={styles.storyCount}>0{activeStory+1} <span>/ 04</span></span>
          <button type="button" aria-label="Previous story" aria-controls="story-gallery" disabled={activeStory===0} onClick={()=>selectStory(activeStory-1)}><ArrowDownIcon/></button>
          <button type="button" aria-label="Next story" aria-controls="story-gallery" disabled={activeStory===networkStories.length-1} onClick={()=>selectStory(activeStory+1)}><ArrowDownIcon/></button>
        </div>
      </div>
      <div id="story-gallery" ref={storyTrack} className={styles.storyGallery} role="group" aria-label="Choose a story"
        onScrollEnd={event=>{const track=event.currentTarget;if(track.scrollWidth>track.clientWidth)setActiveStory(Math.round(track.scrollLeft/(track.clientWidth+16)))}}
        onKeyDown={event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?networkStories.length-1:Math.max(0,Math.min(networkStories.length-1,activeStory+(event.key==='ArrowRight'?1:-1)));selectStory(next);(storyTrack.current?.children[next] as HTMLElement)?.focus({preventScroll:true});}}>
        {networkStories.map((story,index)=><button key={story.image} type="button" className={styles.storyCard} aria-label={`${story.category}: ${story.title}`} aria-pressed={activeStory===index} aria-controls="story-detail" style={{'--story-position':story.position} as CSSProperties} onClick={()=>selectStory(index)}>
          <img src={assetPath(`story-${story.image}-1400.webp`)} srcSet={`${assetPath(`story-${story.image}-640.webp`)} 640w, ${assetPath(`story-${story.image}-1400.webp`)} 1400w`} sizes="(max-width: 760px) 90vw, 65vw" alt={story.alt} loading="lazy" decoding="async" width="1400" height="1000"/>
          <span className={styles.storyNumber} aria-hidden="true">0{index+1}</span>
          <span className={styles.storyOverlay} aria-hidden="true"><span>{story.category}</span><strong>{story.title}</strong></span>
        </button>)}
      </div>
      <div id="story-detail" className={styles.storyDetail}>
        <div aria-live="polite" aria-atomic="true"><motion.p key={activeStory} initial={reducedMotion?false:{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.3}}><strong>{networkStories[activeStory].title}</strong> {networkStories[activeStory].description}</motion.p></div>
        <button type="button" className={styles.storyRead} onClick={()=>setSelectedStory(activeStory)} aria-haspopup="dialog">Read the story <ArrowUpRightIcon/></button>
      </div>
      <p className={styles.storyNote}>From the WisConnect perspective · Editorial previews with stock photography</p>
    </div></section>
    <dialog ref={storyDialog} className={styles.profileDialog} aria-labelledby="story-dialog-title" onClose={()=>setSelectedStory(null)}>
      {selectedStory!==null&&<>
        <div className={styles.dialogToolbar}><span>Stories from the network</span><button type="button" className={styles.dialogClose} onClick={()=>storyDialog.current?.close()} autoFocus>Close <span aria-hidden="true">×</span></button></div>
        <img className={styles.storyDialogImage} src={assetPath(`story-${networkStories[selectedStory].image}-1400.webp`)} alt={networkStories[selectedStory].alt}/>
        <article className={`${styles.dialogContent} ${styles.storyArticle}`}><p className="eyebrow">{networkStories[selectedStory].category}</p><h2 id="story-dialog-title">{networkStories[selectedStory].title}</h2>
          {networkStories[selectedStory].paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}
          <p className={styles.storyCredit}>Editorial preview exploring our cooperative vision. Stock photograph by <a href={networkStories[selectedStory].source} target="_blank" rel="noreferrer">{networkStories[selectedStory].credit} / Pexels</a>; people pictured are not identified as WisConnect members.</p>
        </article>
      </>}
    </dialog>

    <section id="news" className={`section ${styles.contentSection}`} aria-labelledby="news-title"><div className="shell">
      <div className="section-heading"><p className="eyebrow">News & announcements</p><h2 id="news-title">From the cooperative.</h2></div>
      <div className={styles.emptyContent}><h3>No approved updates yet.</h3><p>News, announcements and community updates will appear here with publication dates. WisConnect is confirming who supplies and approves regular updates.</p></div>
    </div></section>

    <section id="events" className={`section ${styles.contentSection}`} aria-labelledby="events-title"><div className="shell">
      <div className="section-heading split-heading"><div><p className="eyebrow">Events calendar</p><h2 id="events-title">Come into the conversation.</h2></div><p>Find dates, details, locations or online links, and registration information for confirmed gatherings.</p></div>
      <div className={styles.emptyContent}><h3>No confirmed events to display.</h3><p>Dates and RSVP links will be added when approved. Proposed webinars, tutorials and coffee meetings are not scheduled events.</p><Link className={styles.contentLink} href="/contact">Ask about upcoming gatherings <ArrowUpRightIcon/></Link></div>
    </div></section>

    <section id="gallery" className={`section ${styles.contentSection}`} aria-labelledby="gallery-title"><div className="shell">
      <div className="section-heading split-heading"><div><p className="eyebrow">Photo gallery</p><h2 id="gallery-title">Life in the network.</h2></div><p>A home for approved member, event, program and community photographs. Images, captions, credits and publication permissions are still to come.</p></div>
      <div className={styles.contentGrid}>{['Members & their work','Events & programs','Community moments'].map(label=><figure className={styles.galleryPlaceholder} key={label}><div aria-hidden="true">Photo to come</div><figcaption><strong>{label}</strong><span>Awaiting approved photography</span></figcaption></figure>)}</div>
    </div></section>

    <section id="faq" className={`section ${styles.contentSection}`} aria-labelledby="faq-title"><div className="shell">
      <div className="section-heading"><p className="eyebrow">Frequently asked questions</p><h2 id="faq-title">Before you take the next step.</h2></div>
      <details className={styles.contentDetails}><summary>How do I express interest in membership?</summary><p>Use the <Link href="/join">membership form</Link> to introduce yourself, your location, experience and what you would like to contribute. It prepares an email for you to review and send. Membership eligibility, fees, location-specific requirements and review timing still need confirmation.</p></details>
      <details className={styles.contentDetails}><summary>Does completing the form make me a member?</summary><p>No. Completing the form does not grant membership. Nothing is sent until you send the draft from your email app. WisConnect is confirming whether this introduction will serve as the formal application and how the review process will work.</p></details>
      <details className={styles.contentDetails}><summary>Are programs and events open for registration?</summary><p>No confirmed program schedule or event registration is listed yet. Webinars, tutorials and coffee meetings are proposals. Confirmed opportunities will appear in the <a href="#events">events calendar</a>.</p></details>
      <details className={styles.contentDetails}><summary>Can I buy from businesses here?</summary><p>The <a href="#business-directory">business directory</a> is for discovering and contacting member-owned businesses. This website does not offer checkout or online dues payments.</p></details>
      <details className={styles.contentDetails}><summary>Can my profile or story be featured?</summary><p><Link href="/contact">Contact WisConnect</Link> about contributing a biography, business listing, story or photograph. Names, images and contact information need the person’s publication permission and content approval.</p></details>
      <details id="languages" className={styles.contentDetails}><summary>Is the website available in French?</summary><p>English is available now. French content is awaiting translation, review and an agreed launch date.</p><p lang="fr">La version française est en préparation. La date de publication reste à confirmer.</p></details>
    </div></section>

    <section id="join" className="section join-section"><div className="shell"><p className="eyebrow">Participation</p><h2>Ownership is stronger<br/>when it’s shared.</h2><p className="join-lede">Bring your experience, explore the network or start a conversation.</p><div className="join-grid"><Link href="/join"><span>01 · Membership</span><strong>Become a Member</strong><p>Learn about membership and apply.</p><b><ArrowUpRightIcon/></b></Link><a href="mailto:hello@wisconnect.co?subject=Partnership%20Interest"><span>02 · Partnership</span><strong>Partner with WisConnect</strong><p>Explore institutional collaboration.</p><b><ArrowUpRightIcon/></b></a><a href="#business-directory"><span>03 · Business</span><strong>Discover Member Businesses</strong><p>Explore the people and enterprises.</p><b><ArrowUpRightIcon/></b></a></div></div></section>

    <section id="contact-info" className={`section ${styles.contentSection}`} aria-labelledby="contact-info-title"><div className="shell">
      <div className="section-heading split-heading"><div><p className="eyebrow">Contact & connect</p><h2 id="contact-info-title">Start with a conversation.</h2></div><p>Use the contact form to prepare an email about membership, partnerships, business listings or a general question.</p></div>
      <div className={styles.contentGrid}><article><h3>Write to WisConnect</h3><Link className={styles.contentLink} href="/contact">Open the contact form <ArrowUpRightIcon/></Link><a className={styles.contentLink} href="mailto:hello@wisconnect.co">hello@wisconnect.co</a><p>The receiving inbox and acknowledgement process await final confirmation.</p></article><article><h3>Locations & social channels</h3><p>Approved office or service-area details and official social links are awaiting confirmation. The map above illustrates a connection vision.</p></article></div>
    </div></section>

    <section id="privacy" className={`section ${styles.contentSection}`} aria-labelledby="privacy-title"><div className="shell">
      <div className="section-heading"><p className="eyebrow">Privacy & form information</p><h2 id="privacy-title">Before you share your details.</h2></div>
      <div className={styles.emptyContent}><h3>How these forms work today</h3><p>The Contact and Join forms hold your answers in the current tab while you complete the steps. They prepare an email draft; they do not save a submission to a website database. You decide whether to send it in your email app. Copying a message places its text on your clipboard.</p><p>Contact asks for your name, email, country, optional organization, topic and message. Join asks for your name, email, location, experience and proposed contribution. Please include only what is needed for your inquiry.</p><h3>Privacy policy awaiting approval</h3><p>WisConnect still needs to supply its approved policy, responsible organization and privacy contact, how received messages are used and retained, who can access them, and how people can request changes or deletion. This form information is not the final privacy policy.</p><Link className={styles.contentLink} href="/contact">Ask a privacy question <ArrowUpRightIcon/></Link></div>
    </div></section>

    <footer className="site-footer"><div className="shell footer-grid"><div className="footer-brand"><img src={assetPath('logo-horizontal.webp')} alt="WisConnect"/><p>People · Capital · Communities · A Brighter Tomorrow</p></div><div><strong>Explore</strong><a href="#purpose">Purpose & values</a><a href="#about">Cooperative model</a><a href="#member-directory">Member directory</a><a href="#business-directory">Business directory</a><a href="#impact">Impact & connections</a></div><div><strong>Learn & take part</strong><a href="#programs">Programs</a><a href="#resources">Resources</a><a href="#community-work">Community work</a><a href="#events">Events</a><Link href="/join">Membership interest</Link></div><div><strong>Keep in touch</strong><a href="#stories">Stories</a><a href="#news">News</a><a href="#gallery">Gallery</a><a href="#faq">FAQs</a><a href="#contact-info">Contact & social channels</a><a href="#languages">English / French availability</a></div></div><div className="shell footer-bottom"><span>© 2026 WisConnect</span><a href="#privacy">Privacy & form information</a></div></footer>
  </main></div></MotionConfig>
}
