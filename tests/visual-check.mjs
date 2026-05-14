/**
 * Playwright visual smoke test for the Hugo site.
 *
 * Prerequisites:
 *   npm i -D playwright
 *   npx playwright install chromium
 *
 * Usage:
 *   1. Start the dev server:  hugo server --port 1313
 *   2. Run this script:       node tests/visual-check.mjs
 *
 * Screenshots are saved to tests/screenshots/.
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, 'screenshots');

const BASE = process.env.BASE_URL || 'http://127.0.0.1:1313';

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  let errors = [];

  // --- Homepage ---
  console.log('Loading homepage...');
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.screenshot({ path: path.join(screenshotDir, 'homepage.png'), fullPage: false });

  const title = await page.title();
  console.log('  Page title:', title);

  const header = await page.$('header');
  const footer = await page.$('footer');
  const posts = await page.$$('.post');
  const bgImages = await page.$$('[data-background]');

  console.log('  Header present:', !!header);
  console.log('  Footer present:', !!footer);
  console.log('  Post cards:', posts.length);
  console.log('  Background images:', bgImages.length);

  if (!header) errors.push('Homepage: missing <header>');
  if (!footer) errors.push('Homepage: missing <footer>');
  if (posts.length === 0) errors.push('Homepage: no post cards rendered');

  const mainEl = await page.$('#main');
  if (mainEl) {
    const box = await mainEl.boundingBox();
    console.log('  Main area size:', box ? `${box.width}x${box.height}` : 'not visible');
    if (!box || box.height < 100) errors.push('Homepage: #main has no height — CSS may be broken');
  }

  // --- Single post ---
  const firstPostLink = await page.$('.post a[href*="/20"]');
  if (firstPostLink) {
    let href = await firstPostLink.getAttribute('href');
    // href may be absolute (//host/path) or relative (/path); normalise it
    try { href = new URL(href, BASE).href; } catch { href = `${BASE}${href}`; }
    console.log(`\nLoading post: ${href}`);
    await page.goto(href, { waitUntil: 'networkidle', timeout: 30000 });
    await page.screenshot({ path: path.join(screenshotDir, 'single-post.png'), fullPage: false });

    const h1 = await page.$('h1');
    if (h1) console.log('  Post title:', (await h1.textContent()).trim());

    const article = await page.$('article, .entry-content, .post-content, .single-content');
    console.log('  Article body present:', !!article);
  } else {
    errors.push('Homepage: could not find a post link to navigate to');
  }

  // --- Category page (individual) ---
  console.log('\nLoading a category page...');
  await page.goto(`${BASE}/categories/comer-y-beber/`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.screenshot({ path: path.join(screenshotDir, 'category.png'), fullPage: false });
  console.log('  Category page title:', await page.title());
  const catPosts = await page.$$('.post');
  console.log('  Posts in category:', catPosts.length);
  if (catPosts.length === 0) errors.push('Category page: no posts rendered');

  await browser.close();

  // --- Summary ---
  console.log('\n--- Summary ---');
  if (errors.length === 0) {
    console.log('All checks passed. Screenshots saved to tests/screenshots/');
  } else {
    console.log('Issues found:');
    errors.forEach(e => console.log('  -', e));
    process.exitCode = 1;
  }
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exitCode = 1;
});
