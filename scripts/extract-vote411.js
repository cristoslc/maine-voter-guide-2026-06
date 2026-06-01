const { chromium } = require('playwright');

const CANDIDATES = [
  { name: 'Anne M Carney', search: 'Carney', party: 'Democrat', race: 'State Senate 29' },
  { name: 'Vincent A Maietta', search: 'Maietta', party: 'Republican', race: 'State Senate 29' },
  { name: 'Jason J Shedlock', search: 'Shedlock', party: 'Democrat', race: 'State House 120' },
  { name: 'Michael J Dougherty', search: 'Dougherty', party: 'Republican', race: 'State House 120' },
  { name: 'Robert Cameron', search: 'Robert Cameron', party: 'Democrat', race: 'State House 121' },
  { name: 'Meagan J Smith', search: 'Meagan Smith', party: 'Republican', race: 'State House 121' },
  { name: 'Matthew D Beck', search: 'Matthew Beck', party: 'Democrat', race: 'State House 122' },
  { name: 'Nirav D Shah', search: 'Nirav Shah', party: 'Democrat', race: 'Governor' },
  { name: 'Graham C Platner', search: 'Graham Platner', party: 'Democrat', race: 'US Senate' },
];

async function clickWithScroll(page, text) {
  await page.evaluate((t) => {
    const els = document.querySelectorAll('button');
    for (const el of els) {
      if (el.textContent.trim() === t || el.textContent.includes(t)) {
        el.scrollIntoView({ block: 'center' });
        el.click();
        return;
      }
    }
  }, text);
}

async function clickButtonContaining(page, text) {
  await page.evaluate((t) => {
    const els = document.querySelectorAll('button');
    for (const el of els) {
      if (el.textContent.includes(t)) {
        el.scrollIntoView({ block: 'center' });
        el.click();
        return;
      }
    }
  }, text);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  await page.goto('https://www.vote411.org/ballot', { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(3000);

  for (let i = 0; i < CANDIDATES.length; i++) {
    const candidate = CANDIDATES[i];
    console.log(`\n=== [${i+1}/${CANDIDATES.length}] ${candidate.name} (${candidate.party}, ${candidate.race}) ===`);

    try {
      // Click All Candidates
      await clickWithScroll(page, 'All Candidates');
      await page.waitForTimeout(2500);

      // Click Maine View Candidates  
      await clickWithScroll(page, 'Maine View Candidates');
      await page.waitForTimeout(3000);

      // Search for candidate name
      await page.evaluate((name) => {
        const input = document.querySelector('input');
        if (input) {
          input.focus();
          const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
          nativeSetter.call(input, name);
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
        }
      }, candidate.search);
      await page.waitForTimeout(2500);

      // Click candidate button by name
      await clickButtonContaining(page, candidate.name);
      await page.waitForTimeout(3000);

      // Try clicking View Answers checkbox/span
      await page.evaluate(() => {
        const spans = document.querySelectorAll('span, label, div');
        for (const s of spans) {
          if (s.textContent.includes('View Answers')) {
            s.scrollIntoView({ block: 'center' });
            s.click();
            return;
          }
        }
      });
      await page.waitForTimeout(1500);

      // Try expanding General Information accordion
      await clickButtonContaining(page, 'General Information');
      await page.waitForTimeout(1500);

      // Scroll to and extract answers
      await page.evaluate(() => window.scrollTo(0, 2000));
      await page.waitForTimeout(500);

      const text = await page.evaluate(() => {
        const body = document.body.innerText || '';
        const idx = body.indexOf('Candidate Answers');
        if (idx >= 0) return body.substring(idx, idx + 2500);
        // Try finding candidate info elsewhere
        const ci = body.indexOf('General Information');
        if (ci >= 0) return body.substring(ci, ci + 2000);
        return body.substring(0, 2000);
      });

      if (text.includes('not yet responded') || text.includes('has not yet responded')) {
        console.log('  Status: DID NOT RESPOND to LWV questionnaire');
      } else if (text.includes('Candidate Answers') && text.length > 50) {
        console.log('  Status: RESPONDED');
        console.log('  ---');
        const clean = text.replace(/\n{3,}/g, '\n\n').trim();
        console.log(clean.substring(0, 1500));
        console.log('  ---');
      } else {
        console.log('  Status: UNKNOWN (limited text)');
        console.log(text.substring(0, 500));
      }
    } catch (e) {
      console.log(`  Error: ${e.message.substring(0, 200)}`);
    }
  }

  await browser.close();
  console.log('\n=== All candidates extracted ===');
})();
