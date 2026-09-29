// Run with Playwright MCP, or invoke with a WebKit page and a Pages-preview URL.
async (page, site = 'http://127.0.0.1:4173/wisconnect-site/') => {
  const assert=(value,message)=>{if(!value)throw new Error(message);};
  const c=await page.context().browser().newContext({viewport:{width:1440,height:1000},hasTouch:true,reducedMotion:'reduce'});
  const p=await c.newPage();
  const errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  const names=['Chipo Nyambuya, Esq','Elizabeth L. Carter','Priscilla Cadette','Ade Wede Wee-Wee Kekuleh','Nikki Bravo','Tiffany “Chef Mama” Williams','Brandi Davis-Fitch'];
  const bioChecks={
    'Elizabeth L. Carter':['Wisdom Connection Initiative','Greater Roseland'],
    'Nikki Bravo':['Momentum Coffee Holdings','Small Business Majority','two-time marathon finisher'],
    'Tiffany “Chef Mama” Williams':['Exquisite Catering & Events','Exquisite Kitchen','second chances'],
    'Brandi Davis-Fitch':['BDavis Designs','Southern New Hampshire University','DePaul University'],
  };
  const sheet=p.locator('dialog[aria-labelledby="profile-name"]');
  try {
    for(const [width,height] of [[1440,1000],[820,1180],[390,844],[320,568]]) {
      await p.goto(site,{waitUntil:'networkidle'});
      await p.setViewportSize({width,height});
      assert(await p.locator('#member-cards > button').count()===names.length,'All seven visionaries are in the section');
      assert(await p.locator('#member-cards > button:not([hidden])').count()===7,'All portraits are visible without paging');
      for(const [i,name] of names.entries()) {
        const card=p.getByRole('button',{name:'View profile for '+name,exact:true});
        await card.click();
        await sheet.waitFor({state:'visible'});
        assert(await sheet.locator('h2').innerText()===name,'Correct profile opens');
        assert((await sheet.innerText()).includes(`${String(i+1).padStart(2,'0')} / ${String(names.length).padStart(2,'0')}`),'Profile count follows the data');
        for(const part of bioChecks[name]||[])assert((await sheet.innerText()).includes(part),'Supplied biography is present: '+part);
        if(i===1)assert((await sheet.locator('img').getAttribute('src')).includes('elizabeth-carter-studio-800.webp'),'Elizabeth uses her newly supplied portrait');
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
        assert(await p.locator('#member-cards > button:not([hidden])').last().evaluate(b=>b===document.activeElement),'End reaches the final portrait');
      }
      await p.getByRole('button',{name:'Read biography for Brandi Davis-Fitch',exact:true}).click();
      assert(await sheet.locator('h2').innerText()==='Brandi Davis-Fitch','Directory opens the matching profile');
      await p.keyboard.press('Escape');
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
    return 'PASS: seven visible profiles, supplied bios, responsive sheets, focus/scroll, reduced motion and story regression';
  } finally {await c.close();}
}
