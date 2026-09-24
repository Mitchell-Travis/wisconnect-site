// Run with Playwright MCP against localhost:3000. All account API responses are isolated mocks.
async page => {
 const assert=(value,message)=>{if(!value)throw new Error(message)};
 const c=await page.context().browser().newContext();const p=await c.newPage();
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 let scenario='valid',accepted=[],holdAccept,releaseAccept;
 const fakeToken='a'.repeat(43);
 await p.route('http://localhost:8001/auth/**',async route=>{
  const request=route.request(),path=request.url().split('/auth')[1];
  const headers={'Access-Control-Allow-Origin':'http://localhost:3000','Access-Control-Allow-Credentials':'true','Access-Control-Allow-Headers':'Content-Type, X-WisConnect-Request','Access-Control-Allow-Methods':'GET,POST,OPTIONS'};
  if(request.method()==='OPTIONS')return route.fulfill({status:204,headers});
  if(scenario==='offline')return route.abort('failed');
  let status=200,body={};
  if(path==='/invitation'){if(scenario==='expired'){status=410;body={detail:'Your invitation has expired.'}}else body={email:'invited@example.com'}}
  if(path==='/accept'&&request.postDataJSON().password==='12345678901234567890')return route.fulfill({status:422,headers,contentType:'application/json',body:JSON.stringify({detail:'This password is too common or easy to guess. Choose unrelated words or use a password manager.'})});
  if(path==='/accept'){accepted.push(request.postDataJSON());if(holdAccept)await new Promise(resolve=>releaseAccept=resolve);}
  if(path==='/me'){if(scenario==='signed-in')body={name:'Test Member',email:'member@example.com',role:'member'};else {status=401;body={detail:'Not signed in.'}}}
  if(path==='/login'){status=401;body={detail:'Invalid email or password.'}}
  await route.fulfill({status,headers,contentType:'application/json',body:JSON.stringify(body)});
 });
 const fit=()=>p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&[...document.querySelectorAll('main input, main button, main a')].filter(e=>e.getClientRects().length).every(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth}));
 try{
  for(const width of [320,390,768,1440]){
   await p.goto('http://localhost:3000/signup/#token='+fakeToken,{waitUntil:'domcontentloaded'});await p.setViewportSize({width,height:900});await p.locator('#member-name').waitFor();
   assert(await fit(),'Signup fits '+width);
   await p.waitForFunction(()=>location.hash==='');
   await p.getByRole('button',{name:'Show passwords',exact:true}).click();assert(await p.locator('#new-password').getAttribute('type')==='text'&&await p.locator('#confirm-password').getAttribute('type')==='text','Both passwords can be revealed');
   await p.getByRole('button',{name:'Hide passwords',exact:true}).click();
   if(width===390||width===1440)await p.screenshot({path:'/tmp/wisconnect-signup-complete-'+width+'.png',fullPage:true});
  }
  await p.locator('#member-name').fill('Test Member');
  for (const [secret, message] of [['short-password','at least 15'], ['long-test-value-'.repeat(9),'no more than 128'], ['🔑'.repeat(14),'at least 15']]) {
   await p.locator('#new-password').fill(secret); await p.locator('#confirm-password').fill(secret);
   assert(await p.locator('#new-password').inputValue()===secret,'Overlong passwords are not silently truncated');
   await p.getByRole('button',{name:'Create my account',exact:true}).click();
   await p.getByRole('alert').filter({hasText:message}).waitFor();
   assert(accepted.length===0,'Invalid lengths do not reach API');
  }
  await p.locator('#new-password').fill('maple river fog');
  assert((await p.locator('#password-length').innerText()).includes('Length requirement met'),'Exactly 15 characters meets length requirement');
  await p.locator('#confirm-password').fill('maple river fog');
  assert((await p.locator('#password-match').innerText()).includes('Passwords match'),'Matching feedback is immediate');
  await p.locator('#new-password').fill('maple river fog '+'🌿'.repeat(112));
  assert((await p.locator('#password-length').innerText()).includes('Length requirement met'),'128 Unicode code points counted consistently with API');
  await p.locator('#new-password').fill('12345678901234567890');await p.locator('#confirm-password').fill('12345678901234567890');
  await p.getByRole('button',{name:'Create my account',exact:true}).click();await p.getByRole('alert').filter({hasText:'too common'}).waitFor();
  assert(await p.locator('#member-name').count()===1,'Common-password rejection preserves invitation form for retry');
  await p.locator('#member-name').fill('   ');await p.locator('#new-password').fill('a-long-test-passphrase');await p.locator('#confirm-password').fill('a-long-test-passphrase');await p.getByRole('button',{name:'Create my account',exact:true}).click();assert(accepted.length===0,'Whitespace name cannot submit');
  await p.locator('#member-name').fill('  Test Member  ');await p.locator('#confirm-password').fill('a-mismatched-passphrase');await p.getByRole('button',{name:'Create my account',exact:true}).click();await p.getByRole('alert').filter({hasText:'do not match'}).waitFor();assert(accepted.length===0,'Mismatch cannot reach API');
  await p.locator('#confirm-password').fill('a-long-test-passphrase');holdAccept=true;await p.getByRole('button',{name:'Create my account',exact:true}).click();await p.getByRole('button',{name:'Creating your account…',exact:true}).waitFor();assert(await p.getByRole('button',{name:'Creating your account…',exact:true}).isDisabled(),'Submission has a disabled loading state');releaseAccept();holdAccept=false;
  await p.getByRole('link',{name:'Sign in to your account',exact:true}).waitFor();assert(accepted.length===1&&accepted[0].name==='Test Member'&&accepted[0].token===fakeToken,'Activation posts trimmed name and invitation token once');assert(await p.locator('#new-password').count()===0,'Password form removed after activation');
  scenario='expired';await p.goto('http://localhost:3000/signup/#token='+fakeToken);await p.getByRole('alert').filter({hasText:'expired'}).waitFor();assert(await p.getByRole('link',{name:'Get help with your invitation'}).count()===1,'Expired invitation has a help destination');
  scenario='valid';await p.getByRole('button',{name:'Check invitation again'}).click();await p.locator('#member-name').waitFor();
  await p.goto('http://localhost:3000/signup/');await p.getByRole('alert').filter({hasText:'valid invitation'}).waitFor();assert(await p.locator('#member-name').count()===0,'Missing token cannot activate');
  scenario='offline';await p.goto('http://localhost:3000/login/');await p.getByRole('alert').filter({hasText:'unavailable'}).waitFor();scenario='valid';await p.getByRole('button',{name:'Try connecting again'}).click();await p.waitForFunction(()=>!document.querySelector('[role=alert]'));
  await p.locator('#email').fill('test@example.com');await p.locator('#password').fill('invalid-password');await p.getByRole('button',{name:'Show password',exact:true}).click();assert(await p.locator('#password').getAttribute('type')==='text','Login password reveal');await p.getByRole('button',{name:'Sign in',exact:true}).click();await p.getByRole('alert').filter({hasText:'Invalid email'}).waitFor();
  for(const route of ['admin','dashboard']){await p.goto('http://localhost:3000/'+route+'/');await p.getByRole('button',{name:'Sign in',exact:true}).waitFor();assert(!(await p.locator('body').innerText()).includes('Member access · Local test'),'Signed-out routes use the shared entry screen');}
  scenario='signed-in';await p.goto('http://localhost:3000/login/');await p.getByRole('link',{name:'Open member workspace'}).waitFor();
  for(const width of [320,390,768,1440]){
   await p.goto('http://localhost:3000/join/');await p.setViewportSize({width,height:900});await p.getByRole('button',{name:'Let’s get started'}).click();await p.locator('#full-name').fill('Test Member');await p.locator('#email').fill('test@example.com');await p.locator('#location').fill('Monrovia, Liberia');await p.getByRole('button',{name:'Continue',exact:true}).click();await p.locator('#expertise').fill('Accounting');await p.locator('#contribution').fill('Mentorship');await p.getByRole('button',{name:'Review application'}).click();await p.getByRole('link',{name:'Open application email'}).waitFor();assert(await fit(),'Join review fits '+width);
   if(width===390||width===1440)await p.screenshot({path:'/tmp/wisconnect-join-complete-'+width+'.png',fullPage:true});
  }
  assert(errors.length===0,errors.join('\n'));
  return 'PASS: responsive signup, secret-free URL, activation/validation/loading/success, expired/missing invites, service retry, login visibility/error/signed-in state, signed-out protected routes, and all Join steps.';
 }finally{releaseAccept?.();await c.close()}
}
