const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, 'docs');

const pages = [
  { url: 'https://kick.com/terms-of-service', file: 'kick-tos.md', title: 'Kick Terms of Service' },
  { url: 'https://kick.com/privacy-policy', file: 'kick-privacy.md', title: 'Kick Privacy Policy' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  for (const page of pages) {
    const filePath = path.join(DOCS_DIR, page.file);
    console.log(`FETCHING: ${page.url}`);
    const tab = await context.newPage();

    try {
      // Use domcontentloaded instead of networkidle, with longer timeout
      await tab.goto(page.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      // Wait for content to render
      await tab.waitForTimeout(8000);

      const text = await tab.evaluate(() => {
        const removeSelectors = ['nav', 'footer', 'header', '[class*="cookie"]', '[class*="Cookie"]', '[class*="banner"]', '[id*="cookie"]', '[role="navigation"]'];
        removeSelectors.forEach(sel => {
          document.querySelectorAll(sel).forEach(el => el.remove());
        });

        const mainSelectors = ['main', 'article', '[role="main"]', '.content', '#content', '.policy', '.legal', '.terms'];
        for (const sel of mainSelectors) {
          const el = document.querySelector(sel);
          if (el && el.innerText.trim().length > 500) {
            return el.innerText.trim();
          }
        }
        return document.body.innerText.trim();
      });

      if (text.length < 200) {
        console.log(`WARNING: ${page.file} - very short content (${text.length} chars)`);
      }

      const today = new Date().toISOString().split('T')[0];
      const content = `Source: ${page.url}\nAccessed: ${today}\n---\n\n# ${page.title}\n\n${text}\n`;

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`SAVED: ${page.file} (${text.length} chars)`);

    } catch (err) {
      console.log(`ERROR: ${page.file} - ${err.message}`);
    }

    await tab.close();
  }

  await browser.close();
  console.log('\nDone!');
})();
