// Run with Playwright MCP against the static GitHub Pages preview.
async (page, site='http://127.0.0.1:4173/wisconnect-site/') => {
  const assert=(value,message)=>{if(!value)throw new Error(message)};
  const context=await page.context().browser().newContext({reducedMotion:'reduce'});
  const p=await context.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  const sections=['top','purpose','about','members','member-directory','businesses','business-directory','what-we-do','programs','resources','community-work','impact','stories','news','events','gallery','faq','join','contact-info','privacy'];
  try {
    for(const width of [320,390,768,960,1440,1920]) {
      await p.setViewportSize({width,height:900});await p.goto(site,{waitUntil:'networkidle'});
      assert(JSON.stringify(await p.locator('main > section').evaluateAll(nodes=>nodes.map(n=>n.id)))===JSON.stringify(sections),'Story order matches the Phase 1 plan');
      const audit=await p.evaluate(()=>{
        const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);
        const links=[...document.querySelectorAll('a[href]')];
        const nav=[...document.querySelectorAll('nav[aria-label="Primary navigation"] a')];
        return {duplicates:ids.filter((id,i)=>ids.indexOf(id)!==i),broken:links.filter(a=>a.hash&&a.pathname===location.pathname&&!document.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a=>a.getAttribute('href')),nav:nav.map(a=>a.getAttribute('href')),overflow:document.documentElement.scrollWidth>innerWidth};
      });
      assert(!audit.duplicates.length&&!audit.broken.length&&!audit.overflow,JSON.stringify({width,...audit}));
      assert(new Set(audit.nav).size===16&&audit.nav.length===16,'Every menu destination is distinct');
      assert(!await p.locator('header a[href*="marketplace"],header a[href*="login"],header a[href*="signup"],footer a[href*="marketplace"]').count(),'No commerce or account navigation');
      for(const id of sections.slice(1)) {
        const section=p.locator('#'+id);await section.scrollIntoViewIfNeeded();
        assert(await section.evaluate(s=>[...s.querySelectorAll('h2,h3,p,summary,figcaption')].every(e=>{if(e.closest('#enterprise-cards,#story-gallery'))return true;const r=e.getBoundingClientRect();return r.width===0||r.left>=0&&r.right<=innerWidth;})),`Readable content fits: ${id} at ${width}`);
      }
      for(let i=0;i<4;i++) {
        await p.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
        if(width<960)await p.getByRole('button',{name:'Open navigation',exact:true}).click();
        await p.locator('#nav-trigger-'+i).click();
        const panel=p.locator('#nav-dropdown-'+i),link=panel.locator('a').last(),href=await link.getAttribute('href');
        assert(await panel.isVisible(),'Menu opens');await link.click();
        await p.waitForFunction(hash=>location.hash===hash,href.slice(href.indexOf('#')));
        assert(!await panel.isVisible(),'Destination closes menu');
        assert(!await p.locator('main').evaluate(e=>e.inert),'Content is usable after navigating');
      }
      const faq=p.locator('#faq details').first();await faq.locator('summary').focus();await p.keyboard.press('Enter');
      assert(await faq.getAttribute('open')!==null,'FAQ opens using keyboard');
      assert(await faq.locator('summary').evaluate(e=>getComputedStyle(e).outlineStyle==='solid'),'FAQ has visible focus');
      await p.keyboard.press('Enter');assert(await faq.getAttribute('open')===null,'FAQ closes using keyboard');
      const profile=p.locator('#member-directory button').first();await profile.click();
      await p.locator('dialog[aria-labelledby="profile-name"]').waitFor({state:'visible'});await p.keyboard.press('Escape');
      assert(await profile.evaluate(e=>e===document.activeElement),'Directory profile restores focus');
      if(width===390||width===1440) {
        for(const id of ['purpose','member-directory','programs','events','gallery','faq']) {
          await p.locator('#'+id).screenshot({path:`/tmp/wisconnect-phase1-${id}-${width}.png`});
        }
      }
    }
    assert((await p.locator('#impact-metrics').innerText()).match(/—/g)?.length===4,'No invented impact figures');
    assert((await p.locator('#programs').innerText()).includes('proposed')&&await p.locator('#programs article').count()===3,'Recurring activities remain proposed');
    assert((await p.locator('#events').innerText()).includes('No confirmed events'),'No invented event dates');
    assert((await p.locator('#business-directory').innerText()).includes('Listings awaiting approval'),'No invented business listings');
    assert((await p.locator('#privacy').innerText()).includes('Privacy policy awaiting approval'),'Policy status is explicit');
    // Check real static routes and base-path-aware form links; never send a message.
    for(const route of ['contact/','join/']) {
      await p.goto(site+route,{waitUntil:'networkidle'});
      const privacy=p.getByRole('link',{name:'Privacy & form information',exact:true});
      await privacy.click();await p.waitForURL('**/#privacy');
      assert(await p.locator('#privacy-title').isVisible(),'Form links reach privacy information');
    }
    const paths=await p.locator('a[href]').evaluateAll(links=>[...new Set(links.filter(a=>a.origin===location.origin).map(a=>a.pathname))]);
    for(const path of paths)assert((await p.request.get(site.split('/').slice(0,3).join('/')+path)).ok(),'Local link resolves: '+path);
    assert(!errors.length,errors.join('\n'));
    return 'PASS: Phase 1 order/content, unique navigation and IDs, all anchors/routes, six responsive widths, keyboard FAQ, directory profile/focus, truthful placeholders and both form privacy links.';
  } finally {await context.close();}
}
