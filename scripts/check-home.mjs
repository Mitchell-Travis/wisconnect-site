// Start isolated Chrome with --headless --remote-debugging-port=9222 first.
// Run: node scripts/check-home.mjs [site URL]; no browser-test dependency needed.
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const url = process.argv[2] ?? 'http://localhost:3000';
const targets = await fetch('http://127.0.0.1:9222/json/list').then(r => r.json());
const socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
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
  const windowsVirtualKeyCode = { Escape: 27, Tab: 9, ArrowLeft: 37, ArrowRight: 39, Home: 36, End: 35 }[key];
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode });
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
  await send('Runtime.discardConsoleEntries');
  await send('Runtime.enable');
  await send('Page.navigate', { url });
  await until('document.querySelector("#hero-title") && document.readyState === "complete"');
  assert(await evaluate('!document.querySelector(".global-section") && document.querySelector("#impact").nextElementSibling.id === "stories"'), 'Standalone global-reach section is removed; stories follow the impact map');
  for (const width of [320, 390, 620, 768, 1024, 1440, 1920]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
    await evaluate('window.scrollTo({top:0,behavior:"instant"})');
    await until('innerWidth === ' + width);
    await until('Math.abs(document.querySelector("header").getBoundingClientRect().top) < .1');
    await until(`document.querySelector('#members').dataset.animated === String(innerWidth >= 760 && innerHeight >= 720)`);
    const layout = await evaluate(`(() => {
      const visible = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.left >= -1 && r.right <= innerWidth + 1; };
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        hero: visible(document.querySelector('#hero-title')),
        members: [...document.querySelectorAll('#member-cards > button')].filter((_, i) => innerWidth > 620 || i === 0).every(visible),
        labels: [...document.querySelectorAll('#member-cards > button strong')].filter((_, i) => innerWidth > 620 || i === 0).every(visible),
        join: visible(document.querySelector('header a[href$="/join/"]') || document.querySelector('header a[href$="/join"]')),
      };
    })()`);
    assert.deepEqual(layout, { overflow: false, hero: true, members: true, labels: true, join: true }, `Layout at ${width}px: ${JSON.stringify(layout)}`);
    assert(await evaluate(`Math.abs(parseFloat(getComputedStyle(document.querySelector('#enterprises-title')).fontSize) - Math.min(52, Math.max(32, innerWidth * .036))) < .1`), 'Enterprise heading uses the reduced responsive type size');
    assert(await evaluate(`(() => {
      const frame = getComputedStyle(document.querySelector('.cooperative-editorial'));
      return innerWidth <= 620
        ? frame.padding === '0px' && frame.backgroundColor === 'rgba(0, 0, 0, 0)' && frame.boxShadow === 'none'
        : frame.padding === '12px' && frame.boxShadow !== 'none';
    })()`), 'Cooperative photos lose the outer frame only on mobile');
    if (width <= 620) {
      const cards = await evaluate(`(() => {
        const reference = document.querySelector('.cooperative-photo').getBoundingClientRect();
        const selectors = '.cooperative-photo, #member-cards > button, #enterprise-cards > li, .stories-grid article, .join-grid a, .program-list article';
        const sameWidth = [...document.querySelectorAll(selectors)].every(card => Math.abs(card.getBoundingClientRect().width - reference.width) < 1);
        const matchingHeights = ['.cooperative-photo, #member-cards > button, #enterprise-cards > li > div', '#enterprise-cards > li', '.stories-grid article', '.join-grid a', '.program-list article'].every(group => {
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
    assert(await evaluate('getComputedStyle(document.querySelector("#impact-title")).fontFamily.includes("Georgia")'), 'Impact uses the site serif typography');
    assert(await evaluate(`getComputedStyle(document.querySelector('#impact')).backgroundColor === 'rgb(255, 255, 255)' && getComputedStyle(document.querySelector('#impact svg').parentElement).backgroundImage === 'none'`), 'Impact has a clean white background without a map glow');
    assert(await evaluate('fetch(document.querySelector("#impact svg image").getAttribute("href")).then(r => r.ok)'), 'Local geographic map asset loads');
    assert.deepEqual(await evaluate('[...document.querySelectorAll("#impact button")].map(button=>button.textContent)'), ['Liberia','United States','Brazil','Vietnam'], 'Map lists the four requested countries');
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
      await evaluate(`document.querySelectorAll('#impact button')[${index}].click()`);
      await until(`document.querySelectorAll('#impact button')[${index}].getAttribute('aria-pressed') === 'true'`);
      assert(await evaluate(`(() => {
        const buttons=[...document.querySelectorAll('#impact button')];
        return buttons.filter(b=>b.getAttribute('aria-pressed')==='true').length === 1 &&
          buttons.every(b=>b.getBoundingClientRect().height >= 44) &&
          document.querySelectorAll('#impact svg g[data-active=true] > path:last-child').length === (${index} === 0 ? 3 : 1) &&
          document.querySelector('#impact-region-detail').textContent.length > 30;
      })()`), 'Map controls select and highlight each region with accessible touch targets');
    }
    await evaluate('document.querySelector("#impact button").click(); window.scrollTo({top:0,behavior:"instant"})');
    await until('Math.abs(document.querySelector("header").getBoundingClientRect().top) < .1');
    console.log(`PASS ${width}px: serif impact band, map asset, region selections and route highlights`);
    assert(await evaluate(`(() => {
      const header = document.querySelector('header').getBoundingClientRect();
      const ribbon = document.querySelector('.hero-textile-ribbon').getBoundingClientRect();
      const join = document.querySelector('header a[href*="/join"]').getBoundingClientRect();
      return header.height === (innerWidth < 700 ? 65 : innerWidth < 960 ? 69 : 77) &&
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
      const join = document.querySelector('header a[href*="/join"]').getBoundingClientRect();
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
    if (width >= 760) {
      await evaluate(`document.activeElement.blur(); document.querySelector('#members').scrollIntoView({behavior:'instant',block:'start'})`);
      await until(`Number(document.querySelector('#members > div').style.getPropertyValue('--member-spread')) < .1`);
      const closedDistance = await evaluate(`Math.abs(document.querySelectorAll('#member-cards > button')[0].getBoundingClientRect().left - document.querySelectorAll('#member-cards > button')[1].getBoundingClientRect().left)`);
      await evaluate(`(() => {const section=document.querySelector('#members');window.scrollTo({top:scrollY+section.getBoundingClientRect().top+(section.offsetHeight-innerHeight)*.9,behavior:'instant'})})()`);
      await until(`Number(document.querySelector('#members > div').style.getPropertyValue('--member-spread')) > .99`);
      const openDistance = await evaluate(`Math.abs(document.querySelectorAll('#member-cards > button')[0].getBoundingClientRect().left - document.querySelectorAll('#member-cards > button')[1].getBoundingClientRect().left)`);
      assert(openDistance > closedDistance + 200, 'Portraits spread apart with scroll');
      await screenshot(`${width}-members-open`);
      assert(await evaluate(`(() => {
        const heading=document.querySelector('#members h2').parentElement.parentElement;
        const h=heading.getBoundingClientRect();
        return getComputedStyle(heading).opacity === '1' && [...document.querySelectorAll('#member-cards > button')].every(button=>{
          const r=button.getBoundingClientRect();
          return r.top>=0 && r.bottom<=innerHeight && (r.right<=h.left || r.left>=h.right || r.bottom<=h.top || r.top>=h.bottom);
        });
      })()`), 'Open portraits fit the viewport and leave the copy clear');
      console.log(`PASS ${width}px: scroll-open portraits and unobstructed copy`);
      await evaluate('window.scrollTo({top:0,behavior:"instant"})');
      await until(`Number(document.querySelector('#members > div').style.getPropertyValue('--member-spread')) < .1`);
    }
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
    if (width <= 620) {
      await evaluate('document.activeElement.blur(); document.querySelector("#members").scrollIntoView({behavior:"instant"})');
      assert(await evaluate(`(() => {
        const track = document.querySelector('#member-cards');
        const cards = [...track.children].map(card => card.getBoundingClientRect());
        return cards.length === 3 && track.scrollWidth > track.clientWidth &&
          cards.every(card => Math.abs(card.top - cards[0].top) < 1);
      })()`), 'Mobile portraits form a horizontal row');
      await until('document.querySelector("#members button[aria-label^=Previous]").disabled');
      await evaluate('document.querySelector("#members button[aria-label^=Next]").click()');
      await until('Math.abs(document.querySelector("#member-cards").scrollLeft - document.querySelector("#member-cards").children[1].offsetLeft) < 2');
      await evaluate('document.querySelector("#member-cards").children[1].focus(); document.activeElement.click()');
      await until('document.querySelector("dialog").open');
      await key('Escape');
      await until('!document.querySelector("dialog").open');
      assert(await evaluate('document.activeElement === document.querySelector("#member-cards").children[1]'), 'Second profile restores focus to its card');
      if (width === 390) await screenshot('390-members-slide');
      await key('End');
      await until('document.querySelector("#members button[aria-label^=Next]").disabled');
      assert(await evaluate('document.activeElement === document.querySelector("#member-cards").lastElementChild'), 'End focuses the last portrait');
      await key('ArrowLeft');
      await until('Math.abs(document.querySelector("#member-cards").scrollLeft - document.querySelector("#member-cards").children[1].offsetLeft) < 2');
      await key('Home');
      await until('document.querySelector("#members button[aria-label^=Previous]").disabled');
      await key('ArrowRight');
      await until('Math.abs(document.querySelector("#member-cards").scrollLeft - document.querySelector("#member-cards").children[1].offsetLeft) < 2');
      await key('Home');
      await until('document.querySelector("#member-cards").scrollLeft < 2');
      console.log(`PASS ${width}px: mobile visionary row, arrows, keyboard, profile focus restoration`);
    } else {
      assert(await evaluate('document.querySelector("#members button[aria-label^=Next]").getClientRects().length === 0'), 'Member carousel controls stay mobile-only');
    }
    await evaluate('document.activeElement.blur(); document.querySelector("#enterprise-cards").scrollIntoView({behavior:"instant",block:"start"}); document.querySelector("#enterprise-cards").scrollTo({left:0,behavior:"instant"})');
    await until('document.querySelector("#businesses button[aria-label^=Previous]").disabled');
    assert.equal(await evaluate('document.querySelectorAll("#enterprise-cards > li").length'), 6);
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
    if (width === 390 || width === 1440) {
      await evaluate('document.activeElement.blur(); document.querySelector(".cooperative-editorial").scrollIntoView({behavior:"instant",block:"start"})');
      await until('document.querySelector(".cooperative-photo-main img").complete && document.querySelector(".cooperative-photo-main img").naturalWidth > 0');
      await until(`[...document.querySelectorAll('.cooperative-photo')].filter(photo => {
        const rect = photo.getBoundingClientRect(); return rect.top >= 0 && rect.bottom <= innerHeight;
      }).every(photo => getComputedStyle(photo).opacity === '1' && photo.querySelector('img').complete && photo.querySelector('img').naturalWidth > 0)`);
      await screenshot(`${width}-cooperative`);
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
  const hoverPoint = await evaluate('(() => { const r=document.querySelector("#enterprise-cards img").getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2}; })()');
  await send('Input.dispatchMouseEvent', {type:'mouseMoved', ...hoverPoint});
  await until('new DOMMatrix(getComputedStyle(document.querySelector("#enterprise-cards img")).transform).a > 1.04');
  assert(await evaluate('new DOMMatrix(getComputedStyle(document.querySelector("#enterprise-cards > li > div")).transform).f < -2.9'), 'Hovered enterprise image lifts');
  assert(await evaluate('new DOMMatrix(getComputedStyle(document.querySelector("#enterprise-cards a svg")).transform).e > 2.9'), 'Hovered enterprise arrow moves');
  assert(await evaluate('getComputedStyle(document.querySelectorAll("#enterprise-cards img")[1]).transform === "none"'), 'Neighboring cards stay still');
  await screenshot('1440-enterprise-hover', '#businesses');
  await send('Input.dispatchMouseEvent', {type:'mouseMoved', x:0, y:0});
  await until('getComputedStyle(document.querySelector("#enterprise-cards img")).transform === "none"');
  await evaluate('document.querySelector("#enterprise-cards a").focus()');
  await until('new DOMMatrix(getComputedStyle(document.querySelector("#enterprise-cards img")).transform).a > 1.04');
  await send('Emulation.setTouchEmulationEnabled', {enabled:true,maxTouchPoints:1});
  assert(await evaluate('getComputedStyle(document.querySelector("#enterprise-cards img")).transform === "none"'), 'Touch pointers do not get desktop hover motion');
  await send('Emulation.setTouchEmulationEnabled', {enabled:false});
  await evaluate('document.activeElement.blur()');
  console.log('PASS enterprise hover lift, zoom, arrow, reset, keyboard focus, and touch fallback');

  await evaluate('document.activeElement.blur(); window.scrollTo({top:0,behavior:"instant"})');
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
  await evaluate(`document.querySelector('#primary-navigation a[href="#members"]').click()`);
  await until('document.querySelector("header button").getAttribute("aria-expanded") === "false"');
  console.log('PASS mobile menu: open, Escape, focus restoration, close on navigation');

  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await until(`document.querySelector('#members').dataset.animated === 'true'`);
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await until(`document.querySelector('#members').dataset.animated === 'false'`);
  assert(await evaluate(`getComputedStyle(document.querySelector('#members > div')).position !== 'sticky'`));
  assert(await evaluate('getComputedStyle(document.querySelector("#hero-title").parentElement).animationName === "none"'));
  assert(await evaluate('[...document.querySelectorAll("#member-cards > button strong")].every(el => getComputedStyle(el).visibility === "visible")'));
  await evaluate('document.querySelector("#enterprise-cards a").focus()');
  assert(await evaluate('getComputedStyle(document.querySelector("#enterprise-cards img")).transform === "none" && getComputedStyle(document.querySelector("#enterprise-cards > li > div")).transform === "none"'), 'Enterprise movement is disabled with reduced motion');
  await send('Emulation.setEmulatedMedia', { features: [] });
  assert.deepEqual(errors, [], 'No uncaught browser errors');
  console.log('PASS reduced motion; no uncaught browser errors');
} finally {
  socket.close();
}
