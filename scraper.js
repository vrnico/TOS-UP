const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, 'docs');

const pages = [
  { url: 'https://www.snap.com/terms?lang=en-US', file: 'snapchat-tos.md', title: 'Snapchat Terms of Service' },
  { url: 'https://help.instagram.com/termsofuse', file: 'instagram-tos.md', title: 'Instagram Terms of Use' },
  { url: 'https://privacycenter.instagram.com/policy', file: 'instagram-privacy.md', title: 'Instagram/Meta Privacy Policy' },
  { url: 'https://www.redditinc.com/policies/user-agreement', file: 'reddit-tos.md', title: 'Reddit User Agreement' },
  { url: 'https://www.reddit.com/policies/privacy-policy', file: 'reddit-privacy.md', title: 'Reddit Privacy Policy' },
  { url: 'https://www.youtube.com/t/terms', file: 'youtube-tos.md', title: 'YouTube Terms of Service' },
  { url: 'https://policies.google.com/privacy', file: 'youtube-privacy.md', title: 'Google/YouTube Privacy Policy' },
  { url: 'https://www.twitch.tv/p/en/legal/terms-of-service/', file: 'twitch-tos.md', title: 'Twitch Terms of Service' },
  { url: 'https://www.twitch.tv/p/en/legal/privacy-notice/', file: 'twitch-privacy.md', title: 'Twitch Privacy Notice' },
  { url: 'https://kick.com/terms-of-service', file: 'kick-tos.md', title: 'Kick Terms of Service' },
  { url: 'https://kick.com/privacy-policy', file: 'kick-privacy.md', title: 'Kick Privacy Policy' },
  { url: 'https://www.patreon.com/policy/legal', file: 'patreon-tos.md', title: 'Patreon Terms of Use' },
  { url: 'https://privacy.patreon.com/', file: 'patreon-privacy.md', title: 'Patreon Privacy Policy' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  for (const page of pages) {
    const filePath = path.join(DOCS_DIR, page.file);
    if (fs.existsSync(filePath)) {
      console.log(`SKIP: ${page.file} already exists`);
      continue;
    }

    console.log(`FETCHING: ${page.url}`);
    const tab = await context.newPage();

    try {
      await tab.goto(page.url, { waitUntil: 'networkidle', timeout: 30000 });
      // Extra wait for JS rendering
      await tab.waitForTimeout(3000);

      // Try to get the main content area text
      const text = await tab.evaluate(() => {
        // Remove nav, footer, header, cookie banners
        const removeSelectors = ['nav', 'footer', 'header', '[class*="cookie"]', '[class*="Cookie"]', '[class*="banner"]', '[id*="cookie"]', '[role="navigation"]'];
        removeSelectors.forEach(sel => {
          document.querySelectorAll(sel).forEach(el => el.remove());
        });

        // Try to find the main content
        const mainSelectors = ['main', 'article', '[role="main"]', '.content', '#content', '.policy', '.legal', '.terms'];
        for (const sel of mainSelectors) {
          const el = document.querySelector(sel);
          if (el && el.innerText.trim().length > 500) {
            return el.innerText.trim();
          }
        }

        // Fallback to body
        return document.body.innerText.trim();
      });

      if (text.length < 200) {
        console.log(`WARNING: ${page.file} - very short content (${text.length} chars), may have failed`);
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
