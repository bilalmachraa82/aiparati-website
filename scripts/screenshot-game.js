const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
  
  await page.goto('https://aiparati-dream-team.vercel.app');
  await page.waitForTimeout(5000); // Wait for game to load
  
  await page.screenshot({ path: '/tmp/dream-team-screenshot.png', fullPage: false });
  console.log('Screenshot saved to /tmp/dream-team-screenshot.png');
  
  await browser.close();
}

main().catch(console.error);
