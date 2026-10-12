export type CooperativeStory={
  id:string;
  place:string;
  location:string;
  status:string;
  title:string;
  summary:string;
  image:string;
  smallImage:string|null;
  imageWidth:number;
  imageHeight:number;
  alt:string;
  position:string;
  imageLabel:string;
  imageCredit:string;
  imageSource?:string;
  focus:string;
  paragraphs:string[];
  source?:{label:string;url:string};
};

export const cooperativeStories:CooperativeStory[]=[
  {
    id:'roseland-theatre',place:'Chicago',location:'Roseland / West Pullman, Chicago',status:'Prospective developer',
    title:'Inclusive revitalization in Roseland',
    summary:'A proposed new chapter for the Historic Roseland Theatre Building and its adjacent site, rooted in community wealth and resident leadership.',
    image:'roseland-theatre-1240.webp',smallImage:'roseland-theatre-640.webp',imageWidth:1240,imageHeight:620,
    alt:'The Historic Roseland Theatre Building along a tree-lined Chicago street',position:'center 50%',
    imageLabel:'Roseland Theatre · © City of Chicago',
    imageCredit:'Roseland Theatre Building, Chicago. Photograph by Patrick L. Pyszka / © City of Chicago, as featured on WisConnect’s original website.',
    imageSource:'https://wisconnect.co/',
    focus:'Community wealth · Inclusive redevelopment',
    paragraphs:[
      'We were selected through the City of Chicago’s RFQ process to be a prospective developer of the Historic Roseland Theatre Building and adjacent vacant site. This proposed 60,000 sq ft development is part of our community-wealth building and inclusive redevelopment work.',
      'You want to know what the icing on the cake is? Our co-founder Elizabeth L. Carter is a resident of the area! This is how you revamp the development landscape.',
      'Rarely do you see resident, Black women-led redevelopment projects occurring in historically disinvested Black communities like Roseland/West Pullman, Chicago—the “Wild 100s”.',
    ],
    source:{label:'Originally shared on WisConnect’s website',url:'https://wisconnect.co/#a4566c60-3477-4d4e-9277-97f48310b53f'},
  },
  {
    id:'wisdom-connection-initiative',place:'Chicago',location:'Greater Roseland, Chicago',status:'Development vision',
    title:'The Wisdom Connection Initiative',
    summary:'A vision for a cooperative business hub that brings local enterprise, community assets and youth opportunity together in Greater Roseland.',
    image:'purpose-community-1400.webp',smallImage:'purpose-community-640.webp',imageWidth:1400,imageHeight:933,
    alt:'Four women sharing a conversation around a laptop',position:'center 43%',
    imageLabel:'Illustrative imagery',imageCredit:'Illustrative photograph by PICHA Stock / Pexels.',
    imageSource:'https://www.pexels.com/photo/women-sitting-on-a-couch-3894375/',
    focus:'Community assets · Youth opportunity',
    paragraphs:[
      'A proposed cooperative business hub in Greater Roseland. The vision connects affordable commercial space with community-owned groceries, renewable energy, health and opportunities for young people through arts, sports and entrepreneurship.',
      'The Wisdom Connection Initiative brings people, capital and land into a vision for sustainable neighbourhoods. Cooperative development, community assets and youth opportunity are central to this direction.',
    ],
  },
  {
    id:'enterprise-rooted-in-place',place:'Liberia',location:'River Cess and the wider Liberia network',status:'Areas of work',
    title:'Enterprise rooted in place',
    summary:'Entrepreneurs, local expertise and community assets shape the cooperative’s work in River Cess and the wider Liberia network.',
    image:'business-agriculture.webp',smallImage:null,imageWidth:1200,imageHeight:675,
    alt:'Rows of crops in a tropical landscape at sunrise',position:'center 52%',
    imageLabel:'Illustrative imagery',imageCredit:'Illustrative agriculture image created for WisConnect; not a photograph of a specific project site.',
    focus:'Agriculture · Professional support',
    paragraphs:[
      'In River Cess and the wider Liberia network, the focus is on entrepreneurs, local expertise and community assets. Agriculture, mining and business support form part of the effort to build cooperative economic opportunities.',
      'WisConnect Cooperative Inc. in Liberia is an affiliate of the holding cooperative. Its focus includes agriculture, mining, industrial procurement, textiles and professional services, alongside consulting for construction, agriculture and food businesses.',
    ],
  },
];
