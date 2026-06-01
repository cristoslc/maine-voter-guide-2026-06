const { chromium } = require('playwright');

const CANDIDATES = [
  { name: 'Carney', full: 'Anne M Carney', race: 'State Senate 29' },
  { name: 'Maietta', full: 'Vincent A Maietta', race: 'State Senate 29' },
  { name: 'Shedlock', full: 'Jason J Shedlock', race: 'State House 120' },
  { name: 'Dougherty', full: 'Michael J Dougherty', race: 'State House 120' },
  { name: 'Robert Cameron', full: 'Robert Cameron', race: 'State House 121' },
  { name: 'Meagan Smith', full: 'Meagan J Smith', race: 'State House 121' },
  { name: 'Matthew Beck', full: 'Matthew D Beck', race: 'State House 122' },
];

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  await page.goto('https://www.vote411.org/ballot', { waitUntil: 'networkidle', timeout: 30000 });
  console.log('Page loaded:', page.url());

  // Click All Candidates
  await page.locator('button', { hasText: 'All Candidates' }).first().click();
  await page.waitForTimeout(3000);

  // Click Maine View Candidates
  await page.locator('button', { hasText: 'Maine View Candidates' }).click();
  await page.waitForTimeout(5000);

  // Verify we loaded
  const btnCount = await page.locator('button').count();
  console.log(`Maine candidates loaded: ${btnCount} buttons on page`);

  // Extract each candidate
  for (const c of CANDIDATES) {
    console.log(`\n=== ${c.full} (${c.race}) ===`);

    try {
      // Type search
      const input = page.locator('input').first();
      await input.click();
      await input.fill('');
      await page.waitForTimeout(500);
      await input.fill(c.name);
      await page.waitForTimeout(2000);

      // Find and click candidate button
      const candBtn = page.locator('button', { hasText: c.full }).first();
      if (await candBtn.count() === 0) {
        console.log('  NOT FOUND in search results');
        continue;
      }

      await candBtn.click();
      await page.waitForTimeout(3000);

      // Check for View Answers
      const viewAnswers = page.locator('span:has-text("View Answers"), label:has-text("View Answers"), div:has-text("View Answers")').first();
      if (await viewAnswers.count() > 0) {
        await viewAnswers.click();
        await page.waitForTimeout(1500);
      }

      // Click General Information accordion
      const genInfo = page.locator('button[class*="accordion"], button:has-text("General Information")').first();
      if (await genInfo.count() > 0) {
        await genInfo.click();
        await page.waitForTimeout(1500);
      }

      // Get full page text
      await page.waitForTimeout(1000);
      const bodyText = await page.locator('body').innerText();

      if (bodyText.includes('not yet responded') || bodyText.includes('has not yet responded')) {
        console.log('  STATUS: DID NOT RESPOND');
      } else {
        const idx = bodyText.indexOf('Candidate Answers');
        if (idx >= 0) {
          const answers = bodyText.substring(idx, idx + 2000);
          console.log('  STATUS: RESPONDED');
          console.log(answers);
        } else {
          console.log('  STATUS: UNKNOWN');
          console.log(bodyText.substring(0, 500));
        }
      }

      // Go back to candidate list
      const backBtn = page.locator('button:has-text("Back to candidates")');
      if (await backBtn.count() > 0) {
        await backBtn.click();
      } else {
        await page.goto('https://www.vote411.org/ballot', { waitUntil: 'networkidle' });
        await page.locator('button', { hasText: 'All Candidates' }).first().click();
        await page.waitForTimeout(2000);
        await page.locator('button', { hasText: 'Maine View Candidates' }).click();
      }
      await page.waitForTimeout(3000);

    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
  }

  await browser.close();
  console.log('\nDone.');
})();
