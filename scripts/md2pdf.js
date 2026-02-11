const fs = require('fs');
const puppeteer = require('puppeteer');
const { marked } = require('marked');

async function convert() {
  const md = fs.readFileSync('/home/ubuntu/clawd/projects/productized-ai-sales/PRD_v3_Clawdbot.md', 'utf8');
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; max-width: 900px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #7C3AED; border-bottom: 2px solid #7C3AED; padding-bottom: 10px; }
    h2 { color: #5B21B6; margin-top: 30px; }
    h3 { color: #6D28D9; }
    pre { background: #1f2937; color: #e5e7eb; padding: 15px; border-radius: 8px; overflow-x: auto; font-size: 11px; white-space: pre-wrap; }
    code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 0.85em; }
    pre code { background: transparent; padding: 0; }
    table { border-collapse: collapse; width: 100%; margin: 15px 0; font-size: 0.9em; }
    th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
    th { background: #7C3AED; color: white; }
    tr:nth-child(even) { background: #f9fafb; }
    blockquote { border-left: 4px solid #7C3AED; margin: 0; padding-left: 20px; color: #6b7280; font-style: italic; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 30px 0; }
  </style>
</head>
<body>${marked.parse(md)}</body>
</html>`;
  
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ 
    path: '/home/ubuntu/clawd/projects/productized-ai-sales/PRD_v3_Clawdbot.pdf', 
    format: 'A4', 
    margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
    printBackground: true
  });
  await browser.close();
  console.log('PDF criado com sucesso!');
}

convert().catch(e => { console.error(e); process.exit(1); });
