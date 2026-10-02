"use client";

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import Link from 'next/link';
import { animate, motion, MotionConfig, useInView } from 'motion/react';
import { assetPath } from './assets';
import styles from './page.module.css';
import { businesses, CooperativeOverview, BusinessDirectory, Places, CommunityProjects, MemberStories } from './wisconnect-content';

// Retain unfinished sections and their original content for a later release.
const showUnfinishedSections = false;

const sectors = ['Coffee shops','Day care','Shared kitchens','Restaurants','Wellness','Juice bars','Clothing stores','Screen printing'] as const;
const allNavigationMenus = [
  {label:'About',groups:[
    {title:'Our purpose',links:[{label:'Mission & vision',description:'Connecting Black women across Africa and the diaspora.',href:'#purpose'}]},
    {title:'Our approach',links:[{label:'The cooperative model',description:'People, capital and communities, working together.',href:'#about'},{label:'Impact & connections',description:'Our connection vision and evidence to be shared.',href:'#impact'}]}
  ],feature:{image:'story-community-640.webp',title:'A future we shape together.',description:'Business begins with people. So does our cooperative.'}},
  {label:'Our people',groups:[
    {title:'Meet the network',links:[{label:'Meet the visionaries',description:'The women and experience behind WisConnect.',href:'#members'}]},
    {title:'Enterprise',links:[{label:'Chicago business sectors',description:'From coffee and child care to design and food.',href:'#businesses'},{label:'Business directory',description:'A place for approved member-owned business listings.',href:'#business-directory'}]}
  ],feature:{image:'story-enterprise-640.webp',title:'Experience worth sharing.',description:'Meet the people bringing their knowledge and ambition to the cooperative.'}},
  {label:'Our work',groups:[
    {title:'Support & learning',links:[{label:'Services & support',description:'The practical role of the cooperative.',href:'#what-we-do'},{label:'Programs & activities',description:'Proposed ways to learn and connect.',href:'#programs'}]},
    {title:'Shared knowledge',links:[{label:'Resources & videos',description:'Guides and learning materials.',href:'#resources'},{label:'Community work',description:'Contributions and local initiatives.',href:'#community-work'}]}
  ],feature:{image:'story-skills-640.webp',title:'Knowledge, shared.',description:'Explore the ideas behind practical support.'}},
  {label:'Updates',groups:[
    {title:'From the network',links:[{label:'Stories',description:'People, ideas and everyday contributions.',href:'#stories'},{label:'News & announcements',description:'Updates from WisConnect.',href:'#news'}]},
    {title:'Gather & explore',links:[{label:'Events calendar',description:'Confirmed gatherings will appear here.',href:'#events'},{label:'Photo gallery',description:'Space for approved community photographs.',href:'#gallery'}]}
  ],feature:{image:'story-ownership-640.webp',title:'A shared perspective.',description:'Discover the stories behind our vision.'}},
  {label:'Get involved',groups:[
    {title:'Membership interest',links:[{label:'How to get involved',description:'Introduce yourself and start a conversation.',href:'#get-involved'},{label:'Your questions, answered',description:'What the introduction means and what comes next.',href:'#faq'}]},
    {title:'Start a conversation',links:[{label:'Membership & partnerships',description:'Find your next step with WisConnect.',href:'#join'},{label:'Contact WisConnect',description:'Bring a question, an idea or a possibility.',href:'/contact'}]}
  ],feature:{image:'story-ownership-640.webp',title:'Bring what you know.',description:'Your experience, ideas and relationships can help shape what grows.'}}
] as const;
const navigationMenus = [
  {...allNavigationMenus[0],groups:[
    {title:'Our purpose',links:[{label:'Mission & vision',description:'Connecting Black women across Africa and the diaspora.',href:'#purpose'}]},
    {title:'Our approach',links:[{label:'The cooperative model',description:'How businesses, members and communities connect.',href:'#cooperative-model'},{label:'People, capital & communities',description:'The belief behind the work.',href:'#about'}]}
  ]},
  {...allNavigationMenus[1],groups:[
    {title:'Meet the network',links:[{label:'Meet the visionaries',description:'The women and experience behind WisConnect.',href:'#members'},{label:'Business directory',description:'Meet the enterprises, their people and their locations.',href:'#business-directory'}]},
    {title:'Enterprise',links:[{label:'Chicago business sectors',description:'Eight sectors at the heart of the Chicago vision.',href:'#businesses'},{label:'Member stories',description:'Experience behind the businesses.',href:'#member-stories'}]}
  ]},
  {...allNavigationMenus[2],groups:[
    {title:'Places & connections',links:[{label:'Chicago & Liberia',description:'Local businesses and work in each place.',href:'#locations'},{label:'Our wider connections',description:'The network and its developing relationships.',href:'#impact'}]},
    {title:'The work',links:[{label:'Services & support',description:'Professional expertise, commercial space and trade.',href:'#what-we-do'},{label:'Community projects',description:'The Wisdom Connection Initiative and Liberia focus.',href:'#community-projects'}]}
  ]},
  allNavigationMenus[4]
];
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
  {label:'People',title:'Bring what you know. Learn from each other.',description:'A business lesson, a professional skill or a useful introduction can be the starting point for someone else.'},
  {label:'Capital',title:'Make room for the next step.',description:'Our ambition is to connect business ideas with the resources and relationships they need. Funding opportunities and terms are still being developed.'},
  {label:'Communities',title:'Let business growth reach further.',description:'A thriving business can support a family, serve a neighborhood and create work for others. That is the kind of growth our cooperative aims to support.'}
] as const;
const cooperativeCards = [
  {id:'capital',label:'Capital',step:'02',heading:'Give good ideas',accent:'room to grow.',description:beliefPillars[1].description,detail:beliefPillars[1].title,image:'cooperative-shop.jpg',alt:'A Tanzanian shop owner inside her business'},
  {id:'communities',label:'Communities',step:'03',heading:'Stronger businesses.',accent:'Stronger communities.',description:beliefPillars[2].description,detail:beliefPillars[2].title,image:'cooperative-market.jpg',alt:'A Nairobi market vendor at her place of work'}
] as const;
const memberProfiles = [
  {name:'Chipo Nyambuya, Esq',role:'International Legal, Governance, and Economic Development Leader',bio:`Chipo C. Nyambuya is a co-founder and legal counsel of WisConnect and a co-founder and Managing Partner of CZL P.C. Her work brings together corporate law, governance, economic development and corporate social responsibility. She has advised corporations, social enterprises, start-ups, international development agencies and governments.

A certified mediator, Chipo has supported healthcare agencies with regulatory audit and compliance requirements. She previously served as Director of Experiential Learning and Professional Development at Loyola University Chicago School of Law and has taught at Loyola and Northwestern University.

In Liberia, she worked with UNDP to support post-conflict rule of law and governance, including work with the Ministry of Justice and the Judiciary. She also serves on the Board of Survivors’ Truths Liberia.

The daughter of a Liberian mother and a Zimbabwean father, Chipo brings a cross-cultural perspective to peacebuilding, economic opportunity and connections across Africa and the wider world.`,expertise:['International law','Governance','Economic development'],image:'chipo'},
  {name:'Elizabeth L. Carter',role:'WisConnect co-founder, inclusive redeveloper and co-op builder',bio:'Elizabeth is an inclusive redeveloper, co-op builder, community planner and commercial real estate and finance attorney. She is a co-founder of WisConnect, responsible for providing leadership, vision, and overall direction of the co-op’s affairs, especially as it concerns the Wisdom Connection Initiative, a 103,000 gsf alternative neighborhood system and cooperative business hub on the far south side of Chicago providing a variety of goods and services to the Greater Roseland community, including locally sourced, community-owned groceries, community-owned renewable energy, affordable commercial space, community health, and workforce development opportunities for youth through the arts, sports, and entrepreneurship.',expertise:['Cooperative development','Community planning','Commercial real estate','Finance law'],image:'elizabeth-carter'},
  {name:'Priscilla Cadette',role:'Entrepreneur, mentor and fundraising specialist',bio:'Her experience connects entrepreneurship, mentorship and fundraising support.',expertise:['Entrepreneurship','Mentorship','Fundraising'],image:'priscilla'},
  {name:'Ade Wede Wee-Wee Kekuleh',role:'Advocate, legal professional and chartered accountant',bio:'Ade Wede Wee-Wee Kekuleh is a Liberian advocate, legal professional, chartered accountant, journalist, lecturer and published author. Her work focuses on gender, human rights, peacebuilding and social justice, with particular attention to women, children and underserved communities. She is a Partner at ZE’AD Advisors and Consultants and teaches Managerial Accounting and Legal Aspects of Business at the United Methodist University Graduate School.',expertise:['Gender & human rights','Peacebuilding','Social justice','Law & accounting'],image:'ade-wede'},
  {name:'Nikki Bravo',role:'Entrepreneur, business leader and small-business advocate',bio:`Nikki Bravo is an entrepreneur, business leader, and small-business advocate with more than two decades of experience across city government, nonprofit workforce development, economic development, and business ownership.

She earned a Bachelor of Science in Business Administration from Florida A&M University and continued her studies in real estate, systems analysis, and organizational development. Nikki began her career with the Chicago Department of Planning and Development as an economic development coordinator. During nearly 20 years in public service, she advanced into senior leadership roles, including Deputy Commissioner for the City of Chicago and Chief Administrative Officer of the Public Building Commission of Chicago. Her responsibilities included finance, administration, operations, human resources, and organizational development.

In 2016, Nikki transitioned to the nonprofit and social enterprise sector as Vice President of Human Resources and Workforce Development for the Bishop Arthur M. Brazier Foundation’s BSD Industries L3C. This work strengthened her experience in workforce training and creating pathways between community talent and employment opportunities.

Nikki and her husband, Tracy Powell, co-founded Momentum Coffee Holdings Inc., a Chicago-based coffee business that connects hospitality, entrepreneurship, and community investment. Momentum Coffee supports workforce development and emerging food entrepreneurs through the Build Momentum Food Incubator in partnership with BUILD Chicago.

Nikki is an alumna of the Goldman Sachs 10,000 Small Businesses program, Founders First, the Breedlove Entrepreneurship Program, the Initiative for a Competitive Inner City’s Inner City Capital Connections program, and World Business Chicago’s Chi Accelerator Program.

As a small-business advocate, Nikki brings the perspective of an active business owner to conversations about access to capital, responsible lending, workforce development, public policy, and the realities of growing a business. She serves on both the National and Illinois Small Business Councils of Small Business Majority. In 2025, she was recognized as an Enterprising Women of the Year Award recipient.

Nikki is a first-generation American, wife, mother, and two-time marathon finisher.`,expertise:['Entrepreneurship','Workforce development','Economic development','Small-business advocacy'],image:'nikki'},
  {name:'Tiffany “Chef Mama” Williams',role:'Chef, entrepreneur and community builder',bio:`Chef Tiffany “Chef Mama” Williams is a celebrated Chicago chef, entrepreneur, and community builder whose work bridges culinary excellence with meaningful social impact. Raised in the Woodlawn neighborhood on Chicago’s South Side, she founded Exquisite Catering & Events in 2017 to bring elevated, globally inspired cuisine to a community long overlooked by diverse dining experiences. Her creative, made-from-scratch menus quickly distinguished her as a sought-after chef, leading to production catering for film and TV sets, concert tours, festivals, and major entertainment clients across the country and abroad.

Guided by a deep commitment to her hometown, Tiffany expanded her vision with Exquisite Kitchen, a licensed shared commercial kitchen designed to support and scale local food entrepreneurs. Through accessible kitchen space, business mentorship, and operational guidance, she helps emerging chefs and small food businesses navigate licensing, compliance, and growth with confidence. Her partnerships span youth workforce programs, neighborhood organizations, and fellow small businesses, reflecting her dedication to economic mobility and community collaboration.

Known affectionately as “Chef Mama,” Tiffany is recognized not only for her culinary talent but for her leadership, generosity, and unwavering belief in second chances. Her work continues to create pathways to employment, entrepreneurship, and stability for South Side residents. Today, Exquisite Catering Co. and Exquisite Kitchen stand as vibrant hubs of creativity, opportunity, and cultural expression—rooted in tradition, powered by community, and driven by a vision for generational impact.`,expertise:['Culinary arts','Food entrepreneurship','Business mentorship','Community development'],image:'tiffany'},
  {name:'Brandi Davis-Fitch',role:'Founder of BDavis Designs, designer and educator',bio:`Since 2003, BDavis Designs, LLC has been a trusted creative partner for entrepreneurs, small business owners, and community organizations throughout Chicago and beyond. With over 20 years of expertise in graphic design, web design, and apparel production, the firm specializes in helping clients discover their unique creative voice and bring bold visions to life through custom graphics, apparel designs, and engaging websites.

Founded and led by Brandi Davis, the business draws on extensive corporate experience from roles at Johnson Publishing Company, Inc., Blue Cross and Blue Shield of Illinois, Career Builder, and Modern Tribe. Brandi also serves as an Online Adjunct Professor in graphic design and media arts at Southern New Hampshire University, bringing academic rigor and industry insight to every client engagement.

Brandi holds a Bachelor of Fine Arts in Multimedia and Web Design from the Illinois Institute of Art-Chicago and a Master of Science in E-Commerce Technology and Project Management from DePaul University’s College of Computing and Digital Media.

BDavis Designs takes pride in every detail of every project, ensuring meticulous attention at every step of the creative process. This commitment to excellence has built lasting partnerships with clients including the Chicago chapter of the National Black MBA Association, Chicago Aldermanic Black Caucus, Polished Pebbles, Greater Auburn Gresham Development Center, Friends of Richton Park, CZL | P.C., and LM Fitch Consultants.

BDavis Designs operates from a philosophy of healing, confidence, and culture—creating work that not only looks exceptional but resonates with purpose and meaning.`,expertise:['Graphic design','Web design','Apparel production','Design education'],image:'brandi'}
,
  {name:'Kailyn Harrington',role:'Managing owner of Bunnyland Developmental Child Care Center',bio:`Kailyn Harrington is the Managing Owner of Bunnyland Developmental Child Care Center, a family-founded early childhood education organization that has served Chicago’s Roseland community since 1979. As a second-generation leader, Kailyn carries forward a legacy established by her grandparents while helping position Bunnyland for its next chapter of growth and community impact.

A graduate of Tennessee State University with a Bachelor of Science in Business Administration and a concentration in Supply Chain Management, Kailyn brings a business and operations-focused approach to early childhood education. She oversees Bunnyland’s day-to-day operations, regulatory compliance, staffing, facilities, and organizational development while remaining focused on providing dependable, high-quality care for working families.

Through WisConnect, Kailyn hopes to expand Bunnyland’s longstanding presence in Roseland and explore innovative childcare solutions that better serve the needs of today’s families, including those working nontraditional hours. She is passionate about preserving community-rooted institutions, creating opportunities for children and families, and contributing to sustainable economic development on Chicago’s Far South Side.`,expertise:['Early childhood education','Business operations','Community development'],image:'kailyn'}
] as const;
const regions = {
  Africa: 'Liberia · An affiliate cooperative with member businesses and a focus on local enterprise, agriculture, mining and professional support.',
  'United States': 'Chicago · Businesses in food, child care, design and professional services, connected by a cooperative vision for Greater Roseland.',
  'Brazil / South America': 'Brazil · Part of the wider diaspora connection vision; no local business listings or active projects are presented here.',
  'Vietnam / Southeast Asia': 'Vietnam · A developing connection, with local business and project content to follow as the work takes shape.',
  Ghana: 'Ghana · A developing connection, with local business and project content to follow as the work takes shape.'
} as const;

type Sector = (typeof sectors)[number];
type Region = keyof typeof regions;

const impactPlaces: {region:Region;label:string;x:number;y:number;route?:string}[] = [
  // Approximate country anchors in the map's equirectangular projection, not office locations.
  {region:'Africa',label:'Liberia',x:474,y:220},
  {region:'Ghana',label:'Ghana',x:498,y:218},
  {region:'United States',label:'United States',x:228,y:129,route:'M474 220 Q355 20 228 129'},
  {region:'Brazil / South America',label:'Brazil',x:356,y:277,route:'M474 220 Q388 167 356 277'},
  {region:'Vietnam / Southeast Asia',label:'Vietnam',x:800,y:199,route:'M474 220 Q658 40 800 199'}
];

// Sector list supplied by Elizabeth Carter on September 26, 2026 (Chicago).
const sectorStories: Record<Sector,{image:string;alt:string;position:string;description:string}> = {
  'Coffee shops': {
    image:'coffee-shop', position:'50% 50%',
    alt:'A Black woman behind a café counter',
    description:'Coffee, conversation and hospitality, with a place for people to meet throughout the day.'
  },
  'Day care': {
    image:'day-care', position:'20% 50%',
    alt:'Two Black children playing together with colorful building blocks',
    description:'Child care and early learning, with room for children to play, discover and grow.'
  },
  'Shared kitchens': {
    image:'shared-kitchen', position:'50% 50%',
    alt:'Stainless steel preparation counters and cooking equipment in a commercial kitchen',
    description:'Commercial kitchen space for food entrepreneurs to prepare products and develop their businesses.'
  },
  Restaurants: {
    image:'restaurant', position:'50% 35%',
    alt:'A smiling Black woman chef wearing a black and red chef coat',
    description:'Food and dining experiences that bring culinary skill, culture and hospitality to the table.'
  },
  Wellness: {
    image:'wellness', position:'52% 50%',
    alt:'A Black woman practicing seated yoga on a mat',
    description:'Yoga, aesthetics and spa services that make space for movement, relaxation and personal care.'
  },
  'Juice bars': {
    image:'juice-bar', position:'50% 50%',
    alt:'Glasses of fresh orange juice on a sunlit table',
    description:'Fresh juices and fruit-led drinks, bringing a refreshing option to everyday routines.'
  },
  'Clothing stores': {
    image:'clothing-store', position:'76% 50%',
    alt:'A Black woman browsing colorful clothing on a shop rack',
    description:'Apparel and retail businesses connecting personal style with the experience of shopping locally.'
  },
  'Screen printing': {
    image:'screen-printing', position:'50% 50%',
    alt:'Hands pulling a wooden squeegee across an inked screen-printing frame',
    description:'Custom printing that brings graphics, identities and creative ideas to fabric and apparel.'
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
  function openMemberByName(name:string){
    const index=memberProfiles.findIndex(member=>member.name===name);
    if(index>=0)setSelectedMember(index);
  }
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
          <summary aria-label="Choose language" className={styles.languageTrigger}>EN <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></summary>
          <div className={styles.languageDropdown}>
            <p>Language</p>
            <button type="button" lang="en" aria-current="true" onClick={()=>{if(languagePicker.current){languagePicker.current.open=false;languagePicker.current.querySelector('summary')?.focus()}}}>English <span>Selected</span></button>
            <button type="button" lang="fr" disabled>Français <span lang="en">Awaiting translation</span></button>
            <Link className={styles.contentLink} href="#languages" onClick={close}>Language availability</Link>
          </div>
        </details>
        <div className={styles.mobileNavActions}><Link href="/join" onClick={close}>Membership interest <ArrowUpRightIcon/></Link><Link href="/contact" onClick={close}>Contact us</Link></div>
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
          <p className={styles.heroLede}>WisConnect is a worker-owned holding cooperative bringing Black women entrepreneurs together across Africa and the diaspora to connect businesses, share knowledge and build community wealth.</p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryAction} href="/join">Express your interest <ArrowUpRightIcon/></Link>
            <a className={styles.secondaryAction} href="#purpose">Explore WisConnect <ArrowDownIcon/></a>
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

    <section id="purpose" className={`section ${styles.purposeSection}`} aria-labelledby="purpose-title"><div className="shell">
      <div className={styles.purposeHeading}>
        <div><p className="eyebrow">Purpose & identity</p><h2 id="purpose-title">Why we come <em>together.</em></h2></div>
        <p>Africa & the Diaspora</p>
      </div>
      <p className={styles.purposeIntroduction}>Every woman brings knowledge, relationships and ideas shaped by her own experience. WisConnect exists to connect those strengths, so we can build more together.</p>
      <div className={styles.purposeGrid}>
        <article className={styles.purposeMission} aria-labelledby="purpose-mission-title">
          <figure className={styles.purposePhoto}>
            <img src={assetPath('purpose-connection-1400.webp')} srcSet={`${assetPath('purpose-connection-640.webp')} 640w, ${assetPath('purpose-connection-1400.webp')} 1400w`} sizes="(max-width: 760px) 100vw, 55vw" width="1400" height="912" loading="lazy" decoding="async" alt="Three women sharing ideas and working together at a laptop"/>
          </figure>
          <div className={styles.purposeCopy}>
            <p className={styles.purposeLabel}>Connection into possibility</p>
            <h3 id="purpose-mission-title">Our mission</h3>
            <p>To provide connectivity among Black women visionaries through open-source technology and accessible inclusive spaces that mobilize personalized resources for collective abundance.</p>
          </div>
        </article>
        <article className={styles.purposeVision} aria-labelledby="purpose-vision-title">
          <div className={styles.purposeCopy}>
            <p className={styles.purposeLabel}>A future we create together</p>
            <h3 id="purpose-vision-title">Our vision</h3>
            <p>A transformative and co-created ecosystem made by and for every woman in Africa and the Diaspora</p>
          </div>
          <figure className={styles.purposePhoto}>
            <img src={assetPath('purpose-community-1400.webp')} srcSet={`${assetPath('purpose-community-640.webp')} 640w, ${assetPath('purpose-community-1400.webp')} 1400w`} sizes="(max-width: 760px) 100vw, 45vw" width="1400" height="933" loading="lazy" decoding="async" alt="Four women gathered around a coffee table, sharing a lively conversation"/>
          </figure>
        </article>
      </div>
      <p className={styles.purposeCredits}>Illustrative photography by PICHA Stock / Pexels: <a href="https://www.pexels.com/photo/three-women-looking-at-the-computer-3894378/">collaboration</a> &amp; <a href="https://www.pexels.com/photo/women-sitting-on-a-couch-3894375/">community</a>.</p>
    </div></section>

    <CooperativeOverview/>

    <section id="about" data-divider="background" className={styles.beliefSection} aria-labelledby="belief-title"><div id="cooperative" ref={beliefStack} className={`shell ${styles.beliefStack}`}>
      <div className={styles.beliefCard} data-pillar="people">
        <div className={styles.beliefCopy}>
          <div>
            <p className={styles.beliefEyebrow}><span>People · What we bring together</span></p>
            <h2 id="belief-title">When women own,<span>communities grow.</span></h2>
            <p className={styles.beliefDescription}>You know your work, your customers and your community. Our cooperative vision brings that experience into a shared effort: women building businesses and helping shape the opportunities around them.</p>
          </div>
          <div className={styles.beliefBottom}>
            <div className={styles.beliefChoices} role="group" aria-label="Explore our cooperative belief">
              {beliefPillars.map((pillar,index)=><button key={pillar.label} type="button" aria-pressed={beliefPillar===index} aria-controls="belief-detail" onClick={()=>setBeliefPillar(index)}><span aria-hidden="true">0{index+1}</span>{pillar.label}</button>)}
            </div>
            <div id="belief-detail" className={styles.beliefDetail} aria-live="polite" aria-atomic="true"><p><strong>{beliefPillars[beliefPillar].title}</strong> {beliefPillars[beliefPillar].description}</p></div>
            <div className={styles.beliefActions}><Link href="/join">Introduce yourself <ArrowUpRightIcon/></Link><a href="#belief-capital">Explore the cooperative <ArrowUpRightIcon/></a></div>
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
            <div className={styles.beliefActions}><Link href="/join">Introduce yourself <ArrowUpRightIcon/></Link><a href={card.id==='capital'?'#belief-communities':'#businesses'}>{card.id==='capital'?'Explore communities':'Explore business sectors'} <ArrowUpRightIcon/></a></div>
          </div>
        </div>
        <figure className={styles.beliefVisual}><img src={assetPath(card.image)} loading="lazy" decoding="async" alt={card.alt}/></figure>
      </article>)}
    </div></section>

    <section id="members" data-divider="background" className={`section ${styles.members}`} aria-labelledby="members-title">
      <svg className={styles.memberThreads} viewBox="0 0 1600 1000" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
        {Array.from({length:24},(_,i)=><path key={i} d={`M-100 ${i*55-130} C430 ${i*30+90} 940 ${i*13+345} 1260 535 S1510 ${i*34+150} 1700 ${i*39+50}`} stroke={i%5===0?'#b99561':'#7b5aa6'} strokeWidth="1"/>)}
      </svg>
      <div className="shell">
        <div className={`section-heading split-heading ${styles.membersHeading}`}>
          <div><p className="eyebrow">Meet the visionaries</p>
          <h2 id="members-title">Individual strengths.<br/><em>A shared vision.</em></h2></div>
          <div className={styles.memberIntroduction}>
            <p className={styles.memberLede}>Business owners, legal professionals, educators and community builders. Meet the women whose experience is helping shape WisConnect.</p>
            <p className={styles.memberHint}><span className={styles.memberSwipeHint}>Swipe to explore. </span>Select a portrait to read her story.</p>
          </div>
        </div>
        <div id="member-cards" className={styles.memberGrid} role="group" aria-label="Visionary profiles" onKeyDown={event=>{
          if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
          event.preventDefault();
          const cards=Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button'));
          const index=cards.indexOf(document.activeElement as HTMLButtonElement);
          const next=event.key==='Home'?0:event.key==='End'?cards.length-1:Math.max(0,Math.min(cards.length-1,index+(event.key==='ArrowLeft'?-1:1)));
          cards[next]?.focus();
        }}>
          {memberProfiles.map((member,index)=><button type="button" className={styles.memberCard} key={member.name} onClick={event=>{event.currentTarget.focus({preventScroll:true});setSelectedMember(index);}} aria-label={`View profile for ${member.name}`} aria-haspopup="dialog">
            <span className={styles.memberPortrait}><img src={assetPath(`${member.image}-studio-480.webp`)} srcSet={`${assetPath(`${member.image}-studio-480.webp`)} 480w, ${assetPath(`${member.image}-studio-800.webp`)} 800w`} sizes="(max-width: 699px) 78vw, (max-width: 959px) 44vw, 280px" alt="" width="800" height="800" loading="lazy" decoding="async"/></span>
            <span className={styles.memberInfo}><strong>{member.name}</strong><span className={styles.memberRole}>{member.role}</span><span className={styles.memberRead}>Read bio <ArrowUpRightIcon/></span></span>
          </button>)}
        </div>
        <div className={styles.memberConnection}><Link className={styles.contentLink} href="/contact">Ask WisConnect about an introduction <ArrowUpRightIcon/></Link></div>
      </div>
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
          <div className={styles.sheetBio}>{memberProfiles[selectedMember].bio.split('\n\n').map((paragraph,index)=><p key={index}>{paragraph}</p>)}{businesses.filter(b=>b.profile===memberProfiles[selectedMember].name).length>0&&<div className={styles.profileBusinesses}><h3>Her business connections</h3>{businesses.filter(b=>b.profile===memberProfiles[selectedMember].name).map(b=><a key={b.id} href={`#business-${b.id}`} onClick={()=>profileDialog.current?.close()}>{b.name} <ArrowUpRightIcon/></a>)}</div>}<ul aria-label="Areas of expertise">{memberProfiles[selectedMember].expertise.map(item=><li key={item}>{item}</li>)}</ul><Link className={styles.sheetAction} href="/join">Find your place in the cooperative <ArrowUpRightIcon/></Link></div>
        </div>
      </>}
    </dialog>

    <section id="businesses" className={`section ${styles.enterprises}`} aria-labelledby="enterprises-title"><div className="shell"><div className="section-heading split-heading"><div><p className="eyebrow">Business sectors · Chicago</p><h2 id="enterprises-title">Different businesses. Common ground.</h2></div><p>A café that brings neighbors together. A kitchen that gives a food business space to grow. A designer who helps another founder find her voice. These eight Chicago sectors show the range of enterprise at the heart of our cooperative vision.</p></div>
      <div className={styles.enterpriseControls}>
        <p>Explore {sectors.length} Chicago sectors</p>
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
            <div className={styles.enterpriseImage}><img src={assetPath(`sector-${sectorStories[sector].image}-1000.webp`)} srcSet={`${assetPath(`sector-${sectorStories[sector].image}-640.webp`)} 640w, ${assetPath(`sector-${sectorStories[sector].image}-1000.webp`)} 1000w`} sizes="(max-width: 620px) 90vw, (max-width: 980px) 45vw, 340px" style={{objectPosition:sectorStories[sector].position}} alt={sectorStories[sector].alt} loading="lazy" decoding="async" draggable={false}/><h3>{sector}</h3></div>
            <p>{sectorStories[sector].description}</p>
            <span className={styles.enterpriseCta}>Explore membership <ArrowDownIcon/></span>
          </Link>
        </li>)}
      </ul>
      <p className={styles.contentNote}>Photography illustrates the sectors; the businesses pictured are not identified as WisConnect members.</p>
    </div></section>

    {showUnfinishedSections ? <section id="business-directory" data-divider="background" className={`section ${styles.contentSection}`} aria-labelledby="business-directory-title"><div className="shell">
      <div className="section-heading split-heading"><div><p className="eyebrow">Business directory</p><h2 id="business-directory-title">Discover member-owned businesses.</h2></div><p>Meet the enterprises behind the cooperative, with approved details and a direct way to connect.</p></div>
      <div className={styles.emptyContent}><h3>Listings awaiting approval.</h3><p>No business listings are published here yet. Each listing will include the business and owner’s name, sector, description, approved photo or logo, and contact link.</p><p>This directory introduces businesses. Purchases and payments are not available on this website.</p><Link className={styles.contentLink} href="/contact">Ask about listing your business <ArrowUpRightIcon/></Link></div>
    </div></section> : <BusinessDirectory onProfile={openMemberByName}/>}

    <section id="what-we-do" data-divider="background" className="section what-section"><div className="shell"><div className="section-heading split-heading"><div><p className="eyebrow">What WisConnect does</p><h2>Turn shared ownership into shared progress.</h2></div><p>WisConnect connects members to the resources, relationships and practical support that help enterprises grow.</p></div><p className={styles.contentNote}>Talk with the team about the support available for your business and the opportunities being developed.</p><div className="program-list">
      <article><span>01</span><div><h3>Cooperative governance & professional support</h3><p>Shared decision-making, organisational guidance and professional expertise to help enterprises address business challenges.</p></div></article>
      <article><span>02</span><div><h3>Commercial space & community assets</h3><p>A development focus on affordable commercial space and inclusive real estate, connecting business needs to the long-term life of a neighbourhood.</p></div></article>
      <article><span>03</span><div><h3>Business development & visibility</h3><p>Business consulting, shared marketing and connections between entrepreneurs. In Liberia, consulting work includes construction, agriculture and food and beverage enterprises.</p></div></article>
      <article><span>04</span><div><h3>Trade & cross-border relationships</h3><p>Connections to international markets, partners and procurement, shaped around the needs of local businesses.</p></div></article>
    </div></div></section>

    {showUnfinishedSections && <section id="programs" className={`section ${styles.contentSection}`} aria-labelledby="programs-title"><div className="shell">
      <div className="section-heading split-heading"><div><p className="eyebrow">Programs & activities</p><h2 id="programs-title">Ways to learn. Reasons to connect.</h2></div><p>Ideas raised for regular engagement with Black women business owners. These activities are proposed; no schedule or registration is confirmed.</p></div>
      <div className={styles.contentGrid}>
        <article><span className={styles.contentLabel}>Proposed</span><h3>Webinars</h3><p>Conversations around members’ questions and experience. Topics, presenters and frequency await the team’s decision.</p></article>
        <article><span className={styles.contentLabel}>Proposed</span><h3>Tutorials</h3><p>Practical learning led by shared expertise. Content, format and contributors are still to be agreed.</p></article>
        <article><span className={styles.contentLabel}>Proposed</span><h3>Coffee meetings</h3><p>Space for introductions and regular exchange. Hosts, locations and meeting frequency are still to be agreed.</p></article>
      </div><a className={styles.contentLink} href="#events">See the events calendar <ArrowDownIcon/></a>
    </div></section>}

    {showUnfinishedSections && <section id="resources" data-divider="background" className={`section ${styles.contentSection}`} aria-labelledby="resources-title"><div className="shell">
      <div className="section-heading"><p className="eyebrow">Resources & videos</p><h2 id="resources-title">Knowledge to share.</h2></div>
      <div className={styles.contentGrid}>
        <article><span className={styles.contentLabel}>Awaiting content</span><h3>Guides & learning materials</h3><p>Approved resources, authors and accessible download links will be listed here when supplied.</p></article>
        <article><span className={styles.contentLabel}>Awaiting content</span><h3>Watch & listen</h3><p>Member conversations and approved videos will appear here with captions or transcripts. No videos are published yet.</p></article>
      </div><Link className={styles.contentLink} href="/contact">Suggest a resource <ArrowUpRightIcon/></Link>
    </div></section>}

    {showUnfinishedSections ? <section id="community-work" className={`section ${styles.contentSection}`} aria-labelledby="community-title"><div className="shell">
      <div className="section-heading split-heading"><div><p className="eyebrow">Community work</p><h2 id="community-title">What each of us can contribute.</h2></div><p>Skills, mentorship, local knowledge and relationships can all be part of a member’s contribution.</p></div>
      <div className={styles.emptyContent}><h3>Community initiatives awaiting approval.</h3><p>We are making space for members to describe their work, why it matters, the people involved and the contributions behind it. Project details and outcomes will be shared after verification and publication consent.</p><Link className={styles.contentLink} href="/join">Tell us what you would like to contribute <ArrowUpRightIcon/></Link></div>
    </div></section> : <CommunityProjects/>}

    <Places/>

    <section id="impact" data-divider="background" className={styles.impact} aria-labelledby="connections-title">
      <div className={styles.impactFrame}>
        {showUnfinishedSections && <>
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
        </>}
        <div id="global-reach" ref={impactVisual} className={styles.impactVisual}>
          <p className="eyebrow">Across the diaspora</p><h2 id="connections-title" className={styles.connectionTitle}>Local roots. Diaspora connections.</h2>
          <p className={styles.connectionCopy}>From Chicago to Liberia, relationships connect local enterprise to a wider circle of knowledge and opportunity. Ghana, Vietnam and Brazil belong to the network’s developing connections and longer-term vision.</p>
          <div className={styles.impactMapIntro}><span className="eyebrow">Local roots. Shared possibilities.</span><span>Explore current roots and developing connections.</span></div>
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
              <text x={place.x+(place.region==='Ghana'?18:0)} y={place.y+(place.region==='Ghana'?-22:32)} textAnchor="middle" fill="currentColor">{place.label}</text>
            </g>)}
          </svg>
          <div className={styles.impactRegions} role="group" aria-label="Countries in the connection vision">
            {impactPlaces.map(place=><button key={place.region} type="button" aria-pressed={region===place.region} aria-controls="impact-region-detail" onClick={()=>setRegion(place.region)}>{place.label}</button>)}
          </div>
          <p id="impact-region-detail" className={styles.impactRegionDetail} aria-live="polite">{regions[region]}</p>
        </div>
      </div>
    </section>

    <MemberStories onProfile={openMemberByName}/>

    {showUnfinishedSections && <section id="stories" data-divider="background" className="section stories-section" aria-labelledby="stories-title"><div className="shell">
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
    </div></section>}
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

    {showUnfinishedSections && <section id="news" className={`section ${styles.contentSection}`} aria-labelledby="news-title"><div className="shell">
      <div className="section-heading"><p className="eyebrow">News & announcements</p><h2 id="news-title">From the cooperative.</h2></div>
      <div className={styles.emptyContent}><h3>No approved updates yet.</h3><p>News, announcements and community updates will appear here with publication dates. WisConnect is confirming who supplies and approves regular updates.</p></div>
    </div></section>}

    {showUnfinishedSections && <section id="events" className={`section ${styles.contentSection}`} aria-labelledby="events-title"><div className="shell">
      <div className="section-heading split-heading"><div><p className="eyebrow">Events calendar</p><h2 id="events-title">Come into the conversation.</h2></div><p>Find dates, details, locations or online links, and registration information for confirmed gatherings.</p></div>
      <div className={styles.emptyContent}><h3>No confirmed events to display.</h3><p>Dates and RSVP links will be added when approved. Proposed webinars, tutorials and coffee meetings are not scheduled events.</p><Link className={styles.contentLink} href="/contact">Ask about upcoming gatherings <ArrowUpRightIcon/></Link></div>
    </div></section>}

    {showUnfinishedSections && <section id="gallery" data-divider="background" className={`section ${styles.contentSection}`} aria-labelledby="gallery-title"><div className="shell">
      <div className="section-heading split-heading"><div><p className="eyebrow">Photo gallery</p><h2 id="gallery-title">Life in the network.</h2></div><p>A home for approved member, event, program and community photographs. Images, captions, credits and publication permissions are still to come.</p></div>
      <div className={styles.contentGrid}>{['Members & their work','Events & programs','Community moments'].map(label=><figure className={styles.galleryPlaceholder} key={label}><div aria-hidden="true">Photo to come</div><figcaption><strong>{label}</strong><span>Awaiting approved photography</span></figcaption></figure>)}</div>
    </div></section>}

    <section id="get-involved" data-divider="background" className={`section ${styles.contentSection} ${styles.getInvolved}`} aria-labelledby="get-involved-title"><div className="shell">
      <div className="section-heading split-heading"><div><p className="eyebrow">How to get involved</p><h2 id="get-involved-title">Start with what<br/><em>you bring.</em></h2></div><p>You might bring a business, a professional skill, local knowledge or an idea you want to explore. Tell us about yourself and what interests you in WisConnect.</p></div>
      <ol className={styles.introductionSteps}>
        <li><span className={styles.contentLabel}>01 · Introduce yourself</span><h3>Tell us about your work.</h3><p>Answer five questions about who you are, where you’re based and what you would like to contribute.</p></li>
        <li><span className={styles.contentLabel}>02 · Review &amp; email</span><h3>Share your introduction.</h3><p>Review your answers, then open the prepared draft in your email app and send it to WisConnect. Nothing is sent automatically.</p></li>
        <li><span className={styles.contentLabel}>03 · Start a conversation</span><h3>Ask about your next step.</h3><p>Your introduction opens a conversation about membership. Ask the team about eligibility, fees and the review process before making a commitment.</p></li>
      </ol>
      <Link className={styles.contentLink} href="/join">Express your membership interest <ArrowUpRightIcon/></Link>
      <p className={styles.contentNote}>This is an introduction, not membership approval. Membership terms and available opportunities are still being confirmed.</p>
    </div></section>

    <section id="faq" data-divider="background" className={`section ${styles.contentSection}`} aria-labelledby="faq-title"><div className="shell">
      <div className="section-heading"><p className="eyebrow">Frequently asked questions</p><h2 id="faq-title">Before you take the next step.</h2></div>
      <details className={styles.contentDetails}><summary>Who is WisConnect for?</summary><p>Our focus is Black women entrepreneurs and visionaries across Africa and the diaspora. If you have a business, expertise or an idea to contribute, <Link href="/join">introduce yourself</Link>. The team can discuss membership eligibility and next steps with you.</p></details>
      <details className={styles.contentDetails}><summary>What does shared ownership mean?</summary><p>WisConnect brings businesses into a holding cooperative, with members participating in collective decisions by consensus. The aim is to build shared value across enterprises and community assets. Membership agreements set out each member’s rights, responsibilities and financial terms.</p></details>
      <details className={styles.contentDetails}><summary>How do I express interest in membership?</summary><p>Complete the <Link href="/join">five-question introduction</Link>, review your answers and send the prepared draft from your own email app. Completing the form does not send it automatically or make you a member.</p></details>
      <details className={styles.contentDetails}><summary>What can I contribute?</summary><p>Your business experience, professional skills, mentorship, local knowledge and relationships can all be part of the conversation. Tell us what you know, what you care about and where you would like to take part.</p></details>
      <details className={styles.contentDetails}><summary>What opportunities are available now?</summary><p>You can introduce yourself or <Link href="/contact">contact the team</Link> about membership and partnership ideas. Funding, program schedules and business support services are still being developed; ask WisConnect what is available for your situation.</p></details>
      <details id="languages" className={styles.contentDetails}><summary>Is the website available in French?</summary><p>English is available now. French content is awaiting translation, review and an agreed launch date.</p><p lang="fr">La version française est en préparation. La date de publication reste à confirmer.</p></details>
    </div></section>

    <section id="join" data-divider="background" className="section join-section" aria-labelledby="join-title"><div className="shell">
      <p className="eyebrow">Your next step</p><h2 id="join-title">Bring your experience.<br/>Help shape what grows.</h2>
      <p className="join-lede">A business to grow. Knowledge to share. A community you care about. There is a conversation to start here.</p>
      <div className="join-grid">
        <Link href="/join"><span>01 · Membership interest</span><strong>Introduce yourself</strong><p>Tell us about your work and what you would like to contribute. Review your introduction, then send it by email.</p><b><ArrowUpRightIcon/></b></Link>
        <Link href="/contact"><span>02 · Partnership</span><strong>Explore a partnership</strong><p>Have expertise, resources or a shared goal? Let’s talk about what we could build together.</p><b><ArrowUpRightIcon/></b></Link>
        <Link href="/contact"><span>03 · A question or an idea</span><strong>Talk to WisConnect</strong><p>Ask about the cooperative, membership or an idea you would like to discuss with the team.</p><b><ArrowUpRightIcon/></b></Link>
      </div>
    </div></section>

    {showUnfinishedSections && <section id="contact-info" data-divider="background" className={`section ${styles.contentSection}`} aria-labelledby="contact-info-title"><div className="shell">
      <div className="section-heading split-heading"><div><p className="eyebrow">Contact & connect</p><h2 id="contact-info-title">Start with a conversation.</h2></div><p>Get in touch about membership, partnerships, business listings or a general question.</p></div>
      <div className={styles.contentGrid}><article><h3>Write to WisConnect</h3><Link className={styles.contentLink} href="/contact">Open the contact form <ArrowUpRightIcon/></Link><a className={styles.contentLink} href="mailto:hello@wisconnect.co">hello@wisconnect.co</a><p>Questions about WisConnect? We’d love to hear from you.</p></article><article><h3>Locations & social channels</h3><p>Approved office or service-area details and official social links are awaiting confirmation. The map above illustrates a connection vision.</p></article></div>
    </div></section>}

    

    {showUnfinishedSections ? <footer className="site-footer"><div className="shell footer-grid">
      <div className="footer-brand"><img src={assetPath('logo-horizontal.webp')} alt="WisConnect"/><p>People · Capital · Communities</p></div>
      <div><strong>Explore WisConnect</strong><a href="#purpose">Mission &amp; vision</a><a href="#about">The cooperative model</a><a href="#members">Meet the visionaries</a><a href="#businesses">Chicago business sectors</a><a href="#business-directory">Business directory</a><a href="#impact">Impact &amp; connections</a></div>
      <div><strong>Get involved</strong><a href="#get-involved">How to get involved</a><Link href="/join">Membership interest</Link><a href="#join">Partnerships &amp; conversation</a><a href="#faq">Your questions, answered</a><a href="#programs">Programs &amp; activities</a><a href="#resources">Resources</a><a href="#community-work">Community work</a></div>
      <div><strong>Keep in touch</strong><Link href="/contact">Contact WisConnect</Link><a href="mailto:hello@wisconnect.co">hello@wisconnect.co</a><Link href="/login">Member sign in</Link><a href="#languages">Language availability</a><a href="#stories">Stories</a><a href="#news">News</a><a href="#events">Events</a><a href="#gallery">Gallery</a><a href="#contact-info">Contact &amp; social channels</a></div>
    </div><div className="shell footer-bottom"><span>© 2026 WisConnect</span><Link href="/terms">Terms &amp; Conditions</Link></div></footer> : <footer className="site-footer"><div className="shell footer-grid">
      <div className="footer-brand"><img src={assetPath('logo-horizontal.webp')} alt="WisConnect"/><p>People · Capital · Communities</p><p>WisConnect Holding Cooperative</p></div>
      <div><strong>Explore WisConnect</strong><a href="#purpose">Mission &amp; vision</a><a href="#cooperative-model">The cooperative model</a><a href="#members">Meet the visionaries</a><a href="#business-directory">Business directory</a><a href="#businesses">Chicago business sectors</a></div>
      <div><strong>Our work</strong><a href="#locations">Chicago &amp; Liberia</a><a href="#impact">Our wider connections</a><a href="#what-we-do">Services &amp; support</a><a href="#community-projects">Community projects</a><a href="#member-stories">Member stories</a></div>
      <div><strong>Get involved</strong><a href="#get-involved">How to get involved</a><Link href="/join">Membership interest</Link><Link href="/contact">Contact WisConnect</Link><a href="#faq">Your questions, answered</a><a href="#languages">Language availability</a></div>
    </div><div className="shell footer-bottom"><span>© 2026 WisConnect</span><Link href="/terms">Terms &amp; Conditions</Link></div></footer>}
  </main></div></MotionConfig>
}
