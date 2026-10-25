import puppeteer from 'puppeteer';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve('assets/images');
const FRAMES_DIR = path.resolve('scratch_frames');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(FRAMES_DIR)) fs.mkdirSync(FRAMES_DIR, { recursive: true });

async function run() {
  console.log('🚀 Launching Puppeteer for single-level Foundry Corp demo...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 2 });

  console.log('🌐 Navigating to http://localhost:5173/ai-native-ux/ ...');
  await page.goto('http://localhost:5173/ai-native-ux/', { waitUntil: 'networkidle0' });

  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  let frameIdx = 0;
  async function recordFrame(count = 1, delay = 150) {
    for (let i = 0; i < count; i++) {
      const framePath = path.join(FRAMES_DIR, `frame_${String(frameIdx).padStart(4, '0')}.png`);
      await page.screenshot({ path: framePath });
      frameIdx++;
      if (delay > 0) await wait(delay);
    }
  }

  // 1. Initial Overview & Search View (Level 1)
  console.log('📸 01: Initial Intent Search (Level 1)...');
  await wait(500);
  await recordFrame(4, 120);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01-direct-search-initial.png') });

  // 2. Type in Search Box -> Show Autosuggest
  console.log('⌨️ Typing margin in search box...');
  await page.type('#main-search-input', 'margin', { delay: 100 });
  await wait(300);
  await recordFrame(5, 120);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02-search-autosuggest-dropdown.png') });

  // 3. Click Relatable Operating Margin & Seat Reclaim Diagnostic
  console.log('🎯 Clicking Operating Margin & Seat Reclaim...');
  await page.evaluate(() => {
    document.querySelector('.autosuggest-item[data-action="revenue"]').click();
  });
  await wait(500);
  await recordFrame(4, 120);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03-expense-seats-diagnostic.png') });

  // 4. Click "Auto-Reclaim Inactive Seats"
  console.log('⚡ Reclaiming 142 inactive software seats...');
  await page.evaluate(() => {
    document.getElementById('btn-apply-cdn').click();
  });
  await wait(850);
  await recordFrame(5, 120);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04-seats-reclaimed-success.png') });

  // 5. Switch to Tab Level 3: HITL Anomaly & Approve
  console.log('🛡️ Switching to Level 3 Tab: HITL Anomaly & Approving...');
  await page.evaluate(() => {
    document.getElementById('tab-btn-level-3').click();
  });
  await wait(400);
  await recordFrame(3, 120);
  await page.evaluate(() => {
    document.getElementById('btn-approve-fix').click();
  });
  await wait(900);
  await recordFrame(5, 120);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '05-hitl-remediation-executed.png') });

  // 6. Switch to Tab Level 4: Autopilot Log & Suggestions
  console.log('📋 Switching to Level 4 Tab: Autopilot Log & Suggestions...');
  await page.evaluate(() => {
    document.getElementById('tab-btn-level-4').click();
  });
  await wait(400);
  await recordFrame(3, 120);
  // Click Cap at +$150/mo spot instances pill
  await page.evaluate(() => {
    const pills = document.querySelectorAll('.approval-option-pill');
    if (pills[1]) pills[1].click();
  });
  await wait(300);
  await recordFrame(4, 120);
  await page.evaluate(() => {
    document.getElementById('btn-submit-approval').click();
  });
  await wait(850);
  await recordFrame(6, 120);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '06-autopilot-directive-approved.png') });

  await browser.close();
  console.log(`✅ Captured ${frameIdx} frames & all screenshots!`);

  // Assemble GIF only (Zero video files!)
  console.log('🎬 Assembling animation GIF...');
  const gifOutput = path.join(OUTPUT_DIR, 'ai-native-ux-demo-animation.gif');

  try {
    execSync(`ffmpeg -y -framerate 6 -i "${FRAMES_DIR}/frame_%04d.png" -vf "fps=6,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer" -loop 0 "${gifOutput}"`, { stdio: 'inherit' });
    console.log(`🎉 GIF created: ${gifOutput}`);
  } catch (err) {
    console.error('Error generating GIF:', err);
  }

  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
}

run().catch(err => {
  console.error('Error in capture script:', err);
  process.exit(1);
});
