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
  await send('Page.navigate', {url});
  await until("document.querySelector('#contact-name') && !document.querySelector('fieldset').disabled");
  assert.equal(await evaluate("document.querySelector('#contact-topic').value"), 'General inquiry');
  for (const width of [320, 390, 768, 1440, 1920]) {
    await send('Emulation.setDeviceMetricsOverride', {width, height:900, deviceScaleFactor:1, mobile:false});
    assert(await evaluate("document.documentElement.scrollWidth<=innerWidth"), 'No horizontal overflow at ' + width);
    assert(await evaluate("[...document.querySelectorAll('form input,form select,form textarea,form button')].filter(e=>e.getClientRects().length).every(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.height>=44})"), 'Controls fit and retain touch height');
  }
  const set = async (field, value) => {
    await evaluate("(()=>{const e=document.getElementById(" + JSON.stringify(field) + ");const proto=e.tagName==='SELECT'?HTMLSelectElement.prototype:e.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(e," + JSON.stringify(value) + ");e.dispatchEvent(new Event(e.tagName==='SELECT'?'change':'input',{bubbles:true}));})()");
  };
  const prepare = () => evaluate("document.querySelector('form').requestSubmit(document.querySelector('button[type=submit]'))");
  await prepare();
  await until("document.querySelectorAll('[aria-invalid=true]').length===3 && document.activeElement.getAttribute('role')==='alert'");
  await set('contact-name', '  Test visitor  ');
  await set('contact-email', 'invalid-email');
  await set('contact-topic', 'Partnerships');
  await set('contact-message', 'Preview & planning\nSecond line.');
  await prepare();
  await until("document.querySelectorAll('[aria-invalid=true]').length===1");
  assert.equal(await evaluate("document.querySelector('[aria-invalid=true]').id"), 'contact-email');
  assert.equal(await evaluate("document.querySelector('#contact-message').value"), 'Preview & planning\nSecond line.', 'Validation preserves answers');
  assert.equal(await evaluate("document.querySelector('#contact-topic').value"), 'Partnerships');
  assert(!await evaluate("!!document.querySelector('#contact-organization') || !!document.querySelector('#contact-country')"), 'Only necessary fields remain');
  assert.equal(await evaluate("document.querySelector('button[type=submit]').textContent.trim()"), 'Submit');
  await set('contact-name', '   ');
  await prepare();
  await until("document.querySelector('#contact-name').getAttribute('aria-invalid')==='true'");
  assert.deepEqual(errors, [], 'No browser errors');
  console.log('PASS: five responsive widths, default topic, simplified controls, validation/focus and retained answers. No inquiry submitted; run npm run contact:check for isolated persistence/delivery checks.');
} finally { socket.close(); }
