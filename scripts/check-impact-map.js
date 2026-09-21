// Run through Playwright MCP, or invoke this function with a WebKit page and site URL.
async (page, site = 'http://127.0.0.1:4173/wisconnect-site/') => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const browser = page.context().browser();
  const context = await browser.newContext({viewport:{width:820,height:1180},isMobile:true,hasTouch:true,reducedMotion:'no-preference'});
  const p = await context.newPage();
  const errors = [];
  p.on('pageerror', error => errors.push(error.message));
  const radii = () => p.locator('#impact-map g circle:nth-child(2)').evaluateAll(nodes => nodes.map(node => Number(node.getAttribute('r'))));
  const moving = async () => {
    const samples = [];
    for (let i=0;i<6;i++) { samples.push(await radii()); await p.waitForTimeout(140); }
    assert(samples[0].length === 4 && samples[0].every((_,i) => Math.max(...samples.map(s=>s[i]))-Math.min(...samples.map(s=>s[i]))>1), 'All four country pulses must keep moving');
  };
  try {
    for (const [width,height] of [[820,1180],[1180,820],[390,844]]) {
      await p.setViewportSize({width,height});
      await p.goto(site);
      await p.locator('#impact-map').scrollIntoViewIfNeeded();
      await p.waitForTimeout(3200); // The old once-only pulse had already stopped here.
      await moving();
      assert(await p.locator('#impact-map g circle:nth-child(3)').evaluateAll(nodes => nodes.length===4 && nodes.every(node => {
        const style=getComputedStyle(node), bounds=node.getBoundingClientRect();
        return style.opacity==='1' && style.fill!=='rgb(255, 255, 255)' && bounds.width>4;
      })), 'Country dots must stay visible with contrast against the light map');
      for (const country of ['United States','Brazil','Vietnam','Liberia']) {
        const button=p.getByRole('group',{name:'Countries in the connection vision'}).getByRole('button',{name:country,exact:true});
        await button.tap();
        assert(await button.getAttribute('aria-pressed')==='true', 'Touch must select each country');
      }
      await p.locator('#impact-metrics button').nth(1).tap();
      await p.locator('#impact-map').scrollIntoViewIfNeeded();
      await p.waitForTimeout(1600);
      assert(await p.locator('#impact-map g path:last-child').evaluateAll(nodes => nodes.length===3 && nodes.every(n=>n.getAttribute('stroke-dasharray')==='1 1')), 'All routes finish drawing after selection');
      await p.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
      await p.waitForFunction(()=>[...document.querySelectorAll('#impact-map g circle:nth-child(2)')].every(n=>Number(n.getAttribute('r'))===15));
      await p.locator('#impact-map').scrollIntoViewIfNeeded();
      await p.waitForTimeout(1200);
      await moving();
      assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth), 'No horizontal overflow');
    }
    await p.emulateMedia({reducedMotion:'reduce'});
    await p.waitForFunction(()=>[...document.querySelectorAll('#impact-map g circle:nth-child(2)')].every(n=>Number(n.getAttribute('r'))===15));
    const still=await radii();
    await p.waitForTimeout(500);
    assert(JSON.stringify(still)===JSON.stringify(await radii()), 'Reduce Motion keeps a still map');
    assert(errors.length===0, errors.join('\n'));
  } finally { await context.close(); }
  const noScript=await browser.newContext({javaScriptEnabled:false,viewport:{width:820,height:1180}});
  try {
    const p=await noScript.newPage();
    await p.goto(site);
    assert(await p.locator('#impact-map g circle:nth-child(3)').count()===4, 'Static country dots exist without JavaScript');
    assert(await p.locator('#impact-map g path:last-child').evaluateAll(nodes=>nodes.every(n=>n.getAttribute('stroke-dasharray')!=='0 1')), 'Routes are visible before hydration');
  } finally { await noScript.close(); }
  return 'PASS: continuing pulses, visible dots/routes, touch selection, leave/re-enter, Reduce Motion and static fallback';
}
