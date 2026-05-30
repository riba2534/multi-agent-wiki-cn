import { expect, test } from '@playwright/test';

test.describe('Multi-Agent Wiki', () => {
  test('home cover renders the hero + category switcher', async ({ page }) => {
    await page.goto('/');
    // Full-bleed cover headline (no sidebar on the landing page anymore).
    await expect(page.locator('h1', { hasText: '设计模式库' })).toBeVisible();
    await expect(page.getByRole('link', { name: '从分类法开始' }).first()).toBeVisible();
    // The category switcher (home animation) is present with its dimension tabs.
    await expect(page.getByRole('heading', { name: /每个维度/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /控制结构/ })).toBeVisible();
  });

  test('cover CTA navigates to taxonomy', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: '从分类法开始' }).first().click();
    await expect(page).toHaveURL(/\/taxonomy$/);
    await expect(page.locator('table').first()).toBeVisible();
  });

  test('home category switcher plays a pattern and swaps on tab change', async ({ page }) => {
    await page.goto('/');
    // The default (Control) tab embeds the same live visualization as pattern pages.
    await expect(page.locator('.canvas-wrap svg.diagram .node').first()).toBeVisible();
    await expect(page.locator('.controls button.primary')).toBeVisible();
    // Switching to another dimension swaps the animated pattern in the canvas.
    await page.getByRole('tab', { name: /决策/ }).click();
    await expect(page.locator('.canvas-wrap svg.diagram .node').first()).toBeVisible();
  });

  test('pattern wiki page embeds the live visualization', async ({ page }) => {
    await page.goto('/patterns/supervisor-manager');
    await expect(page.locator('h1', { hasText: /监督者|管理者/ })).toBeVisible();
    // Live visualization widget mounted
    await expect(page.locator('.canvas-wrap svg.diagram')).toBeVisible();
    await expect(page.locator('.canvas-wrap svg.diagram .node').first()).toBeVisible();
    await expect(page.locator('.controls button.primary')).toBeVisible();
  });

  test('every pattern page mounts an animated live visualization', async ({ page }) => {
    // The 16 previously-static patterns now have full animation data too.
    for (const slug of ['marl-ctde', 'stigmergy-environment-mediated', 'voting-ensemble', 'composite-pattern']) {
      await page.goto(`/patterns/${slug}`);
      await expect(page.locator('.canvas-wrap svg.diagram')).toBeVisible();
      await expect(page.locator('.controls button.primary')).toBeVisible();
    }
  });

  test('sidebar nav is grouped by category on doc pages', async ({ page }) => {
    // The sidebar lives on doc pages now — the home cover is full-bleed.
    await page.goto('/taxonomy');
    // Sub-category headers inside the Patterns section.
    await expect(page.locator('text=CONTROL').first()).toBeVisible();
    await expect(page.locator('text=INFORMATION').first()).toBeVisible();
    await expect(page.locator('text=DECISION').first()).toBeVisible();
  });

  test('right-side TOC appears on wide viewports', async ({ page }) => {
    await page.setViewportSize({ width: 1500, height: 900 });
    await page.goto('/patterns/supervisor-manager');
    await expect(page.locator('text=本页内容')).toBeVisible();
  });

  test('top nav theme toggle is reachable', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('button[aria-label="切换主题"]');
    await expect(toggle).toBeVisible();
    await toggle.click();
  });

  test('play button on a pattern page toggles label', async ({ page }) => {
    await page.goto('/patterns/debate-judge');
    const primary = page.locator('.controls button.primary');
    await expect(primary).toBeVisible();
    // The widget auto-plays shortly after mount, so the button settles on
    // "暂停". Wait for that known state before toggling — reading the label
    // mid-autoplay-kickoff used to race the 100ms timer and flake.
    await expect(primary).toHaveText(/暂停/);
    await primary.click();
    await expect(primary).toHaveText(/播放/);
  });

  test('Patterns category label navigates to /patterns overview', async ({ page }) => {
    // The sidebar (with the Patterns overview link) is on doc pages now.
    await page.goto('/taxonomy');
    // The category header itself is a link to the overview (sidebar lives here).
    await page.locator('aside a[href="/patterns"]').first().click();
    await expect(page).toHaveURL(/\/patterns$/);
    await expect(page.locator('h1', { hasText: /模式概览|Patterns/ })).toBeVisible();
  });

  test('sidebar scroll position is not reset to top on navigation', async ({ page }) => {
    // The original bug: clicking any sidebar link slammed the sidebar's internal
    // scroll back to 0. The sidebar now lives in the (docs) layout; the
    // sessionStorage restore in useLayoutEffect keeps scroll across navigation.
    await page.setViewportSize({ width: 1400, height: 800 });
    await page.goto('/taxonomy');
    const sidebar = page.locator('aside .sticky').first();
    await expect(sidebar).toBeVisible();

    await sidebar.evaluate(el => { el.scrollTop = 400; });
    const before = await sidebar.evaluate(el => el.scrollTop);
    expect(before).toBeGreaterThan(50);

    // Click a sidebar link — the click handler captures scroll into
    // sessionStorage; the useLayoutEffect on the new pathname restores it.
    await page.getByRole('link', { name: /MARL \/ CTDE/ }).first().click();
    await expect(page).toHaveURL(/marl-ctde/);
    await page.waitForTimeout(300);

    const after = await sidebar.evaluate(el => el.scrollTop);
    expect(after).toBeGreaterThan(100);
  });

  test('social card endpoints are served', async ({ page }) => {
    for (const path of ['/sitemap.xml', '/robots.txt', '/manifest.webmanifest']) {
      const res = await page.request.get(path);
      expect(res.status(), `expected 200 for ${path}`).toBe(200);
    }
  });

  test('home page sets opengraph + twitter meta', async ({ page }) => {
    await page.goto('/');
    const ogTitle = await page.locator('meta[property="og:title"]').first().getAttribute('content');
    const ogImage = await page.locator('meta[property="og:image"]').first().getAttribute('content');
    const twCard = await page.locator('meta[name="twitter:card"]').first().getAttribute('content');
    expect(ogTitle).toContain('Multi-Agent Wiki');
    expect(ogImage).toMatch(/opengraph-image/);
    expect(twCard).toBe('summary_large_image');
  });

  test('code blocks get a lang header + copy button', async ({ page }) => {
    await page.goto('/implementation/observability');
    // TS code block has a "TypeScript" header label and a copy button.
    await expect(page.locator('text=TypeScript').first()).toBeVisible();
    await expect(page.locator('button[aria-label="复制代码"]').first()).toBeVisible();
  });

  test('flowchart fences render as interactive diagrams', async ({ page }) => {
    // index.md's global-taxonomy flowchart fence renders into a React Flow
    // diagram in the home overview section.
    await page.goto('/');
    await expect(page.locator('.react-flow').first()).toBeVisible();
    await expect(page.locator('.react-flow__node').first()).toBeVisible();
  });

  test('diagrams render via React Flow with fullscreen viewer', async ({ page }) => {
    await page.goto('/implementation/production-runtime');
    // React Flow takes over for parseable mermaid → look for the RF root.
    await expect(page.locator('.react-flow').first()).toBeVisible();
    await expect(page.locator('.react-flow__node').first()).toBeVisible();
    // Fullscreen viewer
    await page.locator('button[aria-label="全屏查看图表"]').first().click({ force: true });
    await expect(page.locator('text=图表查看器')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('text=图表查看器')).not.toBeVisible();
  });

  test('llms.txt endpoint is served', async ({ page }) => {
    const res = await page.goto('/llms.txt');
    expect(res?.status()).toBe(200);
    expect(res?.headers()['content-type']).toContain('text/plain');
    const body = await page.content();
    expect(body).toMatch(/Wiki/i);
  });
});
