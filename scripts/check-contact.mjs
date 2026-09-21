// Start isolated Chrome with --headless --remote-debugging-port=9222 first.
// Run: node scripts/check-contact.mjs [site URL]; no browser-test dependency needed.
import assert from 'node:assert/strict';

const url = process.argv[2] ?? 'http://localhost:3000/contact/';
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
try {
  await send('Page.enable');
  await send('Runtime.discardConsoleEntries');
  await send('Runtime.enable');
  await send('Page.navigate',{url});
  await until(`document.querySelector('#contact-email') && document.readyState==='complete' && document.querySelector('header img').complete && document.querySelector('header img').naturalWidth>0`);
  for(const width of [320,390,768,1440,1920]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
    assert(await evaluate(`(()=>{const card=document.querySelector('section[data-step]'),r=card.getBoundingClientRect();return document.documentElement.scrollWidth===innerWidth && r.left>=12 && r.right<=innerWidth-12 && Math.abs(r.width-Math.min(608,innerWidth-2*(innerWidth<=620?28:innerWidth<=959?34:40)))<1 && [...card.querySelectorAll('input,select')].every(e=>e.getBoundingClientRect().height>=48);})()`),'Card and controls fit the measured layout');
    assert(await evaluate(`document.querySelector('header img').naturalWidth>0`),'WisConnect logo loads');
  }
  for(const width of [390,1440]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
    await send('Page.navigate',{url});
    await until(`document.querySelector('#contact-email') && document.readyState==='complete' && document.querySelector('header img').complete && document.querySelector('header img').naturalWidth>0`);
    await evaluate(`document.querySelector('form').requestSubmit()`);
    assert.equal(await evaluate(`document.querySelector('section[data-step]').dataset.step`),'0','Empty first step cannot advance');
    await evaluate(`(()=>{const set=(id,value)=>{const e=document.getElementById(id);Object.getOwnPropertyDescriptor(e.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype,'value').set.call(e,value);e.dispatchEvent(new Event(e.tagName==='SELECT'?'change':'input',{bubbles:true}));};set('contact-email','test@example.com');set('contact-country','LR');})()`);
    await evaluate(`document.querySelector('form').requestSubmit()`);
    await until(`document.querySelector('#contact-name')`);
    await until(`document.activeElement.id==='contact-title'`);
    await evaluate(`document.querySelector('form').requestSubmit()`);
    assert.equal(await evaluate(`document.querySelector('section[data-step]').dataset.step`),'1','A name is required');
    await evaluate(`(()=>{const e=document.querySelector('#contact-name');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,'Test visitor');e.dispatchEvent(new Event('input',{bubbles:true}));})()`);
    await evaluate(`document.querySelector('form').requestSubmit()`);
    await until(`document.querySelector('#contact-message')`);
    assert(await evaluate(`document.querySelector('button[type=submit]').disabled`),'Preview cannot pretend to send a message');
    await evaluate(`(()=>{const e=document.querySelector('#contact-message');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(e,'Design preview only.');e.dispatchEvent(new Event('input',{bubbles:true}));})()`);
    await evaluate(`document.querySelector('ol button').click()`);
    await until(`document.querySelector('#contact-email')`);
    assert.deepEqual(await evaluate(`[document.querySelector('#contact-email').value,document.querySelector('#contact-country').value]`),['test@example.com','LR'],'Previous answers are preserved');
    await evaluate(`document.querySelector('form').requestSubmit()`);
    await until(`document.querySelector('#contact-name')`);
    assert.equal(await evaluate(`document.querySelector('#contact-name').value`),'Test visitor');
    await evaluate(`document.querySelector('form').requestSubmit()`);
    await until(`document.querySelector('#contact-message')`);
    assert.equal(await evaluate(`document.querySelector('#contact-message').value`),'Design preview only.');
    console.log(`PASS ${width}px: validation, three steps, focus, retained answers and disabled delivery`);
  }
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  assert(await evaluate(`document.querySelector('form').getAnimations({subtree:true}).every(a=>a.playState==='finished')`),'Reduced motion stops step animation');
  await send('Emulation.setEmulatedMedia',{features:[]});
  assert.deepEqual(errors,[],'No browser errors');
  console.log('PASS five-width layout and reduced motion');
} finally {socket.close();}
