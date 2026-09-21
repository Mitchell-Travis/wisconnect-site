// Run via Playwright MCP browser_run_code_unsafe with this file's absolute filename.
// Isolated browser context and mocked API; no real account changes.
async (page) => {
  const context = await page.context().browser().newContext({ colorScheme: 'dark', viewport: { width: 1440, height: 900 } });
  const p = await context.newPage();
  const assert = (value, message) => { if (!value) throw Error(message); };
  const errors = [];
  const user = { id: 1, name: 'Test Administrator', email: 'admin@example.test', role: 'admin', active: true };
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  let loading = true;
  p.on('pageerror', error => errors.push(error.message));
  p.on('console', message => { if (/hydration|did not match/i.test(message.text())) errors.push(message.text()); });
  await context.route('http://localhost:8001/auth/**', async route => {
    const path = route.request().url().split('/auth')[1];
    if (path === '/me' && loading) await gate;
    const failed = route.request().method() === 'POST';
    await route.fulfill({ status: failed ? 503 : 200, json: failed ? { detail: 'Invitation temporarily unavailable.' } : path === '/me' ? user : path === '/members' ? [user] : [] });
  });
  const menu = async () => { await p.locator('[popovertarget="account-menu"]').click(); await p.locator('#account-menu:popover-open').waitFor(); };
  const theme = value => p.waitForFunction(value => document.documentElement.dataset.dashboardTheme === value, value);
  const bg = locator => locator.evaluate(el => getComputedStyle(el).backgroundColor);
  const nav = async name => {
    const button = p.getByRole('navigation').getByRole('button', { name, exact: true });
    if (await button.isVisible()) await button.click();
    else { await p.getByRole('button', { name: 'More sections', exact: true }).click(); await p.getByRole('menu', { name: 'More sections' }).getByRole('menuitem', { name, exact: true }).click(); }
  };
  try {
    await p.goto('http://localhost:3000/dashboard/');
    await p.getByText('Loading your workspace…', { exact: true }).waitFor();
    await theme('dark');
    assert(await bg(p.getByRole('main')) === 'rgb(19, 17, 28)', 'Initial loading shell already uses dark system preference');
    assert(await p.locator('[data-state="loading"] span').first().evaluate(el => getComputedStyle(el).backgroundColor === 'rgba(255, 255, 255, 0.08)'), 'Dark loading skeletons use light strokes');
    release(); loading = false;
    await p.locator('[data-dashboard-view="home"]').waitFor();
    await menu(); await p.getByRole('menuitem', { name: 'Light theme', exact: true }).click(); await theme('light');
    assert(await bg(p.locator('[data-dashboard-view]')) === 'rgb(245, 245, 245)' && await bg(p.getByRole('main')) === 'rgb(253, 253, 253)', 'Light theme keeps approved original shell colors');
    assert(await p.locator('[popovertarget="account-menu"]').evaluate(el => el === document.activeElement), 'Theme action restores profile focus');
    await p.reload(); await p.locator('[data-dashboard-view]').waitFor(); await theme('light');
    assert(await p.evaluate(() => localStorage.getItem('wisconnect-dashboard-theme')) === 'light', 'Explicit light preference survives reload over dark OS preference');
    await menu(); await p.getByRole('menuitem', { name: 'Dark theme', exact: true }).click(); await theme('dark');
    await p.reload(); await p.locator('[data-dashboard-view]').waitFor(); await theme('dark');
    for (const width of [1440, 390, 320]) {
      await p.setViewportSize({ width, height: 900 });
      await nav('Members'); await p.locator('tbody tr').waitFor();
      assert(await bg(p.getByRole('main')) === 'rgb(19, 17, 28)', 'Dark workspace');
      assert(await p.locator('th').first().evaluate(el => getComputedStyle(el).color === 'rgb(161, 160, 171)'), 'Readable muted table headers');
      assert(await p.locator('[role="region"][aria-label="Members"]').evaluate(el => getComputedStyle(el).borderColor === 'rgb(51, 50, 62)'), 'Table border matches dark surface');
      await p.getByRole('button', { name: 'Invite member', exact: true }).click(); await p.getByRole('dialog', { name: 'Invite a member' }).waitFor();
      assert(await bg(p.getByRole('dialog', { name: 'Invite a member' })) === 'rgb(19, 17, 28)', 'Invite inherits dark theme in the top layer');
      await p.locator('#invite-email').fill('member@example.test'); await p.getByRole('button', { name: 'Send invitation', exact: true }).click();
      await p.getByRole('dialog').getByRole('alert').waitFor();
      assert(await p.getByRole('dialog').getByRole('alert').evaluate(el => getComputedStyle(el).color === 'rgb(242, 165, 178)'), 'Readable dark invitation errors');
      if (width === 390) await p.screenshot({ path: '/tmp/wisconnect-dark-invite-mobile.png' });
      await p.keyboard.press('Escape');
      await p.getByRole('button', { name: 'Notifications', exact: true }).click(); await p.locator('#notifications-panel:popover-open').waitFor();
      assert(await bg(p.locator('#notifications-panel')) === 'rgb(19, 17, 28)', 'Notifications inherit dark theme');
      await p.keyboard.press('Escape');
      assert(await p.locator('main [aria-current]').evaluate(el => getComputedStyle(el).color === 'rgb(247, 247, 248)'), 'Active Members tab has bright text');
      if (width < 640) {
        assert(await p.locator('[aria-label="Mobile dashboard navigation"] [aria-current]').evaluate(el => getComputedStyle(el).color === 'rgb(187, 139, 240)'), 'Active mobile destination keeps the purple accent');
        assert(await bg(p.getByRole('navigation', { name: 'Mobile dashboard navigation' })) === 'rgb(24, 22, 34)', 'Dark floating dock');
        await p.getByRole('button', { name: 'More sections', exact: true }).click(); await p.locator('#mobile-more-menu:popover-open').waitFor();
        assert(await bg(p.locator('#mobile-more-menu')) === 'rgb(19, 17, 28)', 'Dark More menu'); await p.keyboard.press('Escape');
      }
      await menu();
      if (width !== 320) await p.screenshot({ path: `/tmp/wisconnect-dark-menu-${width}.png` });
      await p.getByRole('menuitem', { name: 'Account settings', exact: true }).click(); await p.locator('#profile-name').waitFor();
      assert(await p.locator('#profile-name').evaluate(el => getComputedStyle(el).color === 'rgb(247, 247, 248)' && getComputedStyle(el).borderColor === 'rgb(69, 67, 79)'), 'Readable name input and border');
      assert(await p.locator('#profile-email').evaluate(el => getComputedStyle(el).color === 'rgb(161, 160, 171)'), 'Readonly email stays readable');
      assert(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No dark-mode overflow');
    }
    const second = await context.newPage();
    await second.goto('http://localhost:3000/dashboard/'); await second.locator('[data-dashboard-view]').waitFor();
    await menu(); await p.getByRole('menuitem', { name: 'Light theme', exact: true }).click();
    await second.waitForFunction(() => document.documentElement.dataset.dashboardTheme === 'light');
    await second.close();
    await p.evaluate(() => { localStorage.removeItem('wisconnect-dashboard-theme'); window.dispatchEvent(new StorageEvent('storage', { key: 'wisconnect-dashboard-theme' })); });
    await theme('dark'); await p.emulateMedia({ colorScheme: 'light' }); await theme('light');
    await p.emulateMedia({ colorScheme: 'dark' }); await theme('dark');
    await p.goto('http://localhost:3000/login/'); await p.getByRole('heading', { level: 1 }).waitFor();
    assert(await bg(p.locator('body')) !== 'rgb(19, 17, 28)', 'Dashboard theme does not recolor login');
    await p.goto('http://localhost:3000/'); await p.getByRole('heading', { level: 1 }).waitFor();
    assert(await bg(p.locator('body')) !== 'rgb(19, 17, 28)', 'Public site keeps its own colors');
    await context.addInitScript(() => { Storage.prototype.getItem = () => { throw Error('Storage unavailable'); }; Storage.prototype.setItem = () => { throw Error('Storage unavailable'); }; });
    await p.goto('http://localhost:3000/dashboard/'); await p.locator('[data-dashboard-view]').waitFor();
    await menu(); await p.getByRole('menuitem', { name: 'Light theme', exact: true }).click(); await theme('light');
    assert(!errors.length, errors.join('\n'));
    return { passed: true, checks: 'System default; initial dark loading; saved choice/reload; cross-tab sync; storage fallback; desktop/mobile tables, menus, settings, notifications and invite; public-page isolation; no hydration errors.' };
  } finally { release(); await context.close(); }
}
