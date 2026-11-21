import { test } from '@applitools/eyes-playwright/fixture';
import { expect } from '@playwright/test';

/**
 * ============================================================================
 * VISUAL SCREENSHOT TESTS — Mudapedia Digital Indonesia ONLY
 * Engine: Applitools Eyes (@applitools/eyes-playwright fixture)
 * Website: https://mudapediadigitalindonesia.com/
 *
 * Test IDs continue the TC001-TCXXX sequence used in this project:
 *   TC022 full-page homepage snapshot
 *   TC023 team section (#tim) region snapshot
 *   TC024 /galeri page snapshot
 *
 * SETUP (one time, in C:\Playwright):
 *   1. Copy .env.example to .env
 *   2. Put your real Applitools API key in .env as APPLITOOLS_API_KEY=***
 *      (never commit .env — it is gitignored)
 *   3. npm run test:visual
 *
 * If APPLITOOLS_API_KEY is missing, these tests are SKIPPED rather than
 * failing, so the rest of the suite stays green.
 * ============================================================================
 */
const BASE_URL = 'https://mudapediadigitalindonesia.com/';
const hasApiKey = Boolean(process.env.APPLITOOLS_API_KEY);
const visualTest = hasApiKey ? test : test.skip;

test.describe('Mudapedia — Applitools visual checks', () => {
  visualTest('TC022 homepage full-page screenshot', async ({ page, eyes }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    await eyes.check('Homepage — full page');
  });

  visualTest('TC023 team section screenshot', async ({ page, eyes }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const team = page.locator('#tim');
    await expect(team).toBeVisible();
    await eyes.check('Tim Kami section', { region: team });
  });

  visualTest('TC024 gallery page screenshot', async ({ page, eyes }) => {
    await page.goto(new URL('/galeri', BASE_URL).toString(), { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: 'Galeri Instagram' })).toBeVisible();
    await eyes.check('Galeri Instagram — full page');
  });
});
