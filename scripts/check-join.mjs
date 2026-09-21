// Start isolated Chrome with --headless --remote-debugging-port=9222.
// Run: node scripts/check-join.mjs [join URL]. No email is opened or sent.
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';

const url=process.argv[2]??'http://localhost:3000/join/';
const targets=await fetch('http://127.0.0.1:9222/json/list').then(r=>r.json());
const socket=new WebSocket(targets.find(target=>target.type==='page').webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
let id=0;
const pending=new Map();
const errors=[];
socket.onmessage=({data})=>{
  const message=JSON.parse(data);
  if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.text);
  if(message.method==='Runtime.consoleAPICalled'&&message.params.type==='error')errors.push(message.params.args.map(arg=>arg.value??arg.description).join(' '));
  pending.get(message.id)?.(message);
};
function send(method,params={}){
  return new Promise((resolve,reject)=>{
    const request=++id;
    const timeout=setTimeout(()=>{pending.delete(request);reject(new Error(`Timed out: ${method}`));},15000);
    pending.set(request,message=>{clearTimeout(timeout);pending.delete(request);message.error?reject(new Error(JSON.stringify(message.error))):resolve(message.result);});
    socket.send(JSON.stringify({id:request,method,params}));
  });
}
async function evaluate(expression){
  const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
  assert(!result.exceptionDetails,JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function until(expression){
  await evaluate(`new Promise((resolve,reject)=>{const start=Date.now();const check=()=>{if(${expression})resolve(true);else if(Date.now()-start>10000)reject(new Error(${JSON.stringify(expression)}));else setTimeout(check,50);};check();})`);
}
async function step(number){
  await until(`document.querySelector('main').dataset.step==='${number}'`);
  await evaluate(`Promise.all(document.getAnimations().filter(a=>a.effect.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})))`);
  assert.equal(await evaluate(`document.querySelector('[aria-current="step"]').textContent.endsWith(${JSON.stringify(['Welcome','About you','Your contribution','Review'][number])})`),true);
  if(number)assert(await evaluate(`document.activeElement.id==='step-title'`),'Step change moves keyboard focus to its heading');
  assert(await evaluate(`document.documentElement.scrollWidth<=innerWidth && [...document.querySelectorAll('#application input, #application textarea, #application button, #application a, #application nav li')].filter(el=>el.getClientRects().length).every(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;})`),'Controls and progress fit the viewport');
  assert(await evaluate(`[...document.querySelectorAll('#application button, #application a')].filter(el=>el.getClientRects().length).every(el=>el.getBoundingClientRect().height>=44)`),'Controls retain touch targets');
}
async function fill(name,value){
  await evaluate(`(()=>{const input=document.querySelector('[name=${name}]');const prototype=input.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(prototype,'value').set.call(input,${JSON.stringify(value)});input.dispatchEvent(new Event('input',{bubbles:true}));})()`);
}
async function submit(){await evaluate(`document.querySelector('form button[type=submit]').click()`);}
async function screenshot(name){
  const {data}=await send('Page.captureScreenshot',{format:'png'});
  await writeFile(`/tmp/wisconnect-join-${name}.png`,Buffer.from(data,'base64'));
}

try{
  await send('Page.enable');
  await send('Runtime.discardConsoleEntries');
  await send('Runtime.enable');
  await send('Emulation.setEmulatedMedia',{features:[]});
  for(const width of [320,390,620,768,900,1024,1440,1920]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
    await send('Page.navigate',{url});
    await until(`document.querySelector('#step-title') && document.readyState==='complete'`);
    await step(0);
    assert(await evaluate(`document.querySelector('#application').textContent.includes('email app')`),'Email delivery is disclosed before starting');
    if(width===390||width===1440)await screenshot(`${width}-welcome`);
    await submit();
    await step(1);
    if(width===390){
      await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
      await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
      assert.equal(await evaluate('document.activeElement.id'),'full-name','Keyboard continues from the heading into the first field');
    }
    await submit();
    assert.equal(await evaluate(`document.querySelector('main').dataset.step`),'1','Empty required fields block progression');
    await fill('name','   ');
    await fill('email','invalid');
    await fill('location','Monrovia, Liberia');
    await submit();
    assert(await evaluate(`document.querySelector('[name=email]').validity.typeMismatch`),'Invalid email is rejected');
    await fill('email','test+cooperative@example.com');
    await submit();
    assert(await evaluate(`document.querySelector('[name=name]').validity.customError`),'Whitespace-only answers are rejected');
    await fill('name','Amina & Joël');
    if(width===390){
      await evaluate(`document.querySelector('[name=name]').focus()`);
      await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'});
      await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
    }else await submit();
    await step(2);
    await fill('expertise','I run a textile business & teach design.');
    await fill('contribution','   ');
    await submit();
    assert(await evaluate(`document.querySelector('[name=contribution]').validity.customError`),'Contribution requires meaningful text');
    await fill('contribution','Mentorship, local connections, and practical skills.');
    await evaluate(`document.querySelector('form button[type=button]').click()`);
    await step(1);
    assert.equal(await evaluate(`document.querySelector('[name=name]').value`),'Amina & Joël','Back preserves personal details');
    if(width===390||width===1440)await screenshot(`${width}-details`);
    await submit();
    await step(2);
    assert.equal(await evaluate(`document.querySelector('[name=expertise]').value`),'I run a textile business & teach design.','Forward preserves contribution');
    await submit();
    await step(3);
    assert.equal(await evaluate(`document.querySelectorAll('dd').length`),5,'Review includes all five fields');
    await evaluate(`document.querySelector('[aria-label="Edit your personal details"]').click()`);
    await step(1);
    await fill('name','Amina & Joël Updated');
    assert.equal(await evaluate(`document.querySelector('button[type=submit]').textContent`),'Save and review');
    await submit();
    await step(3);
    assert.equal(await evaluate(`document.querySelector('dd').textContent`),'Amina & Joël Updated');
    await evaluate(`document.querySelector('[aria-label="Edit your contribution"]').click()`);
    await step(2);
    await fill('contribution','Mentorship & introductions\nAcross communities.');
    await submit();
    await step(3);
    const email=await evaluate(`document.querySelector('form a[href^="mailto:"]').href`);
    const parsed=new URL(email);
    assert.equal(parsed.pathname,'hello@wisconnect.co');
    assert.equal(parsed.searchParams.get('subject'),'Membership application — Amina & Joël Updated');
    assert(parsed.searchParams.get('body').includes('Mentorship & introductions\nAcross communities.'));
    assert(parsed.searchParams.get('body').includes('Email: test+cooperative@example.com'));
    // Test the handoff message without launching an email application.
    await evaluate(`(()=>{const link=document.querySelector('form a[href^="mailto:"]');link.addEventListener('click',event=>event.preventDefault(),{once:true});link.click();})()`);
    await until(`document.querySelector('form').textContent.includes('Nothing has been submitted through this website.')`);
    if(width===390||width===1440)await screenshot(`${width}-review`);
    if(width===1440){
      await evaluate(`Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__copiedApplication=text;}}});[...document.querySelectorAll('form button')].find(button=>button.textContent==='Copy application instead').click()`);
      await until(`document.querySelector('form').textContent.includes('Copied. Paste it')`);
      assert.equal(await evaluate('window.__copiedApplication'),parsed.searchParams.get('body'));
      await evaluate(`navigator.clipboard.writeText=async()=>{throw new Error('Permission denied')};[...document.querySelectorAll('form button')].find(button=>button.textContent==='Copy application instead').click()`);
      await until(`document.querySelector('form').textContent.includes('Copy isn’t available here.')`);
      await evaluate(`document.querySelector('form details summary').click()`);
      assert.equal(await evaluate(`document.querySelector('#application-text').value`),parsed.searchParams.get('body'),'Manual copy fallback retains the complete application');
    }
    console.log(`PASS ${width}px: all steps, validation, focus, retained answers, edits, review and encoded email handoff`);
  }
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await evaluate(`document.querySelector('[aria-label="Edit your personal details"]').click()`);
  await step(1);
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('#step-title').parentElement).animationName`),'none','Reduced motion disables step transitions');
  await send('Emulation.setEmulatedMedia',{features:[]});
  assert.deepEqual(errors,[],'No browser or hydration errors');
  console.log('PASS clipboard success/failure, manual copy fallback, reduced motion and no browser errors');
}finally{socket.close();}
