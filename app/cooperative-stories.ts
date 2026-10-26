export type CooperativeStory={
  id:string;
  legacySlugs?:string[];
  place:string;
  location:string;
  status:string;
  title:string;
  summary:string;
  image:string;
  smallImage:string|null;
  smallImageWidth?:number;
  imageWidth:number;
  imageHeight:number;
  alt:string;
  position:string;
  imageLabel:string;
  imageCredit:string;
  imageSource?:string;
  additionalImages?:{image:string;width:number;height:number;alt:string;caption:string}[];
  focus:string;
  paragraphs:string[];
  source?:{label:string;url:string};
  links?:{label:string;url:string}[];
};

export const cooperativeStories:CooperativeStory[]=[
  {
    id:'wisdom-connection-initiative',legacySlugs:['roseland-theatre'],place:'Chicago',location:'Greater Roseland / West Pullman, Chicago',status:'Roseland pilot · proposed development',
    title:'The Wisdom Connection Initiative',
    summary:'A 103,000 GSF community wealth-building vision. Roseland is its pilot and headquarters, bringing historic buildings and long-vacant land into community use.',
    image:'roseland-theatre-1240.webp',smallImage:'roseland-theatre-640.webp',imageWidth:1240,imageHeight:620,
    alt:'The Historic Roseland Theatre Building along a tree-lined Chicago street',position:'center 50%',
    imageLabel:'Roseland Theatre · © City of Chicago',
    imageCredit:'Roseland Theatre Building, Chicago. Photograph by Patrick L. Pyszka / © City of Chicago, as featured on WisConnect’s original website.',
    imageSource:'https://wisconnect.co/',
    focus:'Community ownership · Commercial space · Food access · Renewable energy · Health · Youth opportunity',
    paragraphs:[
      'The Wisdom Connection Initiative in Roseland is a proposed 103,000 gross square foot community wealth-building project. The Roseland site is the pilot and headquarters for an initiative intended to grow nationally and globally. It brings together the historic Roseland Theatre, the nearby historic Anderson Building and adjacent vacant, city-owned lots.',
      'The early 20th-century Roseland Theatre is planned for rehabilitation as a worker-owned, multi-commercial space for women-owned businesses, alongside a state-of-the-art Black Box that honors the neighborhood’s artistic past and matriarchal present.',
      'The nearby late-19th-century Anderson Building is planned to become a 7,000-gross-square-foot community-owned grocery store offering locally sourced, affordable, healthy food to address longstanding neighborhood food insecurity.',
      'Plans for the surrounding vacant lots include a 5,000-square-foot worker- and consumer-owned solar distribution and warehouse center; an 11,000-square-foot community health center led by TCA Health; a 14,000-square-foot youth center for workforce training in sports, arts and entrepreneurship; and a “pop-up to growth” business park with 30 affordable spaces for local businesses.',
      'The initiative is led by Elizabeth L. Carter, Esq., LLC and stewarded by WisConnect Holding Cooperative. The cooperative’s envisioned goods and services for Greater Roseland include a sit-down restaurant, café, shared kitchen, overnight childcare, African-sourced clothing, screen printing, a wellness and juice bar, publishing, business development and legal services.',
    ],
    links:[{label:'TCA Health',url:'https://tcahealth.org/'},{label:'Elizabeth L. Carter, Esq., LLC',url:'https://elcesq.com/'},{label:'WisConnect Holding Cooperative',url:'https://wisconnect.co/'}],
  },
  {
    id:'enterprise-rooted-in-place',place:'Liberia',location:'River Cess and the wider Liberia network',status:'Areas of work',
    title:'Enterprise rooted in place',
    summary:'Entrepreneurs, local expertise and community assets shape the cooperative’s work in River Cess and the wider Liberia network.',
    image:'project-local-agriculture-1400.webp',smallImage:'project-local-agriculture-640.webp',imageWidth:1400,imageHeight:933,
    alt:'A woman tending crops in a green field',position:'center 50%',
    imageLabel:'Illustrative imagery',imageCredit:'Illustrative photograph by Safari Consoler / Pexels; not a photograph of a WisConnect project site.',
    imageSource:'https://www.pexels.com/photo/smiling-woman-with-basket-on-back-working-in-field-15897037/',
    focus:'Agriculture · Professional support',
    paragraphs:[
      'In River Cess and the wider Liberia network, the focus is on entrepreneurs, local expertise and community assets. Agriculture, mining and business support form part of the effort to build cooperative economic opportunities.',
      'WisConnect Cooperative Inc. in Liberia is an affiliate of the holding cooperative. Its focus includes agriculture, mining, industrial procurement, textiles and professional services, alongside consulting for construction, agriculture and food businesses.',
    ],
  },
  {
    id:'building-bridges-in-panama',place:'Panama',location:'Panama City, Panama',status:'September 2026 · International Cooperative Alliance Global Conference',
    title:'Building Bridges in Panama',
    summary:'Nikki Bravo and Tiffany Williams represented WisConnect at the International Cooperative Alliance Global Conference and joined a Black cooperative and cultural tour with Collective Diaspora.',
    image:'nikki-studio-800.webp',smallImage:'nikki-studio-480.webp',smallImageWidth:480,imageWidth:800,imageHeight:800,
    alt:'Portrait of Nikki Bravo, who shared reflections on WisConnect’s Panama trip',position:'center 35%',
    imageLabel:'Nikki Bravo · trip photos to follow',
    imageCredit:'Portrait of Nikki Bravo from the WisConnect member profile; this is not a photograph from the Panama trip. Trip photos are pending.',
    focus:'Cooperative learning · Diaspora relationships · Community-rooted sourcing',
    paragraphs:[
      'In September 2026, Nikki Bravo of Momentum Coffee and Chef Tiffany “Chef Mama” Williams of Exquisite Catering represented WisConnect at the International Cooperative Alliance Global Conference in Panama City, alongside a Black cooperative and cultural tour with Collective Diaspora. Cooperators from more than 80 countries came together around the theme “Building Bridges.”',
      'They saw cooperatives building profitable businesses and shared wealth, and met Afro-Panamanian communities, coffee growers, artists and entrepreneurs. The experience deepened Nikki’s interest in community-rooted coffee sourcing and strengthened her commitment to investing locally for global impact.',
      'Nikki returned with a question to carry forward: “What bridge are you going to build?” She and Tiffany are bringing what they learned back to their cafés, kitchens, communities and the cooperative they are building on Chicago’s South Side.',
    ],
    source:{label:'Visit Momentum Coffee',url:'https://momentumcoffee.org/'},
  },
  {
    id:'ilava-chicago-fashion-week',place:'Chicago',location:'South Side, Chicago',status:'Chicago Fashion Week · 2026',
    title:'From Dar es Salaam to the Runway—and Beyond',
    summary:'ILAVA brought its handcrafted fashion to Chicago Fashion Week at MITC Studio, sharing the platform with other women-owned brands.',
    image:'ilava-chicago-fashion-week-cover-1400.webp',smallImage:'ilava-chicago-fashion-week-cover-640.webp',imageWidth:1400,imageHeight:603,
    alt:'Five women wearing colorful designs together at MITC Studio for ILAVA’s Chicago Fashion Week presentation',position:'center 50%',
    imageLabel:'ILAVA at Chicago Fashion Week · 2026',
    imageCredit:'Chicago Fashion Week photos supplied by ILAVA in its October 2026 email.',
    additionalImages:[{image:'ilava-chicago-fashion-week-gallery-960.webp',width:960,height:1440,alt:'Three women in colorful fashion celebrating together at MITC Studio',caption:'ILAVA and fellow women-owned brands at MITC Studio · Photo supplied by ILAVA'}],
    focus:'Ethical fashion · Women-owned brands · Collaboration',
    paragraphs:[
      'After debuting at LA Fashion Week in 2017, ILAVA brought its handcrafted, ethically made fashion to Chicago Fashion Week. The 2026 presentation took place at MITC Studio on Chicago’s South Side, the brand’s brick-and-mortar home.',
      'ILAVA shared the platform with its MITC Studio partner, Tabby’s Closets, and women-owned brands Bags by L. Michelle and Wurus Art Jewelry. The collaboration made room for women to thrive, creativity to flourish and people and profit to coexist.',
      'For ILAVA, fashion is about more than what people wear. It is also about the people behind the pieces, the stories they tell and the impact they make—from Dar es Salaam to Chicago and beyond.',
    ],
    source:{label:'Visit ILAVA',url:'https://myilava.com/'},
  },
];
