// Run with Playwright MCP against the dev server, or pass a production preview URL.
async (page, site='http://localhost:3000/') => {
  const assert=(value,message)=>{if(!value)throw new Error(message)};
  const context=await page.context().browser().newContext({reducedMotion:'reduce'});
  const p=await context.newPage();
  const errors=[];p.on('pageerror',error=>errors.push(error.message));
  const closed=()=>p.waitForFunction(()=>[...document.querySelectorAll('[id^="nav-trigger-"]')].every(button=>button.getAttribute('aria-expanded')==='false'));
  const hover=async index=>{await p.locator(`#nav-trigger-${index}`).hover();await p.locator(`#nav-dropdown-${index}`).waitFor({state:'visible'});};
  try {
    for(const width of [1024,1440,1920]) {
      await p.setViewportSize({width,height:1000});await p.goto(site,{waitUntil:'networkidle'});
      const last=await p.locator('#nav-trigger-3').boundingBox();
      const contact=await p.locator('header').getByRole('link',{name:'Contact',exact:true}).boundingBox();
      const gap={x:(last.x+last.width+contact.x)/2,y:last.y+last.height/2};
      assert(await p.evaluate(({x,y})=>{const e=document.elementFromPoint(x,y);return !!e?.closest('header')&&!e.closest('a,button,summary');},gap),'Test point is blank header space');
      for(let index=0;index<4;index++) {
        await hover(index);await p.mouse.move(gap.x,gap.y);await closed();
        await hover(index);await p.mouse.click(gap.x,gap.y);await closed();
        assert(await p.locator('header').evaluate(e=>e.previousElementSibling?.getAttribute('aria-hidden')!=='true'),'Dismissal removes the page backdrop');
      }
      await hover(0);await p.mouse.move(4,38);await closed(); // Outer header margin, no click.
      await hover(0);
      const panel=await p.locator('#nav-dropdown-0').boundingBox();
      const trigger=await p.locator('#nav-trigger-0').boundingBox();
      await p.mouse.move(trigger.x+trigger.width/2,trigger.y+trigger.height+4);
      await p.waitForTimeout(50); // Cross the small gap between trigger and panel.
      await p.mouse.move(panel.x+8,panel.y+8);
      await p.waitForTimeout(250);
      assert(await p.locator('#nav-dropdown-0').isVisible(),'Moving into the dropdown cancels dismissal');
      await p.mouse.click(panel.x+8,panel.y+8);
      assert(await p.locator('#nav-dropdown-0').isVisible(),'Dropdown padding remains inside the menu');
      await hover(1);
      assert(!await p.locator('#nav-dropdown-0').isVisible(),'Another trigger switches menus');
      await p.locator('#nav-trigger-1').focus();await p.keyboard.press('ArrowDown');
      assert(await p.locator('#nav-dropdown-1 a').first().evaluate(e=>e===document.activeElement),'Keyboard reaches a dropdown link');
      await p.keyboard.press('Escape');await closed();
      assert(await p.locator('#nav-trigger-1').evaluate(e=>e===document.activeElement),'Escape returns focus to the trigger');
      await hover(0);await p.mouse.move(width-4,900);await closed(); // Leave for page content, no click.
      await hover(0);await p.getByLabel('Choose language',{exact:true}).click();await closed();
      assert(await p.locator('header details').getAttribute('open')!==null,'Language picker still opens');
      await p.keyboard.press('Escape');
      await hover(0);
      const link=p.locator('#nav-dropdown-0 a[href*="#"]').first(),href=await link.getAttribute('href');
      await link.click();await closed();
      await p.waitForFunction(hash=>location.hash===hash,href.slice(href.indexOf('#')));
    }
    // Preserve the existing mobile menu, Back, and Escape behavior.
    await p.setViewportSize({width:390,height:844});await p.goto(site,{waitUntil:'networkidle'});
    await p.getByRole('button',{name:'Open navigation',exact:true}).click();
    await p.locator('#nav-trigger-0').click();
    await p.getByRole('button',{name:'Back',exact:true}).click();await closed();
    assert(await p.getByRole('button',{name:'Close navigation',exact:true}).isVisible(),'Back keeps the mobile navigation open');
    await p.keyboard.press('Escape');
    assert(await p.getByRole('button',{name:'Open navigation',exact:true}).isVisible(),'Escape closes mobile navigation');
    assert(!errors.length,errors.join('\n'));
    return 'PASS: all four desktop menus dismiss on pointer exit without clicking at 1024/1440/1920px; panel interaction, menu switching, links, backdrop, language, keyboard focus and mobile Back/Escape remain usable';
  } finally {await context.close();}
}
