// Run with Playwright MCP against localhost:3000. API requests are mocked; no real accounts are deleted.
async page => {
  const assert = (value, message) => { if (!value) throw new Error(message); };
  const context = await page.context().browser().newContext();
  const p = await context.newPage();
  const errors = []; p.on('pageerror', error => errors.push(error.message));
  const admin = {id:1, name:'Test Administrator', email:'admin@example.test', role:'admin', active:true};
  const member = {id:2, name:'Test Member', email:'member@example.test', role:'member', active:true};
  let rows = [admin, member], role = 'admin', fail = true, calls = 0, release;
  await p.route('http://localhost:8001/auth/**', async route => {
    const request = route.request(), path = request.url().split('/auth')[1];
    const headers = {'Access-Control-Allow-Origin':'http://localhost:3000','Access-Control-Allow-Credentials':'true','Access-Control-Allow-Headers':'Content-Type, X-WisConnect-Request','Access-Control-Allow-Methods':'GET,DELETE,OPTIONS'};
    if (request.method() === 'OPTIONS') return route.fulfill({status:204, headers});
    if (request.method() === 'DELETE') {
      assert(path === '/members/2', 'Only selected member is deleted'); calls++;
      await new Promise(resolve => release = resolve);
      if (fail) return route.fulfill({status:503,headers,contentType:'application/json',body:JSON.stringify({detail:'Could not delete the account. Try again.'})});
      rows = [admin]; return route.fulfill({status:204,headers});
    }
    const body = path === '/me' ? (role === 'admin' ? admin : member) : path === '/members' ? rows : [];
    await route.fulfill({headers,contentType:'application/json',body:JSON.stringify(body)});
  });
  try {
    for (const width of [320,390,1440]) {
      rows = [admin,member]; fail = true;
      await p.setViewportSize({width,height:950});
      await p.goto('http://localhost:3000/dashboard/');
      await p.locator(width < 640 ? 'nav[aria-label="Mobile dashboard navigation"]' : '#dashboard-navigation').getByRole('button',{name:'Members',exact:true}).click();
      const trigger = p.getByRole('button',{name:'Delete member Test Member',exact:true});
      await trigger.waitFor();
      assert(await p.getByRole('button',{name:'Delete member Test Administrator'}).count() === 0, 'Admin has no delete action');
      await trigger.click();
      const dialog = p.getByRole('dialog',{name:'Delete member account?'});
      await dialog.waitFor();
      assert(await p.evaluate(()=>document.activeElement.textContent==='Cancel'),'Cancel receives initial focus');
      assert((await dialog.innerText()).includes(member.email),'Confirmation identifies email');
      await p.keyboard.press('Escape'); await dialog.waitFor({state:'hidden'});
      assert(await trigger.evaluate(el=>el===document.activeElement),'Escape returns focus');
      const before = calls;
      await trigger.click(); await dialog.getByRole('button',{name:'Cancel',exact:true}).click();
      assert(calls===before,'Cancellation does not delete');
      await trigger.click();
      await p.evaluate(()=>document.documentElement.dataset.dashboardTheme='dark');
      assert(await dialog.getByRole('button',{name:'Delete account',exact:true}).evaluate(el=>getComputedStyle(el).backgroundColor)==='rgb(163, 52, 68)','Dark mode keeps destructive button red');
      if (width === 390) await p.evaluate(()=>document.documentElement.dataset.dashboardTheme='light');
      await p.screenshot({path:'/tmp/wisconnect-delete-member-'+width+'.png',fullPage:true});
      assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No page overflow: '+JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth).map(e=>({tag:e.tagName,cls:e.className,right:e.getBoundingClientRect().right,position:getComputedStyle(e).position})))));
      assert(await dialog.evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;}),'Dialog fits viewport');
      await dialog.getByRole('button',{name:'Delete account',exact:true}).click();
      await p.getByRole('button',{name:'Deleting…',exact:true}).waitFor();
      assert(await dialog.getByRole('button',{name:'Cancel',exact:true}).isDisabled(),'Cannot close pending deletion');
      await p.keyboard.press('Escape'); assert(await dialog.isVisible(),'Escape does not dismiss pending request');
      release(); await dialog.getByRole('alert').waitFor();
      assert(await trigger.count()===1,'Failure retains member row');
      fail=false; await dialog.getByRole('button',{name:'Delete account',exact:true}).click();
      await p.getByRole('button',{name:'Deleting…',exact:true}).waitFor();
      release(); await dialog.waitFor({state:'hidden'}); await trigger.waitFor({state:'hidden'});
      assert(calls===before+2,'One request per attempt');
      await p.getByRole('status').filter({hasText:'account has been deleted'}).waitFor();
      assert(await p.getByRole('row').filter({hasText:admin.name}).count()===1,'Administrator remains');
      await p.reload();
      await p.locator(width < 640 ? 'nav[aria-label="Mobile dashboard navigation"]' : '#dashboard-navigation').getByRole('button',{name:'Members',exact:true}).click();
      await p.getByRole('row').filter({hasText:admin.name}).waitFor();
      assert(await trigger.count()===0,'Deleted member stays removed on reload');
    }
    role='member'; await p.goto('http://localhost:3000/dashboard/');
    await p.getByRole('button',{name:'Account menu for Test Member',exact:true}).waitFor();
    assert(await p.getByRole('button',{name:/Delete member/}).count()===0,'Member has no deletion controls');
    assert(errors.length===0, errors.join('\n'));
    return 'PASS: confirmation/cancel/focus, protected admin, pending/error/retry/success, persisted rows, mobile and dark mode; no real account changes.';
  } finally { await context.close(); }
}
