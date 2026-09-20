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
  const windowsVirtualKeyCode = key === 'Escape' ? 27 : 9;
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode });
}
async function screenshot(name) {
  await evaluate('Promise.all(document.getAnimations().filter(a => a.timeline instanceof DocumentTimeline && a.effect.getTiming().iterations !== Infinity).map(a => a.finished.catch(() => {})))');
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile(`/tmp/wisconnect-${name}.png`, Buffer.from(data, 'base64'));
}

try {
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url });
  await until('document.querySelector("#hero-title") && document.readyState === "complete"');
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
        members: [...document.querySelectorAll('#members button')].every(visible),
        labels: [...document.querySelectorAll('#members button strong')].every(visible),
        join: visible(document.querySelector('header a[href$="/join/"]') || document.querySelector('header a[href$="/join"]')),
      };
    })()`);
    assert.deepEqual(layout, { overflow: false, hero: true, members: true, labels: true, join: true }, `Layout at ${width}px: ${JSON.stringify(layout)}`);
    assert(await evaluate(`(() => {
      const frame = getComputedStyle(document.querySelector('.cooperative-editorial'));
      return innerWidth <= 620
        ? frame.padding === '0px' && frame.backgroundColor === 'rgba(0, 0, 0, 0)' && frame.boxShadow === 'none'
        : frame.padding === '12px' && frame.boxShadow !== 'none';
    })()`), 'Cooperative photos lose the outer frame only on mobile');
    if (width <= 620) {
      const cards = await evaluate(`(() => {
        const reference = document.querySelector('.cooperative-photo').getBoundingClientRect();
        const selectors = '.cooperative-photo, #members button, .business-showcase, .stories-grid article, .join-grid a, .program-list article, .impact-grid > div';
        const sameWidth = [...document.querySelectorAll(selectors)].every(card => Math.abs(card.getBoundingClientRect().width - reference.width) < 1);
        const matchingHeights = ['.cooperative-photo, #members button, .business-showcase', '.stories-grid article', '.join-grid a', '.program-list article', '.impact-grid > div'].every(group => {
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
      for (let index = 0; index < 6; index++) {
        await evaluate(`document.querySelectorAll('.sector-tabs button')[${index}].click()`);
        await until(`document.querySelectorAll('.sector-tabs button')[${index}].getAttribute('aria-selected') === 'true'`);
        assert(await evaluate(`(() => {
          const card = document.querySelector('.business-showcase').getBoundingClientRect();
          return [...document.querySelectorAll('.business-copy h3, .business-copy > p:not(.eyebrow)')].every(el => {
            const text = el.getBoundingClientRect(); return text.left >= card.left && text.right <= card.right && text.bottom <= card.bottom;
          });
        })()`), 'Every sector keeps its copy inside the card');
      }
      await evaluate('document.querySelector(".sector-tabs button").click()');
    }
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
      const closedDistance = await evaluate(`Math.abs(document.querySelectorAll('#members button')[0].getBoundingClientRect().left - document.querySelectorAll('#members button')[1].getBoundingClientRect().left)`);
      await evaluate(`(() => {const section=document.querySelector('#members');window.scrollTo({top:scrollY+section.getBoundingClientRect().top+(section.offsetHeight-innerHeight)*.9,behavior:'instant'})})()`);
      await until(`Number(document.querySelector('#members > div').style.getPropertyValue('--member-spread')) > .99`);
      const openDistance = await evaluate(`Math.abs(document.querySelectorAll('#members button')[0].getBoundingClientRect().left - document.querySelectorAll('#members button')[1].getBoundingClientRect().left)`);
      assert(openDistance > closedDistance + 200, 'Portraits spread apart with scroll');
      await screenshot(`${width}-members-open`);
      assert(await evaluate(`(() => {
        const heading=document.querySelector('#members h2').parentElement.parentElement;
        const h=heading.getBoundingClientRect();
        return getComputedStyle(heading).opacity === '1' && [...document.querySelectorAll('#members button')].every(button=>{
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
      await until('[...document.querySelectorAll("#members img")].every(img => img.complete && img.naturalWidth > 0)');
      await screenshot(`${width}-members`);
    }
    await evaluate('document.querySelector("#members button").focus(); document.querySelector("#members button").click()');
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
    assert(await evaluate('document.activeElement === document.querySelector("#members button")'), 'Dialog restores focus');
    console.log(`PASS ${width}px: layout, labels, dialog, keyboard, scroll lock`);
    if (width === 390 || width === 1440) {
      await evaluate('document.activeElement.blur(); document.querySelector(".cooperative-editorial").scrollIntoView({behavior:"instant",block:"start"})');
      await until('document.querySelector(".cooperative-photo-main img").complete && document.querySelector(".cooperative-photo-main img").naturalWidth > 0');
      await until(`[...document.querySelectorAll('.cooperative-photo')].filter(photo => {
        const rect = photo.getBoundingClientRect(); return rect.top >= 0 && rect.bottom <= innerHeight;
      }).every(photo => getComputedStyle(photo).opacity === '1' && photo.querySelector('img').complete && photo.querySelector('img').naturalWidth > 0)`);
      await screenshot(`${width}-cooperative`);
      if (width === 390) {
        for (const section of ['businesses', 'what-we-do', 'impact', 'stories', 'join']) {
          await evaluate(`document.querySelector('#${section}').scrollIntoView({behavior:'instant',block:'start'})`);
          await screenshot(`${width}-${section}`);
          if (section === 'businesses') {
            await evaluate('document.querySelector(".business-showcase").scrollIntoView({behavior:"instant",block:"start"})');
            await until('document.querySelector(".business-visual img").complete && document.querySelector(".business-visual img").naturalWidth > 0');
            await screenshot(`${width}-business-card`);
          }
        }
      }
    }
  }

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
  assert(await evaluate('[...document.querySelectorAll("#members button strong")].every(el => getComputedStyle(el).visibility === "visible")'));
  await send('Emulation.setEmulatedMedia', { features: [] });
  assert.deepEqual(errors, [], 'No uncaught browser errors');
  console.log('PASS reduced motion; no uncaught browser errors');
} finally {
  socket.close();
}
