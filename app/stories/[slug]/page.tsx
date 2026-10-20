
import Icon from "../../site-icon";
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EntryHeader from '../../entry-header';
import { cooperativeStories } from '../../cooperative-stories';
import { ProjectStoryImage } from '../../project-story-image';
import styles from './page.module.css';

type Props={params:Promise<{slug:string}>};
export const dynamicParams=false;
export function generateStaticParams(){
  return cooperativeStories.map(story=>({slug:story.id}));
}
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params;
  const story=cooperativeStories.find(item=>item.id===slug);
  if(!story)notFound();
  return {title:`${story.title} | WisConnect`,description:story.summary};
}

export default async function StoryPage({params}:Props){
  const {slug}=await params;
  const story=cooperativeStories.find(item=>item.id===slug);
  if(!story)notFound();
  return <div className={styles.page}>
    <EntryHeader/>
    <main className={styles.main}>
      <article>
        <header className={styles.intro}>
          <Link className={styles.back} href="/#community-projects"><span aria-hidden="true"><Icon kind="arrowLeft"/></span> All cooperative stories</Link>
          <p className={styles.eyebrow}>The work taking shape · {story.place}</p>
          <h1>{story.title}</h1>
          <p className={styles.summary}>{story.summary}</p>
        </header>
        <figure className={styles.photo}>
          <ProjectStoryImage story={story} eager/>
          <figcaption>{story.imageSource?<a href={story.imageSource}>{story.imageCredit}</a>:story.imageCredit}</figcaption>
        </figure>
        <div className={styles.content}>
          <aside className={styles.context} aria-label="Story details"><dl>
            <div><dt>Location</dt><dd>{story.location}</dd></div>
            <div><dt>Stage</dt><dd>{story.status}</dd></div>
            <div><dt>Focus</dt><dd>{story.focus}</dd></div>
          </dl></aside>
          <div className={styles.body}>
            {story.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}
            {story.source&&<p className={styles.source}><a href={story.source.url}>{story.source.label} <span aria-hidden="true"><Icon kind="external"/></span></a></p>}
            <div className={styles.actions}><Link className={styles.contact} href="/contact">Talk with WisConnect <span aria-hidden="true"><Icon kind="external"/></span></Link><Link className={styles.back} href="/#community-projects">Back to the stories <span aria-hidden="true"><Icon kind="arrow"/></span></Link></div>
          </div>
        </div>
      </article>
      <footer className={styles.footer}><span>WisConnect · Land · Capital · Communities</span><Link href="/">Back to WisConnect <span aria-hidden="true"><Icon kind="external"/></span></Link></footer>
    </main>
  </div>;
}
