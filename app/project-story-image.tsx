import { assetPath } from './assets';
import type { CooperativeStory } from './cooperative-stories';

const imagePath=(path:string)=>/^https?:\/\//i.test(path)?path:assetPath(path);

export function ProjectStoryImage({story,eager=false}:{story:CooperativeStory;eager?:boolean}){
  return <img src={imagePath(story.image)} srcSet={story.smallImage?`${imagePath(story.smallImage)} ${story.smallImageWidth??640}w, ${imagePath(story.image)} ${story.imageWidth}w`:undefined} sizes="(max-width: 760px) 100vw, 1200px" alt={story.alt} width={story.imageWidth} height={story.imageHeight} loading={eager?'eager':'lazy'} decoding="async" style={{objectPosition:story.position}}/>;
}
