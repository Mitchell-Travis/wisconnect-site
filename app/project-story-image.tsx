import { assetPath } from './assets';
import type { CooperativeStory } from './cooperative-stories';

export function ProjectStoryImage({story,eager=false}:{story:CooperativeStory;eager?:boolean}){
  return <img src={assetPath(story.image)} srcSet={story.smallImage?`${assetPath(story.smallImage)} 640w, ${assetPath(story.image)} ${story.imageWidth}w`:undefined} sizes="(max-width: 760px) 100vw, 1200px" alt={story.alt} width={story.imageWidth} height={story.imageHeight} loading={eager?'eager':'lazy'} style={{objectPosition:story.position}}/>;
}
