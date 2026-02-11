/**
 * LPC Sprite Generator - Automated via Playwright
 * Generates 10 Dream Team agent sprites
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../projects/aiparati-dream-team/game/frontend/assets/sprites/agents');

// Agent configurations based on LPC options
const AGENTS = [
  {
    id: 'atlas',
    name: 'ATLAS',
    role: 'Product Manager',
    // Blue formal - male, light skin, blue clothes
    config: {
      body: 'male_light',
      hair: 'short_brown',
      shirt: 'longsleeve_blue',
      pants: 'pants_blue',
      shoes: 'boots_brown'
    }
  },
  {
    id: 'forge',
    name: 'FORGE', 
    role: 'Tech Lead',
    // Red armor - male, light skin, red/armored
    config: {
      body: 'male_light',
      hair: 'short_red',
      chest: 'leather_armor_red',
      legs: 'pants_red',
      shoes: 'boots_brown'
    }
  },
  {
    id: 'cipher',
    name: 'CIPHER',
    role: 'Security',
    // Purple hood - male, dark mysterious
    config: {
      body: 'male_dark',
      hair: 'hood_purple',
      shirt: 'longsleeve_purple',
      pants: 'pants_black',
      shoes: 'boots_black'
    }
  },
  {
    id: 'coder',
    name: 'CODER',
    role: 'Senior Dev',
    // Green casual - male with headband
    config: {
      body: 'male_light',
      hair: 'messy_brown',
      accessory: 'headband_green',
      shirt: 'tshirt_green',
      pants: 'pants_brown',
      shoes: 'shoes_brown'
    }
  },
  {
    id: 'nova',
    name: 'NOVA',
    role: 'Frontend',
    // Yellow/Gold bright - female, blonde
    config: {
      body: 'female_light',
      hair: 'long_blonde',
      shirt: 'longsleeve_yellow',
      skirt: 'skirt_gold',
      shoes: 'boots_brown'
    }
  },
  {
    id: 'vortex',
    name: 'VORTEX',
    role: 'Backend',
    // Turquoise mage - male with robe
    config: {
      body: 'male_light',
      hair: 'long_white',
      robe: 'robe_teal',
      shoes: 'boots_brown'
    }
  },
  {
    id: 'pixel',
    name: 'PIXEL',
    role: 'UX/UI',
    // Pink/Purple artistic - female creative
    config: {
      body: 'female_light',
      hair: 'pixie_pink',
      shirt: 'tshirt_purple',
      pants: 'pants_pink',
      shoes: 'shoes_purple'
    }
  },
  {
    id: 'nexus',
    name: 'NEXUS',
    role: 'Business Analyst',
    // Gold formal - male with book look
    config: {
      body: 'male_dark',
      hair: 'short_black',
      shirt: 'formal_gold',
      pants: 'pants_brown',
      shoes: 'boots_brown'
    }
  },
  {
    id: 'sentinel',
    name: 'SENTINEL',
    role: 'DevOps',
    // Brown heavy armor - male strong
    config: {
      body: 'male_muscular',
      hair: 'short_brown',
      chest: 'plate_armor_brown',
      legs: 'armor_pants_brown',
      shoes: 'boots_metal'
    }
  },
  {
    id: 'guardian',
    name: 'GUARDIAN',
    role: 'QA',
    // Cyan shield protector - female with shield
    config: {
      body: 'female_light',
      hair: 'ponytail_blue',
      chest: 'leather_armor_teal',
      legs: 'pants_teal',
      shield: 'shield_round',
      shoes: 'boots_brown'
    }
  }
];

async function generateSprites() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('🎮 Starting LPC Sprite Generation...');
  console.log(`📁 Output: ${OUTPUT_DIR}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const agent of AGENTS) {
    console.log(`\n🎨 Generating ${agent.name} (${agent.role})...`);
    
    try {
      // Go to generator
      await page.goto('https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/');
      await page.waitForLoadState('networkidle');
      
      // Wait for page to load
      await page.waitForTimeout(2000);
      
      // The generator uses URL parameters for configuration
      // We'll use the "Random" button and then download
      // This is a simplified approach - full automation would need to parse all options
      
      // Click random to get a base character
      const randomBtn = await page.$('button:has-text("Random")');
      if (randomBtn) {
        await randomBtn.click();
        await page.waitForTimeout(1000);
      }
      
      // Wait for canvas to render
      await page.waitForSelector('canvas');
      await page.waitForTimeout(500);
      
      // Download the sprite
      const downloadPromise = page.waitForEvent('download');
      
      // Click download PNG button
      const downloadBtn = await page.$('button:has-text("Download PNG")') || 
                          await page.$('a:has-text("Download PNG")') ||
                          await page.$('[data-action="download-png"]');
      
      if (downloadBtn) {
        await downloadBtn.click();
        const download = await downloadPromise;
        const outputPath = path.join(OUTPUT_DIR, `${agent.id}.png`);
        await download.saveAs(outputPath);
        console.log(`   ✅ Saved: ${outputPath}`);
      } else {
        // Fallback: screenshot the canvas
        const canvas = await page.$('canvas');
        if (canvas) {
          const outputPath = path.join(OUTPUT_DIR, `${agent.id}.png`);
          await canvas.screenshot({ path: outputPath });
          console.log(`   ✅ Screenshot saved: ${outputPath}`);
        } else {
          console.log(`   ❌ Could not find download button or canvas`);
        }
      }
      
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
    }
  }

  await browser.close();
  console.log('\n🏁 Generation complete!');
}

// Alternative: Use pre-made sprite configurations via URL
async function generateSpritesViaURL() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('🎮 Starting LPC Sprite Generation via URL configs...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const agent of AGENTS) {
    console.log(`\n🎨 Generating ${agent.name}...`);
    
    try {
      await page.goto('https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      // Take screenshot of the preview canvas for now
      const canvas = await page.$('#spritesheet') || await page.$('canvas');
      if (canvas) {
        const outputPath = path.join(OUTPUT_DIR, `${agent.id}.png`);
        await canvas.screenshot({ path: outputPath });
        console.log(`   ✅ Saved: ${outputPath}`);
      }
      
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
    }
  }

  await browser.close();
  console.log('\n🏁 Done! Check:', OUTPUT_DIR);
}

// Run
generateSpritesViaURL().catch(console.error);
