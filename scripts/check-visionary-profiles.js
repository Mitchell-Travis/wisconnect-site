// Run with Playwright MCP, or invoke with a WebKit page and a Pages-preview URL.
async (page, site = 'http://127.0.0.1:4173/wisconnect-site/') => {
  const assert=(value,message)=>{if(!value)throw new Error(message);};
  const c=await page.context().browser().newContext({viewport:{width:1440,height:1000},hasTouch:true,reducedMotion:'reduce'});
  const p=await c.newPage();
  const errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  const names=['Chipo Nyambuya, Esq','Elizabeth L. Carter, Esq','Priscilla Cadette','Ade Wede Wee-Wee Kekuleh'];
  const sheet=p.locator('dialog[aria-labelledby="profile-name"]');
  try {
    for(const [width,height] of [[1440,1000],[820,1180],[390,844],[320,568]]) {
      await p.goto(site,{waitUntil:'networkidle'});
      await p.setViewportSize({width,height});
      await p.waitForFunction(()=>document.querySelector('#members')?.dataset.animated==='false');
      assert(await p.locator('#member-cards > button').count()===4,'All four visionaries are in the section');
      for(const [i,name] of names.entries()) {
        const card=p.getByRole('button',{name:'View profile for '+name,exact:true});
        await card.click();
        await sheet.waitFor({state:'visible'});
        assert(await sheet.locator('h2').innerText()===name,'Correct profile opens');
        assert((await sheet.innerText()).includes(`${String(i+1).padStart(2,'0')} / 04`),'Profile count follows the data');
        assert(await sheet.locator('img').evaluate(async img=>{await img.decode();return img.naturalWidth>0;}),'Portrait loads');
        assert(await sheet.evaluate(d=>d.scrollWidth<=d.clientWidth+1&&getComputedStyle(d).backgroundColor==='rgb(255, 255, 255)'),'White sheet fits the viewport');
        assert(await p.evaluate(()=>document.documentElement.style.overflow==='hidden'),'Page scroll is locked');
        await p.keyboard.press('Tab');
        // Native dialogs permit browser-chrome focus (reported as body), but keep the page inert.
        assert(await sheet.evaluate(d=>d.contains(document.activeElement)||document.activeElement===document.body),'Keyboard cannot enter background controls');
        if(i===3) {
          const text=await sheet.innerText();
          for(const part of ['journalist, lecturer and published author','women, children and underserved communities','ZE’AD Advisors and Consultants','United Methodist University Graduate School'])assert(text.includes(part),'Full supplied biography is present');
          await sheet.evaluate(d=>d.scrollTop=d.scrollHeight);
          assert(await sheet.getByRole('button',{name:'Close profile'}).evaluate(b=>{const r=b.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}),'Close remains reachable while reading');
          await sheet.evaluate(d=>d.scrollTop=0);
          await p.screenshot({path:`/tmp/wisconnect-ade-sheet-${width}.png`});
        }
        await p.keyboard.press('Escape');
        await sheet.waitFor({state:'hidden'});
        assert(await card.evaluate(b=>document.activeElement===b),'Focus returns to the originating card');
      }
      assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Page has no horizontal overflow');
      if(width<=390) {
        await p.keyboard.press('Home');
        await p.keyboard.press('End');
        assert(await p.locator('#member-cards > button').last().evaluate(b=>b===document.activeElement),'Mobile End reaches Ade Wede');
      }
    }
    await p.emulateMedia({reducedMotion:'no-preference'});
    for(const [width,height] of [[1920,1000],[1440,1000],[820,1180],[768,720],[390,844]]) {
      await p.goto(site,{waitUntil:'networkidle'});
      await p.setViewportSize({width,height});
      await p.waitForFunction(()=>document.querySelector('#members')?.dataset.animated==='true');
      await p.locator('#members').evaluate(s=>s.scrollIntoView({behavior:'instant',block:'start'}));
      await p.waitForFunction(()=>Number(document.querySelector('#members > div').style.getPropertyValue('--member-spread'))<.001);
      assert(await p.locator('#member-cards').evaluate(e=>{
        const boxes=[...e.children].map(n=>n.getBoundingClientRect());
        return boxes.every(r=>Math.abs(r.x-boxes[0].x)<1&&Math.abs(r.y-boxes[0].y)<1);
      }),'Portraits start in a centered stack');
      if(width===1440||width===390) {
        await p.mouse.move(0,0);
        const featured=()=>p.locator('#member-cards > [data-featured="true"]').getAttribute('aria-label');
        const first=await featured();
        await p.waitForFunction(name=>document.querySelector('#member-cards > [data-featured="true"]').getAttribute('aria-label')!==name,first);
        await p.getByRole('button',{name:'Pause portraits',exact:true}).click();
        const paused=await featured();
        await p.waitForTimeout(3300);
        assert(await featured()===paused,'Pause stops automatic portrait cycling');
        assert(await p.locator('#member-cards > [data-featured="false"]').first().evaluate(b=>getComputedStyle(b).opacity==='0'),'Playback focus keeps portraits stacked');
        await p.getByRole('button',{name:'Resume portraits',exact:true}).click();
        await p.waitForFunction(name=>document.querySelector('#member-cards > [data-featured="true"]').getAttribute('aria-label')!==name,paused);
      }
      await p.evaluate(()=>{const s=document.querySelector('#members');window.scrollTo({top:s.getBoundingClientRect().top+scrollY+s.offsetHeight-innerHeight-2,behavior:'instant'});});
      await p.waitForFunction(()=>Number(document.querySelector('#members > div').style.getPropertyValue('--member-spread'))>.999);
      assert(await p.locator('#member-cards').evaluate(e=>{
        const boxes=[...e.children].map(n=>n.getBoundingClientRect());
        return boxes.every((r,i)=>r.left>=0&&r.right<=innerWidth&&boxes.every((b,j)=>i===j||r.right<=b.left||r.left>=b.right||r.bottom<=b.top||r.top>=b.bottom));
      }),'All four spread portraits fit without overlap');
      assert(await p.locator('#member-cards').evaluate(e=>{
        const heading=document.querySelector('#members h2');
        const copy=[heading,heading.nextElementSibling,document.querySelector('#members a[href$="/join/"]')].filter(Boolean).map(n=>n.getBoundingClientRect());
        return [...e.children].every(n=>{const r=n.getBoundingClientRect();return copy.every(b=>r.right<=b.left||r.left>=b.right||r.bottom<=b.top||r.top>=b.bottom);});
      }),'Portraits leave the heading, description and CTA clear');
      await p.screenshot({path:`/tmp/wisconnect-four-visionaries-${width}.png`});
      const card=p.getByRole('button',{name:'View profile for Ade Wede Wee-Wee Kekuleh',exact:true});
      await card.click();
      await p.waitForTimeout(100);
      assert(await sheet.evaluate(d=>d.getAnimations().some(a=>a.playState==='running')),'Sheet animates upward');
      await p.waitForTimeout(800);
      await sheet.getByRole('button',{name:'Close profile'}).click();
      await sheet.waitFor({state:'hidden'});
      await card.click();
      await p.waitForTimeout(850);
      await p.mouse.click(5,5);
      await sheet.waitFor({state:'hidden'});
    }
    // Shared story dialogs keep their existing layout and content.
    await p.getByRole('button',{name:/^Enterprise: Made by her/}).click();
    await p.getByRole('button',{name:'Read the story'}).click();
    const story=p.locator('dialog[aria-labelledby="story-dialog-title"]');
    await story.waitFor({state:'visible'});
    assert(await story.locator('h2').innerText()==='Made by her. Ready for more.','Story modal still works');
    await p.keyboard.press('Escape');
    await story.waitFor({state:'hidden'});
    assert(errors.length===0,errors.join('\n'));
    return 'PASS: portrait autoplay/pause/resume, scroll-open portraits on desktop/tablet/mobile, unobstructed copy, four profiles, full Ade Wede bio, responsive sheets, focus/scroll, animation, backdrop, reduced motion and story regression';
  } finally {await c.close();}
}
