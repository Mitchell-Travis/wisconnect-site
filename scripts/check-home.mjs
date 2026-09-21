// Start isolated Chrome with --headless --remote-debugging-port=9222 first.
// Run: node scripts/check-home.mjs [site URL]; no browser-test dependency needed.
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const url = process.argv[2] ?? 'http://localhost:3000';
const targets = await fetch('http://127.0.0.1:9222/json/list').then(r => r.json());
const target = targets.find(target => target.type === 'page' && target.url.startsWith(new URL(url).origin))
  ?? await fetch(`http://127.0.0.1:9222/json/new?${encodeURIComponent(url)}`, {method:'PUT'}).then(r=>r.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
let id = 0;
const pending = new Map();
const errors = [];
socket.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
  if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push(message.params.args.map(arg => arg.value ?? arg.description).join(' '));
  const callback = pending.get(message.id);
  if (callback) { pending.delete(message.id); callback(message); }
};
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const request = ++id;
    const timeout = setTimeout(() => { pending.delete(request); reject(new Error(`Timed out: ${method}`)); }, 15000);
    pending.set(request, message => {
      clearTimeout(timeout);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result);
    });
    socket.send(JSON.stringify({ id: request, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  assert(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function until(expression) {
  await evaluate(`new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (${expression}) resolve(true);
      else if (Date.now() - start > 10000) reject(new Error(${JSON.stringify(expression)}));
      else setTimeout(check, 50);
    }; check();
  })`);
}
async function key(key, code = key) {
  const windowsVirtualKeyCode = { Escape: 27, Enter: 13, Tab: 9, ArrowLeft: 37, ArrowRight: 39, Home: 36, End: 35 }[key];
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode, ...(key==='Enter'?{text:'\r',unmodifiedText:'\r'}:{}) });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode });
}
async function screenshot(name, selector) {
  await evaluate('Promise.all(document.getAnimations().filter(a => a.timeline instanceof DocumentTimeline && a.effect.getTiming().iterations !== Infinity).map(a => a.finished.catch(() => {})))');
  const clip = selector ? await evaluate(`(() => { const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); return {x:r.left+scrollX,y:r.top+scrollY,width:r.width,height:r.height,scale:1}; })()`) : undefined;
  const { data } = await send('Page.captureScreenshot', { format: 'png', ...(clip ? {clip, captureBeyondViewport:true} : {}) });
  await writeFile(`/tmp/wisconnect-${name}.png`, Buffer.from(data, 'base64'));
}

try {
  await send('Page.enable');
  await send('Page.bringToFront');
  await send('Runtime.discardConsoleEntries');
  await send('Runtime.enable');
  await send('Page.navigate', { url });
  await until('document.querySelector("#hero-title") && document.readyState === "complete"');
  assert(await evaluate('!document.querySelector(".global-section") && document.querySelector("#impact").nextElementSibling.id === "stories"'), 'Standalone global-reach section is removed; stories follow the impact map');
  assert(await evaluate(`!document.querySelector('.cooperative-section') && document.querySelector('#cooperative').closest('section').id==='about' && document.querySelectorAll('#cooperative [data-pillar]').length===3 && [...document.querySelectorAll('#about a[href^="#"]')].every(a=>document.querySelector(a.hash))`),'Removed cooperative section; navigation and card actions resolve to the new stack and enterprises');
  assert.deepEqual(await evaluate(`[...document.querySelectorAll('button[id^="nav-trigger-"]')].map(a=>a.textContent)`),['Our story','The cooperative','Our people','Businesses'],'WisConnect primary navigation labels are preserved');
  assert(await evaluate(`[...document.querySelectorAll('nav[aria-label="Primary navigation"] a')].every(a=>!a.hash || document.querySelector(a.hash)) && !document.querySelector('header > div > a[href*="marketplace"], header > div > a[href*="login"], header > div > a[href*="signup"], header > div > a[href*="dashboard"]')`),'Dropdown destinations resolve without exposing future account/shop routes');
  for(const width of [390,1440]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
    await send('Page.navigate',{url});
    await until('document.querySelector("#hero-title") && document.readyState === "complete"');
    await until(`document.querySelector('#members').dataset.animated===String(innerHeight>=720)`);
    for(const selector of ['#businesses .section-heading > div','#enterprise-cards > li','.program-list > article','#impact-title','#impact-metrics > div','#story-gallery','#join h2','.join-grid > a','.footer-grid > div']){
      await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center',behavior:'instant'})`);
      await until(`document.querySelector(${JSON.stringify(selector)}).dataset.scrollReveal==='visible'`);
      const motion=await evaluate(`(() => {const el=document.querySelector(${JSON.stringify(selector)});const css=getComputedStyle(el);return {name:css.animationName,duration:css.animationDuration,delay:css.animationDelay};})()`);
      assert(motion.name.includes('scroll-arrive'),'Sections, cards, rows and footer share the entrance rhythm');
      assert.equal(motion.duration,width===390?'0.55s':'0.75s');
      if(width===390)assert.equal(motion.delay,'0s','Mobile entrances have no stagger delay');
      await until(`document.querySelector(${JSON.stringify(selector)}).getAnimations().every(animation=>animation.playState==='finished')`);
      assert(await evaluate(`(() => {const css=getComputedStyle(document.querySelector(${JSON.stringify(selector)}));return css.opacity==='1' && css.translate==='0px';})()`),'Entrances settle at full opacity without residual displacement');
    }
    await evaluate(`document.querySelector('#businesses').scrollIntoView({behavior:'instant'})`);
    assert(await evaluate(`document.querySelector('#businesses .section-heading > div').getAnimations().every(animation=>animation.playState==='finished')`),'Scrolling back does not replay completed entrances');
    await screenshot(`${width}-scroll-businesses`,'#businesses');
    await evaluate(`document.querySelector('.join-grid > a').focus()`);
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('.join-grid > a')).animationName`),'none','Keyboard focus makes links immediately stable');
    console.log(`PASS ${width}px: top-to-bottom entrances, once-only behavior, focus safety`);
  }
  await evaluate('document.activeElement.blur();window.scrollTo({top:0,behavior:"instant"})');
  for (const width of [320, 390, 620, 768, 1024, 1440, 1920]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
    await evaluate('window.scrollTo({top:0,behavior:"instant"})');
    await until('innerWidth === ' + width);
    await until('Math.abs(document.querySelector("header").getBoundingClientRect().top) < .1');
    await until(`document.querySelector('#members').dataset.animated === String(innerHeight >= 720)`);
    const layout = await evaluate(`(() => {
      const visible = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.left >= -1 && r.right <= innerWidth + 1; };
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        hero: visible(document.querySelector('#hero-title')),
        members: [...document.querySelectorAll('#member-cards > button')].filter((_, i) => innerWidth > 620 || i === 0).every(visible),
        labels: [...document.querySelectorAll('#member-cards > button strong')].filter((_, i) => innerWidth > 620 || i === 0).every(visible),
        join: visible(document.querySelector('header > div > a[href$="/join/"]') || document.querySelector('header > div > a[href$="/join"]')),
      };
    })()`);
    assert.deepEqual(layout, { overflow: false, hero: true, members: true, labels: true, join: true }, `Layout at ${width}px: ${JSON.stringify(layout)}`);
    await evaluate(`document.querySelector('#about').scrollIntoView({block:'start',behavior:'instant'})`);
    await until(`document.querySelector('#about figure img').complete && document.querySelector('#about figure img').naturalWidth>0`);
    assert(await evaluate(`(()=>{const card=getComputedStyle(document.querySelector('#about .shell > div'));return card.backgroundImage.includes('rgb(41, 24, 51)') && card.backgroundImage.includes('rgb(86, 53, 120)') && card.color==='rgb(255, 255, 255)' && getComputedStyle(document.querySelector('#belief-title span')).color==='rgb(185, 149, 90)';})()`),'Belief feature uses WisConnect shared plum, purple, white, and gold');
    assert(await evaluate(`document.querySelector('#about figure img').currentSrc.includes('belief-orange-') && !document.querySelector('#about video, #about figure button')`),'Orange blazer portrait replaces the animation and playback control');
    assert(await evaluate(`(()=>{const section=document.querySelector('#about'),card=section.querySelector('.shell').firstElementChild,r=card.getBoundingClientRect(),shell=section.querySelector('.shell').getBoundingClientRect(),copy=card.firstElementChild.getBoundingClientRect(),visual=card.querySelector('figure').getBoundingClientRect();return r.left>=shell.left+16 && r.right<=shell.right-16 && (innerWidth<=760?visual.top>=copy.bottom:visual.left>=copy.right) && [...section.querySelectorAll('button,a')].every(el=>{const b=el.getBoundingClientRect();return b.height>=44 && b.left>=r.left+12 && b.right<=r.right-12;});})()`),'Belief feature stays inside the page rails with responsive columns and usable controls');
    for (let index=0;index<3;index++) {
      await evaluate(`document.querySelectorAll('#about button')[${index}].click()`);
      await until(`document.querySelectorAll('#about button')[${index}].getAttribute('aria-pressed')==='true'`);
      assert.equal(await evaluate(`document.querySelectorAll('#about button[aria-pressed="true"]').length`),1);
      assert.equal(await evaluate(`document.querySelector('#belief-detail strong').textContent`),['Knowledge becomes collective capacity.','Resources become opportunity.','Value belongs close to home.'][index]);
    }
    await evaluate(`document.querySelector('#about button').focus({preventScroll:true})`);
    assert.equal(await evaluate(`getComputedStyle(document.activeElement).outlineStyle`),'solid','Belief choices retain visible keyboard focus');
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'});
    await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
    await until(`document.querySelector('#about button').getAttribute('aria-pressed')==='true'`);
    await evaluate(`document.activeElement.blur()`);
    assert(await evaluate(`document.querySelector('#belief-detail').getAttribute('aria-live')==='polite' && !!document.querySelector('#about a[href$="/join/"]') && !!document.querySelector('#about a[href="#belief-capital"]')`),'Belief description is announced and both actions have real destinations');
    assert.deepEqual(await evaluate(`[...document.querySelectorAll('#about [data-pillar]')].map(card=>card.dataset.pillar)`),['people','capital','communities'],'People, Capital, and Communities form the belief stack');
    for (const [index,pillar,color,photo] of [[1,'capital','rgb(250, 248, 245)','cooperative-shop.jpg'],[2,'communities','rgb(247, 243, 248)','cooperative-market.jpg']]) {
      await evaluate(`(()=>{const stack=document.querySelector('#about .shell'),cards=[...stack.children],top=stack.getBoundingClientRect().top+scrollY+cards.slice(0,${index}).reduce((sum,card)=>sum+card.offsetHeight+24,0);scrollTo({top:top-(parseFloat(getComputedStyle(cards[0]).top)||92),behavior:'instant'});})()`);
      await until(`document.querySelector('[data-pillar="${pillar}"] img').complete && document.querySelector('[data-pillar="${pillar}"] img').naturalWidth>0`);
      assert(await evaluate(`(()=>{const card=document.querySelector('[data-pillar="${pillar}"]'),r=card.getBoundingClientRect();return getComputedStyle(card).backgroundColor==='${color}' && card.querySelector('img').currentSrc.endsWith('${photo}') && r.left>=12 && r.right<=innerWidth-12 && [...card.querySelectorAll('a')].every(a=>a.getBoundingClientRect().height>=44);})()`),'New cooperative card uses its source photo, shared brand surface, and accessible layout');
      if(width>=761){
        assert(await evaluate(`(()=>{const cards=[...document.querySelectorAll('#about [data-pillar]')];return cards.slice(0,${index+1}).every(card=>Math.abs(card.getBoundingClientRect().top-parseFloat(getComputedStyle(card).top))<2) && document.elementFromPoint(innerWidth/2,160)?.closest('[data-pillar]')?.dataset.pillar==='${pillar}';})()`),'Next card covers the preceding pinned cards');
      }else assert.equal(await evaluate(`getComputedStyle(document.querySelector('[data-pillar="${pillar}"]')).position`),'static','Narrow screens show cards in normal document flow');
      if(width===390||width===1440)await screenshot(`belief-${pillar}-${width}`,`[data-pillar="${pillar}"]`);
    }
    await evaluate(`document.querySelector('#about').scrollIntoView({block:'start',behavior:'instant'})`);
    if(width>=761){
      assert.equal(await evaluate(`document.elementFromPoint(innerWidth/2,200)?.closest('[data-pillar]')?.dataset.pillar`),'people','Scrolling up reveals the first card again');
      await key('Tab');
      await evaluate(`document.querySelector('#about a').focus()`);
      assert(await evaluate(`[...document.querySelectorAll('#about [data-pillar]')].every(card=>getComputedStyle(card).position==='relative')`),'Keyboard focus releases overlapping cards');
      await evaluate(`document.activeElement.blur()`);
    }
    if(width===390||width===1440)await screenshot(`belief-${width}`,'#about');
    await evaluate('window.scrollTo({top:0,behavior:"instant"})');
    await until('Math.abs(document.querySelector("header").getBoundingClientRect().top) < .1');
    assert(await evaluate(`Math.abs(parseFloat(getComputedStyle(document.querySelector('#enterprises-title')).fontSize) - Math.min(52, Math.max(32, innerWidth * .036))) < .1`), 'Enterprise heading uses the reduced responsive type size');
    if (width <= 620) {
      const cards = await evaluate(`(() => {
        const reference = document.querySelector('#enterprise-cards > li').getBoundingClientRect();
        const selectors = '#enterprise-cards > li, #story-gallery > button, .join-grid a, .program-list article';
        const sameWidth = [...document.querySelectorAll(selectors)].every(card => Math.abs(card.getBoundingClientRect().width - reference.width) < 1);
        const matchingHeights = ['#enterprise-cards > li', '#story-gallery > button', '.join-grid a', '.program-list article'].every(group => {
          const heights = [...document.querySelectorAll(group)].map(card => card.getBoundingClientRect().height);
          return Math.max(...heights) - Math.min(...heights) < 1;
        });
        const copyFits = [...document.querySelectorAll(selectors)].every(card => {
          const bounds = card.getBoundingClientRect();
          return [...card.querySelectorAll('strong, h3, p, figcaption, button')].every(el => {
            const rect = el.getBoundingClientRect();
            return !rect.width || (rect.left >= bounds.left - 1 && rect.right <= bounds.right + 1 && rect.top >= bounds.top - 1 && rect.bottom <= bounds.bottom + 1);
          });
        });
        return {sameWidth, matchingHeights, copyFits};
      })()`);
      assert.deepEqual(cards, {sameWidth: true, matchingHeights: true, copyFits: true}, 'Mobile cards align, have matching heights within each family, and do not clip text');
    }
    assert(await evaluate(`(() => {
      const metrics = document.querySelector('#impact-metrics');
      const cards = [...metrics.children];
      const bounds = cards.map(card => card.getBoundingClientRect());
      const columns = getComputedStyle(metrics).gridTemplateColumns.split(' ').length;
      return columns === (innerWidth <= 620 ? 2 : 4) && cards.length === 4 &&
        Math.max(...bounds.map(r => r.height)) - Math.min(...bounds.map(r => r.height)) < 1 &&
        cards.every((card, i) => {
          const label = card.querySelector('dt').getBoundingClientRect();
          const value = card.querySelector('dd');
          const valueBounds = value.getBoundingClientRect();
          return bounds[i].left >= 0 && bounds[i].right <= innerWidth && label.left >= bounds[i].left && label.right <= bounds[i].right &&
            label.bottom <= bounds[i].bottom && valueBounds.left >= bounds[i].left && valueBounds.right <= bounds[i].right &&
            value.textContent === ['250+','60+','12','30+'][i] && value.getAttribute('aria-label') === 'Illustrative sample: ' + value.textContent;
        }) && document.querySelector('#impact svg').getAttribute('aria-hidden') === 'true' &&
        document.querySelector('#impact-note').textContent.includes('design preview only—not verified results');
    })()`), 'Impact proof band has equal responsive cells, unclipped sample numbers, and an explicit preview disclaimer');
    await evaluate('document.querySelector("#impact").scrollIntoView({behavior:"instant"})');
    assert(await evaluate('getComputedStyle(document.querySelector("#impact-title")).fontFamily.includes("Arial")'), 'Impact uses the reference sans-serif typography');
    assert(await evaluate(`getComputedStyle(document.querySelector('#impact')).backgroundColor === 'rgb(255, 255, 255)' && getComputedStyle(document.querySelector('#impact'),'::before').backgroundImage.includes('rgb(220, 207, 228)')`), 'Impact uses a clean lavender gradient behind the original map');
    assert(await evaluate('fetch(document.querySelector("#impact svg image").getAttribute("href")).then(r => r.ok)'), 'Local geographic map asset loads');
    for(let index=0;index<4;index++){
      await evaluate(`document.querySelectorAll('#impact-metrics button')[${index}].click()`);
      assert(await evaluate(`document.querySelectorAll('#impact-metrics button[aria-pressed="true"]').length===1 && document.querySelectorAll('#impact-metrics button')[${index}].getAttribute('aria-pressed')==='true' && document.querySelectorAll('#impact-metrics > div')[${index}].dataset.active==='true'`),'Metric selection updates its highlight without replacing the map');
    }
    await evaluate('document.querySelector("#impact-metrics button").focus()');
    await key('Enter');
    await until('document.querySelector("#impact-metrics button").getAttribute("aria-pressed")==="true"');
    assert(await evaluate('document.querySelector("#impact-metrics button").getAttribute("aria-pressed")==="true"'),'Statistics support keyboard activation');
    await evaluate('document.activeElement.blur()');
    assert.deepEqual(await evaluate('[...document.querySelectorAll("#impact [role=group] button")].map(button=>button.textContent)'), ['Liberia','United States','Brazil','Vietnam'], 'Map lists the four requested countries');
    assert(await evaluate(`(() => {
      const labels=[...document.querySelectorAll('#impact svg text')];
      const expected=[[474,220],[228,129],[356,277],[800,199]];
      return labels.length === 4 && labels.every((label,i)=>{
        const pin=label.parentElement.querySelector('circle');
        const bounds=label.getBoundingClientRect();
        return Number(pin.getAttribute('cx')) === expected[i][0] && Number(pin.getAttribute('cy')) === expected[i][1] &&
          bounds.width > 0 && bounds.height >= 9 && bounds.left >= 0 && bounds.right <= innerWidth;
      });
    })()`), 'Country markers are positioned correctly and labels remain visible on phones');
    for (let index = 0; index < 4; index++) {
      await evaluate(`document.querySelectorAll('#impact [role=group] button')[${index}].click()`);
      await until(`document.querySelectorAll('#impact [role=group] button')[${index}].getAttribute('aria-pressed') === 'true'`);
      assert(await evaluate(`(() => {
        const buttons=[...document.querySelectorAll('#impact [role=group] button')];
        return buttons.filter(b=>b.getAttribute('aria-pressed')==='true').length === 1 &&
          buttons.every(b=>b.getBoundingClientRect().height >= 44) &&
          document.querySelectorAll('#impact svg g[data-active=true] > path:last-child').length === (${index} === 0 ? 3 : 1) &&
          document.querySelector('#impact-region-detail').textContent.length > 30;
      })()`), 'Map controls select and highlight each region with accessible touch targets');
    }
    await evaluate('document.querySelector("#impact [role=group] button").click(); window.scrollTo({top:0,behavior:"instant"})');
    await until('Math.abs(document.querySelector("header").getBoundingClientRect().top) < .1');
    console.log(`PASS ${width}px: lavender impact band, map asset, region selections and route highlights`);
    assert(await evaluate(`(() => {
      const header = document.querySelector('header').getBoundingClientRect();
      const ribbon = document.querySelector('.hero-textile-ribbon').getBoundingClientRect();
      const join = document.querySelector('header > div > a[href*="/join"]').getBoundingClientRect();
      return header.height === (innerWidth < 960 ? 66 : 76) &&
        Math.abs(ribbon.top - header.bottom) < 1 && join.height >= 44;
    })()`), 'Compact header meets the textile without a gap and preserves tap targets');
    assert(await evaluate(`['::before', '::after'].every(pseudo => {
      const rail = getComputedStyle(document.querySelector('main'), pseudo);
      return rail.position === 'fixed' && rail.top === '0px' && rail.bottom === '0px' &&
        rail.pointerEvents === 'none' && Number(rail.zIndex) < Number(getComputedStyle(document.querySelector('header')).zIndex);
    })`), 'Frame rails stay behind the navigation background without blocking controls');
    if (width < 960) {
      assert(await evaluate('document.querySelector("header summary").getClientRects().length === 0'), 'Language is absent from the mobile header');
      await evaluate('document.querySelector("header button").focus(); document.querySelector("header button").click()');
      await until('document.querySelector("header button").getAttribute("aria-expanded") === "true"');
    }
    await evaluate('document.querySelector("header summary").focus(); document.querySelector("header summary").click()');
    await until('document.querySelector("header details").open');
    assert(await evaluate(`(() => {
      const picker = document.querySelector('header details');
      const trigger = picker.getBoundingClientRect();
      const join = document.querySelector('header > div > a[href*="/join"]').getBoundingClientRect();
      const panel = picker.querySelector('div').getBoundingClientRect();
      const ribbon = document.querySelector('.hero-textile-ribbon').getBoundingClientRect();
      return (innerWidth < 960 ? trigger.top >= join.bottom : trigger.left >= join.right) && panel.left >= 0 && panel.right <= innerWidth &&
        picker.querySelector('button[lang="fr"]').disabled &&
        Math.abs(ribbon.height - (innerWidth <= 700 ? 30 : Math.min(46, Math.max(34, innerWidth * .03)))) < 1 && ribbon.width === innerWidth;
    })()`), 'Language sits in mobile menu or after desktop Join; dropdown fits and textile sizing is preserved');
    if (width === 390 || width === 1440) await screenshot(`${width}-language`);
    await key('Escape');
    await until('!document.querySelector("header details").open');
    assert(await evaluate('document.activeElement === document.querySelector("header summary")'));
    if (width < 960) {
      await key('Escape');
      await until('document.querySelector("header button").getAttribute("aria-expanded") === "false"');
      assert(await evaluate('document.activeElement === document.querySelector("header button")'), 'Second Escape dismisses mobile menu and restores focus');
      await evaluate('document.querySelector("header button").click()');
      await until('document.querySelector("header button").getAttribute("aria-expanded") === "true"');
      await evaluate('document.querySelector("header summary").focus()');
    }
    await evaluate('document.querySelector("header summary").click(); document.querySelector("header details button[lang=en]").click()');
    await until('!document.querySelector("header details").open');
    await evaluate('document.querySelector("header summary").click()');
    await until('document.querySelector("header details").open');
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 10, y: 200, button: 'left', clickCount: 1 });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 10, y: 200, button: 'left', clickCount: 1 });
    await until('!document.querySelector("header details").open');
    if (width < 960) {
      await evaluate('{ const toggle = document.querySelector("header button"); if (toggle.getAttribute("aria-expanded") === "true") { toggle.focus(); toggle.click(); } }');
      await until('document.querySelector("header button").getAttribute("aria-expanded") === "false"');
    }
    console.log(`PASS ${width}px: textile, language dropdown, Escape, selection, outside dismissal`);
    if(width<960){
      await evaluate(`document.querySelector('header button[aria-controls="primary-navigation"]').click()`);
      await until(`document.querySelector('#main-content').inert`);
      assert.equal(await evaluate(`document.documentElement.style.overflow`),'hidden','Mobile navigation locks background scrolling');
    }
    for(let menu=0;menu<4;menu++){
      await evaluate(`document.querySelector('#nav-trigger-${menu}').focus();document.querySelector('#nav-trigger-${menu}').click()`);
      await until(`document.querySelector('#nav-trigger-${menu}').getAttribute('aria-expanded')==='true'`);
      assert(await evaluate(`(()=>{const p=document.querySelector('#nav-dropdown-${menu}'),r=p.getBoundingClientRect();return !p.hidden && r.left>=0 && r.right<=innerWidth && p.querySelectorAll('li a').length===6;})()`),'Dropdown fits and contains the six relevant destinations');
      if(width>=960){
        assert(await evaluate(`Math.abs(document.querySelector('#nav-dropdown-${menu}').getBoundingClientRect().width-Math.min(1262,innerWidth-48))<1`),'Dropdown matches Stripe reference width');
        assert(await evaluate(`getComputedStyle(document.querySelector('header').previousElementSibling).backdropFilter==='blur(5px)'`),'Open dropdown blurs the page');
        await key('ArrowDown');
        await until(`document.activeElement===document.querySelector('#nav-dropdown-${menu} a')`);
      }else{
        await until(`document.activeElement.textContent.trim()==='Back'`);
        assert(await evaluate(`document.querySelector('#nav-trigger-${menu}').getClientRects().length===0`),'Phone submenu replaces the top-level list');
      }
      await key('Escape');
      await until(`document.querySelector('#nav-trigger-${menu}').getAttribute('aria-expanded')==='false'`);
      assert(await evaluate(`document.activeElement===document.querySelector('#nav-trigger-${menu}')`),'Escape returns focus to its navigation trigger');
    }
    if(width<960){
      await key('Escape');
      await until(`!document.querySelector('#main-content').inert`);
      assert.notEqual(await evaluate(`document.documentElement.style.overflow`),'hidden');
    }else{
      await evaluate(`document.querySelector('#nav-trigger-0').focus()`);await key('ArrowRight');
      await until(`document.querySelector('#nav-trigger-1').getAttribute('aria-expanded')==='true'`);
      await key('Escape');
    }
    console.log(`PASS ${width}px: dropdown dimensions, all four menus, keyboard and mobile focus/scroll management`);

    await evaluate(`document.activeElement.blur(); document.querySelector('#members').scrollIntoView({behavior:'instant',block:'start'})`);
    await until(`Number(document.querySelector('#members > div').style.getPropertyValue('--member-spread')) < .001`);
    const closedDistance = await evaluate(`Math.abs(document.querySelectorAll('#member-cards > button')[0].getBoundingClientRect().left - document.querySelectorAll('#member-cards > button')[1].getBoundingClientRect().left)`);
    assert(closedDistance<1,'Portraits begin in a centered stack');
    await evaluate(`(() => {const section=document.querySelector('#members');window.scrollTo({top:scrollY+section.getBoundingClientRect().top+section.offsetHeight-innerHeight-2,behavior:'instant'})})()`);
    await until(`Number(document.querySelector('#members > div').style.getPropertyValue('--member-spread')) > .999`);
    const openDistance = await evaluate(`Math.abs(document.querySelectorAll('#member-cards > button')[0].getBoundingClientRect().left - document.querySelectorAll('#member-cards > button')[1].getBoundingClientRect().left)`);
    assert(openDistance>closedDistance+150,'Portraits spread with scroll on desktop and mobile');
    await screenshot(`${width}-members-open`);
    console.log(`PASS ${width}px: scroll-open portraits`);
    await evaluate('window.scrollTo({top:0,behavior:"instant"})');
    if (width === 390 || width === 1440) {
      await screenshot(`${width}-hero`);
      await evaluate('document.querySelector("#members").scrollIntoView({behavior:"instant"})');
      await until('document.querySelector("#member-cards img").complete && document.querySelector("#member-cards img").naturalWidth > 0');
      await screenshot(`${width}-members`);
    }
    await evaluate('document.querySelector("#member-cards > button").focus(); document.querySelector("#member-cards > button").click()');
    await until('document.querySelector("dialog").open');
    assert.equal(await evaluate('document.documentElement.style.overflow'), 'hidden');
    assert(await evaluate('document.querySelector("dialog").contains(document.activeElement)'));
    assert(await evaluate('document.querySelector("dialog").scrollWidth <= document.querySelector("dialog").clientWidth + 1'));
    await key('Tab');
    assert(await evaluate('document.querySelector("dialog").contains(document.activeElement)'));
    await evaluate('document.querySelector("dialog").scrollTop = 10000');
    assert(await evaluate(`(() => { const r=document.querySelector('dialog button').getBoundingClientRect(); return r.top>=0 && r.bottom<=innerHeight; })()`), 'Close remains visible');
    if (width === 390 || width === 1440) {
      await evaluate('document.querySelector("dialog").scrollTop=0');
      await screenshot(`${width}-profile`);
    }
    await key('Escape');
    await until('!document.querySelector("dialog").open && document.documentElement.style.overflow !== "hidden"');
    assert(await evaluate('document.activeElement === document.querySelector("#member-cards > button")'), 'Dialog restores focus');
    console.log(`PASS ${width}px: layout, labels, dialog, keyboard, scroll lock`);
    await key('End');
    assert(await evaluate('document.activeElement === document.querySelector("#member-cards").lastElementChild'), 'End focuses the last portrait');
    await key('ArrowLeft');
    assert(await evaluate('document.activeElement === document.querySelector("#member-cards").children[2]'), 'Left focuses the previous portrait');
    await key('Home');
    await key('ArrowRight');
    assert(await evaluate('document.activeElement === document.querySelector("#member-cards").children[1]'), 'Right focuses the next portrait');
    console.log(`PASS ${width}px: visionary keyboard navigation`);
    await evaluate('document.activeElement.blur(); document.querySelector("#enterprise-cards").scrollIntoView({behavior:"instant",block:"start"}); document.querySelector("#enterprise-cards").scrollTo({left:0,behavior:"instant"})');
    await until('document.querySelector("#businesses button[aria-label^=Previous]").disabled');
    assert.equal(await evaluate('document.querySelectorAll("#enterprise-cards > li").length'), 6);
    assert(await evaluate(`(()=>{const image=document.querySelector('#enterprise-cards > li > a > div'),css=getComputedStyle(image);return Math.abs(image.offsetWidth/image.offsetHeight-(innerWidth<=620?358/373:332/448))<.005 && css.borderRadius==='6px' && getComputedStyle(document.querySelector('#enterprise-cards')).columnGap==='16px';})()`),'Enterprise images follow the reference proportions, corners and gaps');
    assert(await evaluate('[...document.querySelectorAll("#enterprise-cards a")].every(a => /\\/join\\/?$/.test(a.getAttribute("href")))'), 'Each card links to real membership page');
    await evaluate('document.querySelector("#businesses button[aria-label^=Next]").click()');
    await until('document.querySelector("#enterprise-cards").scrollLeft > 20 && !document.querySelector("#businesses button[aria-label^=Previous]").disabled');
    await evaluate('document.querySelector("#enterprise-cards").focus()');
    await key('End');
    await until('document.querySelector("#businesses button[aria-label^=Next]").disabled');
    assert(await evaluate(`(() => {
      const track=document.querySelector('#enterprise-cards');
      return track.lastElementChild.getBoundingClientRect().right <= track.getBoundingClientRect().right + 1;
    })()`), 'Last sector is fully reachable');
    await key('Home');
    await until('document.querySelector("#enterprise-cards").scrollLeft < 2');
    await key('ArrowRight');
    await until('document.querySelector("#enterprise-cards").scrollLeft > 20');
    await key('Home');
    await until('document.querySelector("#enterprise-cards").scrollLeft < 2');
    console.log(`PASS ${width}px: enterprise carousel arrows, keyboard, boundaries, membership links`);
    if (width === 390 || width === 1440) {
      await evaluate('document.activeElement.blur(); window.scrollTo({top:scrollY+document.querySelector("#businesses button").parentElement.getBoundingClientRect().top-100,behavior:"instant"})');
      await until('document.querySelector("#enterprise-cards img").complete && document.querySelector("#enterprise-cards img").naturalWidth > 0');
      await screenshot(`${width}-business-card`);
    }
    await evaluate(`document.querySelector('#stories').scrollIntoView({behavior:'instant'});document.querySelector('#story-gallery button').click()`);
    await until(`document.querySelector('#story-gallery button').getAttribute('aria-pressed')==='true' && document.querySelector('#story-gallery').scrollLeft<2`);
    assert.equal(await evaluate(`document.querySelectorAll('#story-gallery button').length`),4);
    for(let story=0;story<4;story++){
      if(story)await evaluate(`document.querySelector('#stories button[aria-label="Next story"]').click()`);
      await until(`document.querySelectorAll('#story-gallery button')[${story}].getAttribute('aria-pressed')==='true'`);
      if(width<=760)await until(`Math.abs(document.querySelector('#story-gallery').scrollLeft-${story}*(document.querySelector('#story-gallery').clientWidth+16))<2`);
      else await until(`document.querySelectorAll('#story-gallery button')[${story}].getBoundingClientRect().width > document.querySelector('#story-gallery').clientWidth*.6`);
      await until(`document.querySelectorAll('#story-gallery img')[${story}].complete && document.querySelectorAll('#story-gallery img')[${story}].naturalWidth>0`);
      const title=await evaluate(`document.querySelector('#story-detail strong').textContent`);
      await evaluate(`document.querySelector('#story-detail button').focus();document.querySelector('#story-detail button').click()`);
      await until(`document.querySelector('dialog[open] #story-dialog-title')`);
      assert.equal(await evaluate(`document.querySelector('#story-dialog-title').textContent`),title);
      assert.equal(await evaluate(`document.documentElement.style.overflow`),'hidden');
      await key('Escape');
      await until(`!document.querySelector('dialog[open]')`);
      assert(await evaluate(`document.activeElement===document.querySelector('#story-detail button')`),'Story dialog restores reader focus');
    }
    assert(await evaluate(`document.querySelector('#stories button[aria-label="Next story"]').disabled`));
    await evaluate(`document.querySelector('#story-gallery button:last-child').focus({preventScroll:true})`);
    await key('Home');
    await until(`document.querySelector('#story-gallery button').getAttribute('aria-pressed')==='true'`);
    await key('ArrowRight');
    await until(`document.querySelectorAll('#story-gallery button')[1].getAttribute('aria-pressed')==='true'`);
    assert(await evaluate(`document.documentElement.scrollWidth===innerWidth`),'Story gallery causes no page overflow');
    console.log(`PASS ${width}px: four stories, expanding gallery, navigation, images and reader dialogs`);
    if (width === 390 || width === 1440) {
      await evaluate('document.activeElement.blur(); document.querySelector("#impact").scrollIntoView({behavior:"instant",block:"start"})');
      await screenshot(`${width}-impact`, '#impact');
      if (width === 390) {
        for (const section of ['businesses', 'what-we-do', 'impact', 'stories', 'join']) {
          await evaluate(`document.querySelector('#${section}').scrollIntoView({behavior:'instant',block:'start'})`);
          await screenshot(`${width}-${section}`, section === 'impact' ? '#impact' : undefined);
        }
      }
    }
  }

  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await evaluate('document.activeElement.blur(); document.querySelector("#enterprise-cards").scrollIntoView({behavior:"instant"}); document.querySelector("#enterprise-cards").scrollTo({left:0,behavior:"instant"})');
  const copyLeft = await evaluate('document.querySelectorAll("#enterprise-cards li p")[1].getBoundingClientRect().left');
  const hoverPoint = await evaluate('(() => { const r=document.querySelectorAll("#enterprise-cards img")[1].getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2}; })()');
  await send('Input.dispatchMouseEvent', {type:'mouseMoved', ...hoverPoint});
  await until('new DOMMatrix(getComputedStyle(document.querySelectorAll("#enterprise-cards > li > a > div")[1]).transform).a > 1.035');
  assert(await evaluate(`(() => {
    const media=[...document.querySelectorAll('#enterprise-cards > li > a > div')].map(el=>new DOMMatrix(getComputedStyle(el).transform));
    const photo=new DOMMatrix(getComputedStyle(document.querySelectorAll('#enterprise-cards img')[1]).transform);
    return media[0].e < -5 && media[1].e < -5 && media[2].e > 5 && media[1].d===1 && Math.abs(media[1].a*photo.a-1)<.001;
  })()`), 'Hovered media expands horizontally; neighbors shift and the photo keeps its proportions');
  assert.equal(await evaluate('document.querySelectorAll("#enterprise-cards li p")[1].getBoundingClientRect().left'),copyLeft,'Description stays still during media expansion');
  await until('new DOMMatrix(getComputedStyle(document.querySelectorAll("#enterprise-cards a svg")[1]).transform).e > 2.9');
  await screenshot('1440-enterprise-hover', '#businesses');
  await send('Input.dispatchMouseEvent', {type:'mouseMoved', x:0, y:0});
  await until('Math.abs(new DOMMatrix(getComputedStyle(document.querySelectorAll("#enterprise-cards > li > a > div")[1]).transform).a-1)<.0001');
  await key('Tab');
  await evaluate('document.querySelector("#enterprise-cards a").focus()');
  await until('new DOMMatrix(getComputedStyle(document.querySelector("#enterprise-cards > li > a > div")).transform).a > 1.035');
  await send('Emulation.setTouchEmulationEnabled', {enabled:true,maxTouchPoints:1});
  assert(await evaluate('getComputedStyle(document.querySelector("#enterprise-cards img")).transform === "none"'), 'Touch pointers do not get desktop hover motion');
  await send('Emulation.setTouchEmulationEnabled', {enabled:false});
  await evaluate('document.activeElement.blur();document.querySelector("#enterprise-cards").scrollTo({left:0,behavior:"instant"})');
  await send('Input.dispatchMouseEvent', {type:'mouseMoved', ...hoverPoint});
  await send('Input.dispatchMouseEvent', {type:'mousePressed', ...hoverPoint,button:'left',buttons:1,clickCount:1});
  for(let distance=20;distance<=220;distance+=20)await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:hoverPoint.x-distance,y:hoverPoint.y,button:'left',buttons:1});
  await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:hoverPoint.x-220,y:hoverPoint.y,button:'left',buttons:0,clickCount:1});
  await until('document.querySelector("#enterprise-cards").scrollLeft>300 && !document.querySelector("#enterprise-cards").style.scrollSnapType');
  assert(await evaluate('!document.querySelector("#enterprise-cards").dataset.dragging && location.pathname === "/"'), 'Mouse drag snaps without opening the card link');
  await evaluate('document.querySelector("#enterprise-cards").focus()');
  await key('Home');
  await until('document.querySelector("#enterprise-cards").scrollLeft<2 && !document.querySelector("#enterprise-cards").style.scrollSnapType');
  await evaluate('document.querySelector("#businesses button[aria-label^=Next]").click();document.querySelector("#businesses button[aria-label^=Next]").click()');
  await until('!document.querySelector("#enterprise-cards").style.scrollSnapType');
  assert(await evaluate(`(()=>{const track=document.querySelector('#enterprise-cards');return Math.abs(track.scrollLeft-2*(track.firstElementChild.getBoundingClientRect().width+16))<2;})()`),'Rapid arrow clicks advance two cards');
  console.log('PASS enterprise media expansion, neighbors, stable copy, keyboard focus, touch fallback, mouse drag, rapid clicks');

  await evaluate('document.activeElement.blur(); window.scrollTo({top:0,behavior:"instant"})');
  await evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
  await until('document.querySelector("header").dataset.hidden === "false"');
  await evaluate('window.scrollTo({top:700,behavior:"instant"})');
  await until('document.querySelector("header").dataset.hidden === "true"');
  await evaluate('window.scrollTo({top:600,behavior:"instant"})');
  await until('document.querySelector("header").dataset.hidden === "false"');
  console.log('PASS header returns on upward scroll');

  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
  await evaluate('window.scrollTo({top:0,behavior:"instant"}); document.querySelector("header button").focus(); document.querySelector("header button").click()');
  await until('document.querySelector("header button").getAttribute("aria-expanded") === "true"');
  assert(await evaluate('getComputedStyle(document.querySelector("#primary-navigation")).display !== "none"'));
  await key('Escape');
  await until('document.querySelector("header button").getAttribute("aria-expanded") === "false"');
  assert(await evaluate('document.activeElement === document.querySelector("header button")'));
  await evaluate('document.querySelector("header button").click();');
  await until('document.querySelector("header button").getAttribute("aria-expanded") === "true"');
  await evaluate(`document.querySelector('#nav-trigger-0').click()`);
  await until(`document.querySelector('#nav-trigger-0').getAttribute('aria-expanded')==='true'`);
  await evaluate(`document.querySelector('#nav-dropdown-0 a[href="#about"]').click()`);
  await until('document.querySelector("header button").getAttribute("aria-expanded") === "false"');
  console.log('PASS mobile menu: open, Escape, focus restoration, close on navigation');

  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await until(`document.querySelector('#members').dataset.animated === 'true'`);
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await until(`document.querySelector('#members').dataset.animated === 'false'`);
  await evaluate(`document.querySelector('#about').scrollIntoView({block:'start',behavior:'instant'})`);
  assert(await evaluate(`!!document.querySelector('#about figure img') && !document.querySelector('#about video, #about figure button')`),'Belief portrait remains static with reduced motion');
  assert(await evaluate(`[...document.querySelectorAll('#about [data-pillar]')].every(card=>getComputedStyle(card).position==='static')`),'Reduced motion disables the overlapping card stack');
  assert(await evaluate(`[...document.querySelectorAll('[data-scroll-reveal]')].every(el=>{const css=getComputedStyle(el);return css.animationName==='none' && css.opacity==='1' && css.translate==='none' && css.scale==='none';})`),'Reduced motion disables all new entrances and photo movement');
  assert(await evaluate(`getComputedStyle(document.querySelector('#members > div')).position !== 'sticky'`));
  assert(await evaluate('getComputedStyle(document.querySelector("#hero-title").parentElement).animationName === "none"'));
  assert(await evaluate('[...document.querySelectorAll("#member-cards > button strong")].every(el => getComputedStyle(el).visibility === "visible")'));
  await evaluate('document.querySelector("#enterprise-cards a").focus()');
  assert(await evaluate('getComputedStyle(document.querySelector("#enterprise-cards img")).transform === "none" && getComputedStyle(document.querySelector("#enterprise-cards > li > a > div")).transform === "none"'), 'Enterprise movement is disabled with reduced motion');
  await evaluate('document.querySelector("#enterprise-cards").focus()');
  await key('Home');
  assert.equal(await evaluate('document.querySelector("#enterprise-cards").scrollLeft'),0,'Reduced-motion navigation is immediate');
  await evaluate(`document.querySelector('#story-gallery button:last-child').click()`);
  await until(`document.querySelector('#story-gallery button:last-child').getAttribute('aria-pressed')==='true'`);
  assert(await evaluate(`[...document.querySelectorAll('#story-gallery button')].every(el=>getComputedStyle(el).transitionDuration==='0s')`),'Story expansion is immediate with reduced motion');
  await send('Emulation.setEmulatedMedia', { features: [] });
  await evaluate('document.activeElement.blur()');
  for(const [width,height] of [[1440,900],[1440,800],[1440,720],[1280,650],[1024,600],[800,600]]){
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
    await until(`Math.abs(parseFloat(document.querySelector('#about .shell').style.getPropertyValue('--belief-card-height'))-document.querySelector('#about [data-pillar]').getBoundingClientRect().height)<1`);
    for(const index of [0,1,2,0]){
      await evaluate(`(()=>{const stack=document.querySelector('#about .shell'),cards=[...stack.children],top=stack.getBoundingClientRect().top+scrollY+cards.slice(0,${index}).reduce((sum,card)=>sum+card.getBoundingClientRect().height+24,0);scrollTo({top:top-parseFloat(getComputedStyle(cards[0]).top),behavior:'instant'});})()`);
      assert(await evaluate(`(()=>{const card=document.querySelectorAll('#about [data-pillar]')[${index}],r=card.getBoundingClientRect(),css=getComputedStyle(card);return css.position==='sticky' && Math.abs(r.top-parseFloat(css.top))<2 && r.bottom<=innerHeight-14 && document.elementFromPoint(innerWidth/2,innerHeight/2)?.closest('[data-pillar]')===card;})()`),`Cards stack and lower content remains visible at ${width}×${height}`);
    }
    console.log(`PASS ${width}×${height}: adaptive sticky stack and reverse scrolling`);
  }
  assert.deepEqual(errors, [], 'No uncaught browser errors');
  console.log('PASS reduced motion; no uncaught browser errors');
} finally {
  socket.close();
}
