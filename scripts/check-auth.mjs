// Run through: npm run auth:check -- --browser
// Uses isolated Chrome/CDP on 9222; the Python runner supplies disposable accounts.
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

let input = '';
for await (const chunk of process.stdin) input += chunk;
const settings = JSON.parse(input);
const target = await fetch('http://127.0.0.1:9222/json/new?http://localhost:3000/admin/', {method: 'PUT'}).then(r => r.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
let id = 0;
const pending = new Map();
const errors = [];
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const request = ++id;
    const timer = setTimeout(() => { pending.delete(request); reject(new Error(`Timed out: ${method}`)); }, 20000);
    pending.set(request, message => { clearTimeout(timer); pending.delete(request); message.error ? reject(new Error(JSON.stringify(message.error))) : resolve(message.result); });
    socket.send(JSON.stringify({id: request, method, params}));
  });
}
socket.onmessage = ({data}) => {
  const message = JSON.parse(data);
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
  if (message.method === 'Fetch.requestPaused') {
    const {requestId, request} = message.params;
    void send('Fetch.continueRequest', {requestId, url: request.url.replace('http://localhost:8001', settings.api)}).catch(error => errors.push(error.message));
  }
  pending.get(message.id)?.(message);
};
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', {expression, returnByValue: true, awaitPromise: true});
  assert(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function until(expression) {
  const start = Date.now();
  while (Date.now() - start < 20000) {
    try { if (await evaluate(`Boolean(document.body && (${expression}))`)) return; }
    catch (error) { if (!/navigated|context|Cannot find/i.test(error.message)) throw error; }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`UI condition timed out: ${expression}`);
}
async function navigate(path) {
  await send('Page.navigate', {url: `http://localhost:3000${path}`});
  await until(`location.pathname===${JSON.stringify(path.split('#')[0])} && document.readyState==='complete' && document.querySelector('main') && !document.body.textContent.includes('Checking access…')`);
}
async function fill(name, value) {
  await evaluate(`(()=>{const el=document.querySelector('[name=${name}]');el.value=${JSON.stringify(value)};el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
}
async function submit() { await evaluate(`document.querySelector('form button[type=submit]').click()`); }
async function navigateSection(label) {
  if (label === 'Help' || label === 'My account') {
    await evaluate(`document.querySelector('[popovertarget="account-menu"]').click()`);
    await until(`document.querySelector('#account-menu:popover-open')`);
    await evaluate(`[...document.querySelectorAll('#account-menu button')].find(el=>el.textContent===${JSON.stringify(label === 'Help' ? 'Support' : 'Account settings')}).click()`);
    await until(`document.activeElement.tagName==='H1'`);
    return;
  }
  if (label === 'Invitations') {
    await navigateSection('Members');
    await evaluate(`[...document.querySelectorAll('main button')].find(el=>el.textContent==='Invitations').click()`);
    await until(`document.querySelector('[data-dashboard-view="invitations"]') && document.activeElement.tagName==='H1'`);
    return;
  }
  await evaluate(`(()=>{const label=${JSON.stringify(label)};const direct=[...document.querySelectorAll('nav button')].find(el=>el.getClientRects().length && (el.getAttribute('aria-label')===label || el.textContent===label));if(direct) direct.click();else {document.querySelector('[popovertarget="mobile-more-menu"]').click();[...document.querySelectorAll('#mobile-more-menu button')].find(el=>el.textContent===label).click();}})()`);
  await until(`document.activeElement.tagName==='H1'`);
}
async function signOut() {
  if (await evaluate(`Boolean(document.querySelector('[popovertarget="account-menu"]'))`)) {
    await evaluate(`document.querySelector('[popovertarget="account-menu"]').click()`);
    await until(`document.querySelector('#account-menu:popover-open')`);
  }
  await evaluate(`[...document.querySelectorAll('button')].find(b=>b.textContent==='Sign out').click()`);
  await until(`location.pathname==='/login/' && document.querySelector('form[aria-label="Sign in"]')`);
  assert(await evaluate(`document.querySelector('h1').textContent==='Welcome to WisConnect' && !document.body.textContent.includes('Member access · Local test')`), 'Every sign-out returns to the shared login page');
}
async function screenshot(name) {
  const {data} = await send('Page.captureScreenshot', {format: 'png'});
  await writeFile(`/tmp/wisconnect-auth-${name}.png`, Buffer.from(data, 'base64'));
}
try {
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');
  await send('Network.deleteCookies', {name: 'wisconnect_local_session', domain: 'localhost', path: '/auth'});
  await send('Fetch.enable', {patterns: [{urlPattern: 'http://localhost:8001/auth*', requestStage: 'Request'}]});
  for (const width of [320, 390, 768, 1440, 1920]) {
    await send('Emulation.setDeviceMetricsOverride', {width, height: 900, deviceScaleFactor: 1, mobile: false});
    await navigate('/login/');
    await until(`document.querySelector('form[aria-label="Sign in"]')`);
    assert(await evaluate(`document.querySelector('h1').textContent==='Welcome to WisConnect' && getComputedStyle(document.querySelector('main > div')).textAlign==='center'`));
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('footer')).backgroundColor`), 'rgba(0, 0, 0, 0)', 'Global dark footer must not leak into login');
    assert.deepEqual(await evaluate(`[...document.querySelectorAll('form input')].map(el=>el.placeholder)`), ['Email address', 'Password']);
    assert(await evaluate(`[...document.querySelectorAll('form input')].every(el=>{const s=getComputedStyle(el);return s.backgroundColor==='rgb(244, 244, 245)' && s.borderColor==='rgb(222, 221, 224)' && s.borderWidth==='1px' && el.labels.length===1;})`), 'Empty fields are neutral gray with accessible labels');
    await evaluate(`document.querySelector('[name=email]').focus()`);
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('[name=email]')).backgroundColor`), 'rgb(255, 255, 255)', 'Focused email field turns white');
    assert(await evaluate(`getComputedStyle(document.querySelector('[name=email]')).outlineWidth==='1px'`), 'Keyboard focus is visible without a heavy outline');
    await fill('email', 'appearance@example.test');
    await until(`getComputedStyle(document.querySelector('[name=email]')).borderColor==='rgb(118, 92, 135)'`);
    await fill('email', '');
    await until(`getComputedStyle(document.querySelector('[name=email]')).borderColor==='rgb(222, 221, 224)'`);
    await evaluate(`document.querySelector('[name=password]').focus()`);
    assert(await evaluate(`getComputedStyle(document.querySelector('[name=email]')).backgroundColor==='rgb(244, 244, 245)' && getComputedStyle(document.querySelector('[name=password]')).backgroundColor==='rgb(255, 255, 255)'`), 'Only the active field has a white background');
    await evaluate(`document.querySelector('[name=password]').blur()`);
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('[name=password]')).backgroundColor`), 'rgb(244, 244, 245)', 'Leaving the field restores gray');
    assert(await evaluate(`document.documentElement.scrollWidth<=innerWidth && document.querySelector('form').getBoundingClientRect().width<=440 && [...document.querySelectorAll('main input, main button')].every(el=>{const r=el.getBoundingClientRect();return r.left>=32 && r.right<=innerWidth-32 && r.height>=44;})`), 'Login stays narrow, inset, and touch-friendly');
    await evaluate(`document.querySelector('summary').click()`);
    assert(await evaluate(`document.querySelector('details').open && document.querySelector('details p').textContent.includes('invitation-only')`));
    await evaluate(`document.querySelector('summary').click()`);
    if (width === 390 || width === 1440) await screenshot(`${width}-login`);
    await navigate('/admin/');
    await until(`document.querySelector('form')`);
    assert(await evaluate(`document.documentElement.scrollWidth<=innerWidth && [...document.querySelectorAll('main input, main button, main h1')].every(el=>{const r=el.getBoundingClientRect();const rail=innerWidth<=620?12:innerWidth<=980?18:Math.max(24,(innerWidth-1280)/2);return r.left>=rail+18 && r.right<=innerWidth-rail-18;})`), 'Content stays inset from rails');
    assert(await evaluate(`[...document.querySelectorAll('button,input')].every(el=>el.getBoundingClientRect().height>=44)`));
    await submit();
    assert(await evaluate(`!document.querySelector('form').checkValidity()`));
    if (width === 390 || width === 1440) await screenshot(`${width}-admin`);
  }
  await navigate('/login/');
  await until(`document.querySelector('form[aria-label="Sign in"]')`);
  await fill('email', settings.email);
  await fill('password', settings.password);
  await submit();
  await until(`location.pathname==='/dashboard/' && document.querySelector('[data-dashboard-view="home"]')`);
  assert(await evaluate(`!document.body.textContent.includes('Invite a member.') && !document.body.textContent.includes('Member access · Local test')`), 'Administrator sign-in lands in the dashboard, not the invitation screen');
  await navigate('/login/');
  await until(`document.querySelector('main a[href^="/dashboard"]')`);
  await evaluate(`document.querySelector('main a[href^="/dashboard"]').click()`);
  await until(`location.pathname==='/dashboard/'`);
  await until(`document.querySelector('[data-dashboard-view="home"]')`);
  assert(await evaluate(`document.querySelector('main').textContent.includes('Administrator')`), 'Administrator account retains its role');
  assert.deepEqual(await evaluate(`[...document.querySelectorAll('#dashboard-navigation button')].map(el=>el.textContent)`), ['Home','Members','Businesses','Finance','Projects','Documents','Reports','Team & access'], 'Administrator menu contains only Phase 1 priorities');
  await navigateSection('Members');
  await until(`document.querySelector('tbody tr')`);
  await evaluate(`document.querySelector('button[aria-label="Search members"]').click()`);
  await until(`document.activeElement.getAttribute('aria-label')==='Search members'`);
  await evaluate(`(()=>{const input=document.querySelector('input[aria-label="Search members"]');const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(input,'NO-SUCH-MEMBER');input.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  await until(`document.querySelector('[role=status]').textContent.includes('0 members found') && !document.querySelector('tbody tr')`);
  await evaluate(`document.querySelector('button[aria-label="Close search"]').click()`);
  await until(`document.querySelector('tbody tr') && document.activeElement.getAttribute('aria-label')==='Search members'`);
  await navigateSection('Finance');
  await evaluate(`[...document.querySelectorAll('main button')].find(el=>el.textContent==='Investments').click()`);
  await until(`document.querySelector('[data-dashboard-view="investments"]')`);
  assert(await evaluate(`document.querySelector('#dashboard-navigation [aria-current="page"]').textContent==='Finance'`), 'Investments stays within Finance');
  await navigateSection('Reports');
  await evaluate(`[...document.querySelectorAll('main button')].find(el=>el.textContent==='Impact').click()`);
  await until(`document.querySelector('main caption')?.textContent==='Reports · Impact'`);
  assert(await evaluate(`document.querySelector('main tbody').children.length===0 && document.body.textContent.includes('records and actions are not connected yet')`), 'Report previews never present invented records');
  await navigateSection('Invitations');
  await evaluate(`[...document.querySelectorAll('main button')].find(el=>el.textContent.startsWith('Invite member')).click()`);
  await until(`document.querySelector('dialog[open] form[aria-label="Invite an approved member"]')`);
  assert(await evaluate(`location.pathname==='/dashboard/' && document.querySelector('[data-dashboard-view="invitations"]') && document.querySelector('#dashboard-navigation [aria-current="page"]').textContent==='Members' && document.querySelector('main a[href="http://localhost:8025"]') && !document.body.textContent.includes('Member access · Local test')`), 'Invitations and the local inbox open inside Members');
  await fill('email', settings.member);
  await submit();
  await until(`document.querySelector('dialog[open]')?.textContent.includes('Invitation delivered to the local test inbox')`);
  await evaluate(`[...document.querySelectorAll('dialog button')].find(el=>el.textContent==='Done').click()`);
  await until(`!document.querySelector('dialog') && document.querySelector('tbody tr')`);
  const messages = await fetch('http://localhost:8025/api/v1/messages').then(r => r.json());
  const message = messages.messages.find(m => m.To.some(to => to.Address === settings.member));
  assert(message);
  const mail = await fetch(`http://localhost:8025/api/v1/message/${message.ID}`).then(r => r.json());
  const token = mail.Text.match(/#token=([A-Za-z0-9_-]{43})/)[1];
  await signOut();
  await send('Emulation.setDeviceMetricsOverride', {width: 390, height: 900, deviceScaleFactor: 1, mobile: false});
  await navigate(`/signup/#token=${token}`);
  await until(`document.querySelector('[name=confirm]')`);
  assert.equal(await evaluate('location.hash'), '', 'Invitation is removed from browser URL');
  await screenshot('390-signup');
  await fill('name', 'Browser test member');
  await fill('password', settings.password);
  await fill('confirm', settings.password + 'mismatch');
  await submit();
  await until(`document.querySelector('[role=alert]')?.textContent.includes('do not match')`);
  await fill('confirm', settings.password);
  await submit();
  await until(`document.body.textContent.includes('Your account is ready')`);
  await navigate('/login/');
  await fill('email', settings.member);
  await fill('password', settings.password);
  await submit();
  await until(`location.pathname==='/dashboard/' && document.body.textContent.includes('Browser test member')`);
  for (const width of [320, 390, 480, 620, 760, 768, 1024, 1100, 1280, 1440, 1920]) {
    await send('Emulation.setDeviceMetricsOverride', {width, height: 900, deviceScaleFactor: 1, mobile: false});
    await navigate('/dashboard/');
    await until(`document.querySelector('[data-dashboard-view="home"]')`);
    await evaluate(`document.fonts.ready`);
    assert(await evaluate(`(()=>{const family=getComputedStyle(document.querySelector('main h1')).fontFamily;return [...document.querySelectorAll('aside button, aside a, aside strong, aside span')].every(el=>getComputedStyle(el).fontFamily===family) && [...document.querySelectorAll('nav button')].every(el=>getComputedStyle(el).fontWeight==='400');})()`), 'Sidebar menu, profile, and sign-out use the same Inter family with Railway’s regular-weight navigation');
    assert(await evaluate(`(()=>{const heading=document.querySelector('main h1'),family=getComputedStyle(heading).fontFamily.split(',')[0].replaceAll('"','').trim();return family!==getComputedStyle(document.body).fontFamily.split(',')[0].trim() && [...document.fonts].some(f=>f.family.replaceAll('"','')===family && f.status==='loaded' && f.weight==='100 900') && performance.getEntriesByType('resource').some(r=>r.name.startsWith(location.origin+'/_next/static/media/') && r.name.includes('.woff2'));})()`), 'Dashboard actually loads its self-hosted variable font without changing the global body font');
    assert(await evaluate(`document.documentElement.scrollWidth<=innerWidth && getComputedStyle(document.querySelector('main'),'::before').content==='none' && getComputedStyle(document.querySelector('main'),'::after').content==='none'`), 'Dashboard uses its own perimeter, not landing-page rails');
    assert(await evaluate(`(()=>{const main=document.querySelector('main').getBoundingClientRect();return [...document.querySelectorAll('main section')].every(el=>{const r=el.getBoundingClientRect();return r.left>=main.left+16 && r.right<=main.right-16;});})()`), 'Dashboard cards stay inset from the workspace frame');
    assert(await evaluate(`(()=>{const cards=[...document.querySelectorAll('main section')];const grid=cards[0].parentElement;const gap=16;return getComputedStyle(grid).gap===gap+'px' && cards.every(el=>getComputedStyle(el).padding===(innerWidth<=480?'16px':'20px')) && cards[2].getBoundingClientRect().top-grid.getBoundingClientRect().bottom===gap && document.querySelector('h1').getBoundingClientRect().left===cards[0].getBoundingClientRect().left;})()`), 'Dashboard uses reference card gaps, responsive padding, and aligned heading/card edges');
    if (width >= 1280) assert(await evaluate(`(()=>{const main=document.querySelector('main').getBoundingClientRect(),heading=document.querySelector('h1'),grid=document.querySelector('main section').parentElement.getBoundingClientRect();return grid.width===826 && Math.abs((grid.left-main.left)-(main.right-grid.right))<=16 && getComputedStyle(heading).fontSize==='28px' && main.left===220 && main.top===56 && getComputedStyle(document.querySelector('main')).borderRadius==='8px' && document.querySelector('[aria-label="Workspace context"]').getBoundingClientRect().height===56;})()`), 'Desktop matches Railway proportions: 826px column, 220px sidebar, 56px workspace header and 8px frame corners');
    assert(await evaluate(`document.body.textContent.includes('Signed in') && document.body.textContent.includes('Not connected yet') && ![...document.querySelectorAll('nav button')].some(el=>el.textContent==='Invitations')`), 'Member data and unconnected updates are honest; admin navigation is absent');
    assert(await evaluate(`[...document.querySelectorAll('nav button, aside button')].filter(el=>el.getClientRects().length).every(el=>el.getBoundingClientRect().height>=(matchMedia('(min-width: 761px) and (pointer: fine)').matches?36:44))`), 'Navigation is compact on desktop and retains larger touch targets');
    assert.deepEqual(await evaluate(`[...document.querySelectorAll('#dashboard-navigation button')].map(el=>el.textContent)`), ['Home','My membership','My business','Documents'], 'Members see only their Phase 1 record areas');
    assert(await evaluate(`[...document.querySelectorAll('main section')].every(el=>{const s=getComputedStyle(el);return s.borderRadius==='8px' && parseFloat(s.borderWidth)===1 && s.borderColor==='rgba(0, 0, 0, 0.12)' && s.boxShadow==='none';}) && [...document.querySelectorAll('main a')].every(el=>{const s=getComputedStyle(el),icon=el.firstElementChild.getBoundingClientRect();return el.getBoundingClientRect().height>=44 && s.borderTopWidth==='0px' && icon.width===36 && icon.height===36;})`), 'Cards use the flatter Railway surface and compact, divider-free resource rows retain touch targets');
    await evaluate(`document.querySelector('main a').focus({preventScroll:true})`);
    assert(await evaluate(`getComputedStyle(document.activeElement).outlineStyle==='solid' && getComputedStyle(document.activeElement).backgroundColor==='rgb(245, 245, 245)'`), 'Resource keyboard focus is visibly highlighted');
    await evaluate(`document.activeElement.blur()`);
    if (width === 390 || width === 1440) await screenshot(`${width}-dashboard`);
    await evaluate(`document.querySelector('[popovertarget="account-menu"]').click()`);
    await until(`document.querySelector('#account-menu:popover-open') && document.activeElement.textContent==='Account settings'`);
    assert(await evaluate(`(()=>{const r=document.querySelector('#account-menu').getBoundingClientRect();return r.left>=0 && r.right<=innerWidth && r.top>=0 && r.bottom<=innerHeight;})()`), 'Account menu stays within the viewport');
    await evaluate(`[...document.querySelectorAll('#account-menu button')].find(el=>el.textContent==='Account settings').click()`);
    await until(`document.querySelector('[data-dashboard-view="account"]') && document.activeElement.tagName==='H1'`);
    assert(await evaluate(`document.querySelector('#profile-email').value===${JSON.stringify(settings.member)} && document.querySelector('#profile-name').value==='Browser test member'`), 'My account shows the authenticated profile');
    assert(await evaluate(`document.documentElement.scrollWidth<=innerWidth && document.querySelector('h1').textContent==='Account settings' && document.querySelectorAll('main section').length===3 && document.querySelector('#profile-email').readOnly && document.querySelector('form[aria-label="Update account information"]') && !document.querySelector('dialog')`), 'Settings uses Railway inline account information, access and support sections');
    if (width > 760) {
      assert(await evaluate(`(()=>{const main=document.querySelector('main');main.scrollTop=10000;return main.scrollTop===Math.max(0,main.scrollHeight-main.clientHeight) && scrollY===0 && document.querySelector('aside').getBoundingClientRect().top===0 && document.querySelector('[aria-label="Workspace context"]').getBoundingClientRect().top===0;})()`), 'Desktop content scrolls independently of the sidebar and header');
    }
    await navigateSection('Help');
    assert(await evaluate(`document.querySelector('main').scrollTop===0`), 'Changing sections resets workspace scrolling');
    await until(`document.querySelector('[data-dashboard-view="help"]')`);
    assert(await evaluate(`document.querySelector('main').textContent.includes('not connected yet')`));
    await navigateSection('Home');
    await until(`document.querySelector('[data-dashboard-view="home"]')`);
    assert.deepEqual(await evaluate(`[...document.querySelectorAll('main a')].map(el=>el.getAttribute('href'))`), ['/#cooperative', '/#members', '/#businesses']);
  }
  await navigateSection('My account');
  await until(`document.querySelector('form[aria-label="Update account information"]')`);
  await fill('name', '  Browser test member updated  ');
  await submit();
  await until(`document.querySelector('[role=status]')?.textContent.includes('Your name has been updated')`);
  await navigate('/dashboard/');
  await until(`document.querySelector('button[aria-label="Account menu for Browser test member updated"]')`);
  assert(await evaluate(`document.querySelector('main').textContent.includes('Browser test member updated')`), 'Saved profile name persists across a fresh page load');
  await signOut();
  assert.equal(await evaluate(`!!document.querySelector('[data-dashboard-view]')`), false, 'Signing out removes the member workspace');
  await fill('email', settings.member);
  await fill('password', settings.password);
  await submit();
  await until(`document.querySelector('[data-dashboard-view="home"]')`);
  await navigate('/login/');
  assert(await evaluate(`Boolean(document.body.textContent.includes('already signed in') && document.querySelector('main a[href^="/dashboard"]'))`), 'Signed-in members can continue to their own account');
  await navigate('/admin/');
  await until(`document.body.textContent.includes('Only administrators can issue invitations')`);
  assert.equal(await evaluate(`!!document.querySelector('form')`), false);
  await signOut();
  await navigate('/dashboard/');
  assert(await evaluate(`!!document.querySelector('form[aria-label="Sign in"]')`));
  await navigate(`/signup/#token=${token}`);
  await until(`document.querySelector('[role=alert]')`);
  assert.equal(await evaluate(`!!document.querySelector('form')`), false);
  await navigate('/signup/');
  assert(await evaluate(`document.body.textContent.includes('You need a valid invitation')`));
  assert.deepEqual(errors, []);
  console.log('PASS: Chrome admin → invitation → account creation → member login, role denial, logout, invalid links, five-width auth rails, and eleven-width dashboard spacing.');
} finally {
  await send('Fetch.disable');
  socket.close();
  await fetch(`http://127.0.0.1:9222/json/close/${target.id}`);
}
