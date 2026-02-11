const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const OUTPUT_DIR = '/home/ubuntu/clawd/projects/aiparati-dream-team/game/frontend/assets/tilesets';

async function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Go to LPC Terrains page and find download link
  console.log('📥 Fetching LPC Terrains...');
  await page.goto('https://opengameart.org/content/lpc-terrains');
  await page.waitForLoadState('networkidle');
  
  // Find download links
  const downloadLinks = await page.$$eval('a[href*=".png"], a[href*=".zip"]', links => 
    links.map(a => ({ href: a.href, text: a.textContent }))
  );
  
  console.log('Found links:', downloadLinks.slice(0, 5));
  
  // Download terrain-v7.zip or similar
  for (const link of downloadLinks) {
    if (link.href.includes('terrain') && (link.href.includes('.png') || link.href.includes('.zip'))) {
      console.log('Downloading:', link.href);
      const filename = path.basename(link.href);
      await downloadFile(link.href, path.join(OUTPUT_DIR, filename));
      console.log('✅ Saved:', filename);
    }
  }
  
  // Also get LPC base assets
  console.log('📥 Fetching LPC Base Assets...');
  await page.goto('https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles');
  await page.waitForLoadState('networkidle');
  
  const baseLinks = await page.$$eval('a[href*=".png"], a[href*=".zip"]', links => 
    links.map(a => ({ href: a.href, text: a.textContent }))
  );
  
  for (const link of baseLinks.slice(0, 3)) {
    if (link.href.includes('.zip') || link.href.includes('.png')) {
      console.log('Downloading:', link.href);
      const filename = path.basename(link.href);
      try {
        await downloadFile(link.href, path.join(OUTPUT_DIR, filename));
        console.log('✅ Saved:', filename);
      } catch (e) {
        console.log('❌ Failed:', e.message);
      }
    }
  }
  
  await browser.close();
  console.log('🏁 Done!');
}

main().catch(console.error);
