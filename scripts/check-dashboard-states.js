// Run with Playwright MCP browser_run_code_unsafe({ filename: absolute path to this file }).
// Mocked API in a separate tab: never sends email or changes a real account.
async (page) => {
  const context = await page.context().browser().newContext({ colorScheme: 'light' });
  const p = await context.newPage();
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const calls = [];
  const errors = [];
  const user = { name: 'Test Administrator', email: 'admin@example.test', role: 'admin' };
  const members = [{ ...user, id: 1, active: true }];
  let invitations = [];
  let meStatus = 200, memberStatus = 200, invitationStatus = 200, sendStatus = 503, revokeStatus = 503;
  let memberRows = members, memberGate, inviteGate, sendGate, meGate, logoutGate;
  let release;
  const hold = () => new Promise(resolve => { release = resolve; });
  p.on('pageerror', err => errors.push(err.message));
  await p.route('http://localhost:8001/auth/**', async route => {
    const request = route.request(), path = request.url().split('/auth')[1], method = request.method();
    calls.push(`${method} ${path}`);
    let status = 200, json;
    if (path === '/me') {
      if (meGate) await meGate;
      status = meStatus;
      if (method === 'PATCH') user.name = request.postDataJSON().name;
      json = status === 200 ? user : { detail: status === 401 ? 'Please sign in again.' : 'Session temporarily unavailable.' };
    } else if (path === '/members') {
      if (memberGate) await memberGate;
      status = memberStatus; json = status === 200 ? memberRows : { detail: 'Members temporarily unavailable.' };
    } else if (path === '/invitations' && method === 'GET') {
      if (inviteGate) await inviteGate;
      status = invitationStatus; json = status === 200 ? invitations : { detail: 'Invitations temporarily unavailable.' };
    } else if (path === '/invitations' && method === 'POST') {
      if (sendGate) await sendGate;
      status = sendStatus;
      if (status === 200) invitations = [{ id: 8, email: request.postDataJSON().email, status: 'pending', expires_at: '2026-10-01T12:00:00Z' }];
      json = status === 200 ? { message: 'Invitation delivered to the local test inbox.' } : { detail: 'Could not deliver invitation. Try again.' };
    } else if (path === '/invitations/8' && method === 'DELETE') {
      status = revokeStatus; json = status === 200 ? {} : { detail: 'Could not revoke invitation. Try again.' };
      if (status === 200) invitations[0].status = 'revoked';
    } else if (path === '/logout') {
      if (logoutGate) await logoutGate;
      meStatus = 401; json = {};
    } else { errors.push(`Unexpected API call ${method} ${path}`); status = 404; json = {}; }
    await route.fulfill({ status, json });
  });
  const visible = selector => p.locator(selector).waitFor({ state: 'visible' });
  const nav = async name => {
    const direct = p.getByRole('navigation').getByRole('button', { name, exact: true });
    if (await direct.isVisible()) await direct.click();
    else {
      await p.getByRole('button', { name: 'More sections', exact: true }).click();
      await p.getByRole('menu', { name: 'More sections', exact: true }).getByRole('menuitem', { name, exact: true }).click();
    }
  };
  const openMenu = async () => { await p.locator('[popovertarget="account-menu"]').click(); await visible('#account-menu:popover-open'); };
  const requestCount = path => calls.filter(call => call === path).length;
  const memberHeaders = async () => assert(JSON.stringify(await p.getByRole('columnheader').allTextContents()) === JSON.stringify(['Member', 'Role', 'Account status']), 'Members table headers persist in every request state');
  try {
    await p.setViewportSize({ width: 1440, height: 900 });
    meGate = hold();
    await p.goto('http://localhost:3000/dashboard/');
    await p.getByText('Loading your workspace…', { exact: true }).waitFor();
    assert(!(await p.getByText('Welcome back.', { exact: true }).count()), 'No old login flash while checking access');
    release(); meGate = null;
    await visible('[data-dashboard-view="home"]');
    assert(!requestCount('GET /members') && !requestCount('GET /invitations'), 'Home fetches neither member nor invitation records');

    memberGate = hold(); await nav('Members');
    await p.getByText('Loading members…', { exact: true }).waitFor();
    await memberHeaders();
    assert(!(await p.getByText('No member accounts yet', { exact: true }).count()), 'Pending members must not look empty');
    memberStatus = 503; release(); memberGate = null;
    await p.getByText('Could not load members', { exact: true }).waitFor();
    await memberHeaders();
    memberStatus = 200; await p.getByRole('button', { name: 'Try again' }).click(); await visible('tbody tr');
    await p.getByRole('button', { name: 'Search members' }).click();
    await p.getByRole('searchbox').fill('NO SUCH MEMBER');
    await p.getByText('No matching members', { exact: true }).waitFor();
    await memberHeaders();
    await p.getByRole('button', { name: 'Clear search' }).click(); await visible('tbody tr');

    await p.getByRole('button', { name: 'Invite member', exact: true }).click();
    await p.getByRole('dialog').waitFor();
    assert(await p.locator('#invite-email').evaluate(el => el === document.activeElement), 'Invite focuses email');
    await p.keyboard.press('Escape');
    assert(await p.getByRole('button', { name: 'Invite member', exact: true }).evaluate(el => el === document.activeElement), 'Escape restores Invite focus');
    await p.getByRole('button', { name: 'Invite member', exact: true }).click();
    await p.getByRole('button', { name: 'Send invitation', exact: true }).click();
    assert(!requestCount('POST /invitations'), 'Required email blocks empty submission');
    await p.locator('#invite-email').fill('member@example.test'); sendGate = hold();
    await p.getByRole('button', { name: 'Send invitation', exact: true }).click();
    await p.getByRole('button', { name: 'Sending invitation…', exact: true }).waitFor();
    await p.keyboard.press('Escape');
    assert(await p.getByRole('dialog').isVisible() && await p.locator('#invite-email').isDisabled(), 'Pending send stays open and locks fields');
    release(); sendGate = null;
    await p.getByRole('dialog').getByRole('alert').waitFor();
    assert(await p.locator('#invite-email').inputValue() === 'member@example.test', 'Failure retains entered email');
    sendStatus = 200;
    await p.getByRole('button', { name: 'Send invitation', exact: true }).click();
    await p.getByText('Invitation sent', { exact: true }).waitFor();
    assert(requestCount('POST /invitations') === 2 && !requestCount('GET /invitations'), 'Single send per attempt; history stays on demand');
    await p.getByRole('button', { name: 'Done', exact: true }).click();

    inviteGate = hold(); await p.getByRole('main').getByRole('button', { name: 'Invitations', exact: true }).click();
    await p.getByText('Loading invitations…', { exact: true }).waitFor();
    assert(!(await p.getByText('No invitations yet', { exact: true }).count()), 'Pending invitations must not look empty');
    release(); inviteGate = null; await visible('tbody tr');
    await p.getByRole('button', { name: 'Revoke invitation for member@example.test' }).click();
    await p.getByRole('main').getByRole('alert').waitFor(); assert(await p.locator('tbody').innerText().then(t => t.includes('pending')), 'Failed revoke keeps pending record');
    revokeStatus = 200; await p.getByRole('button', { name: 'Revoke invitation for member@example.test' }).click();
    await p.getByText('Invitation revoked. Its link can no longer be used.', { exact: true }).waitFor();

    await nav('Home'); invitations = []; await nav('Members');
    await p.getByRole('main').getByRole('button', { name: 'Invitations', exact: true }).click();
    await p.getByText('No invitations yet', { exact: true }).waitFor();
    await p.getByRole('button', { name: 'Invite a member', exact: true }).click();
    await p.locator('#invite-email').fill('another@example.test'); invitationStatus = 503;
    await p.getByRole('button', { name: 'Send invitation', exact: true }).click();
    await p.getByText('Invitation sent', { exact: true }).waitFor();
    await p.getByRole('button', { name: 'Done', exact: true }).click();
    await p.getByText('Could not load invitations', { exact: true }).waitFor();
    invitationStatus = 200; await p.getByRole('button', { name: 'Try again' }).click(); await visible('tbody tr');

    for (const width of [320, 390, 639, 640, 768, 1440]) {
      await p.setViewportSize({ width, height: 900 }); await nav('Members'); await visible('tbody tr');
      const dock = p.getByRole('navigation', { name: 'Mobile dashboard navigation' });
      assert(await dock.isVisible() === (width < 640), 'Railway breakpoint switches mobile dock and sidebar at 640px');
      if (width < 640) {
        const shell = await p.evaluate(() => ({ header: document.querySelector('[aria-label="Workspace context"]').getBoundingClientRect().height, mainTop: document.querySelector('main').getBoundingClientRect().top, overflow: document.documentElement.scrollWidth > innerWidth }));
        assert(shell.header === 56 && shell.mainTop === 56 && !shell.overflow, 'One 56px mobile header above the bordered workspace');
        await p.getByRole('button', { name: 'More sections', exact: true }).click();
        await visible('#mobile-more-menu:popover-open');
        const more = await p.locator('#mobile-more-menu').boundingBox();
        assert(more.width === 220 && more.x >= 16 && more.x + more.width <= width - 16 && more.y >= 0 && more.y + more.height < (await dock.boundingBox()).y, 'More menu fits above the dock');
        await p.keyboard.press('End');
        assert(await p.getByRole('menuitem', { name: 'Support', exact: true }).evaluate(el => el === document.activeElement), 'More menu supports keyboard navigation');
        await p.keyboard.press('Escape');
        assert(await p.getByRole('button', { name: 'More sections', exact: true }).evaluate(el => el === document.activeElement), 'More menu restores trigger focus');
        await nav('Businesses'); await visible('[data-dashboard-view="businesses"]');
        await nav('Reports'); await visible('[data-dashboard-view="reports"]');
        await nav('Team & access'); await visible('[data-dashboard-view="team"]');
        await nav('Account settings'); await visible('[data-dashboard-view="account"]');
        await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        const scrollDock = await dock.boundingBox();
        assert(scrollDock.y + scrollDock.height <= 884, 'Dock remains reachable while scrolling');
        await nav('Members'); await visible('tbody tr');
        assert(await p.evaluate(() => scrollY === 0), 'Changing sections resets mobile page scroll');
        if (width === 390) await p.screenshot({ path: '/tmp/wisconnect-mobile-shell-checked.png' });
      }

      const bell = p.getByRole('button', { name: 'Notifications', exact: true });
      await bell.click(); await visible('#notifications-panel:popover-open');
      assert(await p.getByRole('dialog', { name: 'Notifications', exact: true }).getByText('Notification feed not connected yet', { exact: true }).isVisible(), 'Notification panel discloses its unconnected feed');
      const notifications = await p.locator('#notifications-panel').boundingBox();
      assert(notifications.x >= 16 && notifications.x + notifications.width <= width - 16 && notifications.width <= 380 && notifications.y + notifications.height <= 884, `Notifications fit ${width}`);
      if (width === 390 || width === 1440) await p.screenshot({ path: `/tmp/wisconnect-notifications-${width}.png` });
      await p.keyboard.press('Escape');
      await p.waitForFunction(() => { const bell = document.querySelector('[aria-label="Notifications"]'); return bell === document.activeElement && bell.getAttribute('aria-expanded') === 'false'; });
      await bell.click(); await p.getByRole('button', { name: 'Close notifications' }).click();
      assert(!(await p.locator('#notifications-panel:popover-open').count()), 'Close dismisses notifications');
      await bell.click(); await p.mouse.click(2, 2);
      assert(!(await p.locator('#notifications-panel:popover-open').count()), 'Outside click dismisses notifications');
      await bell.click(); await openMenu();
      assert(!(await p.locator('#notifications-panel:popover-open').count()), 'Opening the profile closes notifications');
      assert(await p.getByRole('menuitem', { name: 'Account settings' }).evaluate(el => el === document.activeElement), 'Menu focuses first action');
      await p.keyboard.press('End');
      assert(await p.getByRole('menuitem', { name: 'Sign out' }).evaluate(el => el === document.activeElement), 'Menu supports End');
      const menu = await p.locator('#account-menu').boundingBox();
      assert(menu.x >= 0 && menu.x + menu.width <= width && menu.y >= 0 && menu.y + menu.height <= 900, `Menu fits ${width}`);
      if (width === 1440) await p.screenshot({ path: '/tmp/wisconnect-profile-menu.png' });
      await p.keyboard.press('Escape');
      await p.getByRole('button', { name: 'Invite member', exact: true }).click();
      const dialog = await p.getByRole('dialog').boundingBox();
      assert(dialog.width <= 448 && dialog.x >= 16 && dialog.x + dialog.width <= width - 16 && dialog.y >= 16 && dialog.y + dialog.height <= 884, `Invite fits ${width}`);
      await p.keyboard.press('Tab');
      assert(await p.getByRole('dialog').evaluate(el => el.contains(document.activeElement)), 'Tab stays in modal');
      if (width === 390 || width === 1440) await p.screenshot({ path: `/tmp/wisconnect-invite-${width}.png` });
      await p.keyboard.press('Escape');
      assert(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No overflow at ${width}`);
      assert(await p.locator('[data-dashboard-view]').evaluate(el => getComputedStyle(el).backgroundColor === 'rgb(245, 245, 245)') && await p.getByRole('main').evaluate(el => getComputedStyle(el).backgroundColor === 'rgb(253, 253, 253)'), 'Original shell palette retained');
    }
    memberRows = []; await nav('Home'); await nav('Members');
    await p.getByText('No member accounts yet', { exact: true }).waitFor();
    await memberHeaders();
    await p.emulateMedia({ reducedMotion: 'reduce' });
    await nav('Home'); memberGate = hold(); await nav('Members');
    await visible('[data-state="loading"]');
    assert(await p.locator('[data-state="loading"] span').first().evaluate(el => getComputedStyle(el).animationName === 'none'), 'Reduced motion disables pulse');
    await nav('Home'); release(); memberGate = null;
    assert(!(await p.locator('[data-state="empty"]').count()), 'Leaving a pending view cannot replace Home');
    meStatus = 503; await p.evaluate(() => window.dispatchEvent(new Event('focus')));
    await p.getByText('Session temporarily unavailable.', { exact: true }).waitFor();
    assert(await p.locator('[data-dashboard-view="home"]').count(), 'Transient session failure preserves signed-in workspace');
    await p.reload(); await p.getByText('Could not load your workspace', { exact: true }).waitFor();
    meStatus = 200; await p.getByRole('button', { name: 'Try again' }).click(); await visible('[data-dashboard-view="home"]');
    await p.setViewportSize({ width: 390, height: 844 });
    user.role = 'member'; await p.goto('http://localhost:3000/admin/');
    await p.getByText('Only administrators can issue invitations.', { exact: true }).waitFor();
    assert(!(await p.getByRole('button', { name: 'Invite member', exact: true }).count()), 'Member cannot open invite');
    assert(JSON.stringify(await p.getByRole('navigation', { name: 'Mobile dashboard navigation' }).getByRole('button').allTextContents()) === JSON.stringify(['Home', 'Membership', 'Business', 'Documents', 'More']), 'Member mobile dock only contains member areas');
    await p.getByRole('button', { name: 'More sections', exact: true }).click();
    assert(!(await p.getByRole('menuitem', { name: 'Reports', exact: true }).count()) && !(await p.getByRole('menuitem', { name: 'Team & access', exact: true }).count()), 'Member More menu omits administrator sections');
    await p.keyboard.press('Escape');

    await openMenu(); assert(!(await p.getByRole('menuitem', { name: 'Team & access' }).count()), 'Member menu omits admin controls');
    logoutGate = hold(); await p.getByRole('menuitem', { name: 'Sign out' }).click();
    await p.getByRole('menuitem', { name: 'Signing out…' }).waitFor(); release(); logoutGate = null;
    await p.waitForURL('http://localhost:3000/login/'); await p.getByRole('form', { name: 'Sign in' }).waitFor();
    assert(!errors.length, errors.join('\n'));
    return { passed: true, requests: calls.length, widths: [320, 390, 639, 640, 768, 1440], checks: 'On-demand requests; loading/empty/error/retry; send/revoke; menu/dialog keyboard, focus and responsive layout; session retry; roles; sign-out.' };
  } finally { if (release) release(); await context.close(); }
}
