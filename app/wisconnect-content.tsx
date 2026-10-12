'use client';

import { assetPath } from './assets';
import styles from './wisconnect-content.module.css';
export { BusinessDirectory } from './business-directory';

function ArrowIcon(){
  return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6 14 14 6M7 6h7v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export { businesses } from './businesses';

export { CooperativeOverview } from './cooperative-overview';

export { CommunityProjects } from './community-projects';

const memberStories=[
  {name:'Nikki Bravo',image:'nikki',label:'Coffee & opportunity',title:'More than a place for coffee.',copy:'Nikki and Tracy’s Momentum Coffee connects hospitality with community investment. Its food incubator partnership supports emerging food entrepreneurs.'},
  {name:'Tiffany “Chef Mama” Williams',image:'tiffany',label:'Food & entrepreneurship',title:'Room for another chef to grow.',copy:'Tiffany’s journey from catering to a shared commercial kitchen brings space, mentorship and practical guidance closer to local food businesses.'},
  {name:'Kailyn Harrington',image:'kailyn',label:'Child care & continuity',title:'A family legacy. A next chapter.',copy:'Kailyn is carrying Bunnyland’s Roseland legacy forward, with an ambition to expand care for working families, including those with nontraditional hours.'},
];
export function MemberStories({onProfile}:{onProfile:(name:string)=>void}){
  return <section id="member-stories" className={`section ${styles.stories}`} aria-labelledby="member-stories-title"><div className="shell">
    <div className="section-heading split-heading"><div><p className="eyebrow">People behind the businesses</p><h2 id="member-stories-title">Experience worth<br/><em>sharing.</em></h2></div><p>Meet the business owners turning their experience into something others can build on.</p></div>
    <div className={styles.storyGrid}>{memberStories.map(story=><article key={story.name}><img src={assetPath(`${story.image}-studio-480.webp`)} alt={`Portrait of ${story.name}`} width="480" height="480" loading="lazy"/><div><span className={styles.tag}>{story.label}</span><h3>{story.title}</h3><p>{story.copy}</p><button type="button" onClick={()=>onProfile(story.name)}>Read {story.name.split(' ')[0]}’s story <ArrowIcon/></button></div></article>)}</div>
  </div></section>;
}
