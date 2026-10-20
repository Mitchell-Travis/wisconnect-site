export default async ({ project }) => {
  const p = await project({dir:"/home/user/wisconnect-approved-loop",size:"960x1200",fps:24,background:"#ffffff"});
  const footage = await p.add("/home/user/hero-exchange.mp4");
  const opening = await p.add("/home/user/hero-opening.png");
  p.cut(footage,{from:0,dur:8,at:0,fit:"contain"});
  p.compose(<media file={opening} x={0} y={0} width={960} height={1200} fit="contain"
    animate={[{property:"opacity",keyframes:[{at:0,value:0,easing:"linear"},{at:11/24,value:1},{at:0.5,value:1}]}]}/>,
    {at:7.5,dur:0.5,name:"Return to opening"});
  await p.render("renders/master.mp4",{depth:8,shards:1,concurrency:1});
};
