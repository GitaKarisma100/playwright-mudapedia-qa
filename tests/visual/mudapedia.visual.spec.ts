import { test } from '@applitools/eyes-playwright/fixture';
import { expect } from '@playwright/test';
import { MudapediaHomePage } from '../../pages/MudapediaHomePage';
import { GalleryPage } from '../../pages/GalleryPage';

/**
 * VISUAL — Applitools screenshot baselines for Mudapedia only.
 * IDs TC022-TC024. Tagged @visual. Skipped when APPLITOOLS_API_KEY is absent.
 */
const hasApiKey = Boolean(process.env.APPLITOOLS_API_KEY);
const visualTest = hasApiKey ? test : test.skip;

test.describe('Mudapedia — Applitools visual checks', { tag: '@visual' }, () => {
  visualTest('TC022 homepage full-page screenshot', async ({ page, eyes }) => {
    const home = new MudapediaHomePage(page);
    await home.goto();
    await home.expectVisible(home.firstHeading);
    await eyes.check('Homepage — full page');
  });

  visualTest('TC023 team section screenshot', async ({ page, eyes }) => {
    const home = new MudapediaHomePage(page);
    await home.goto();
    await expect(home.section('tim')).toBeVisible();
    await eyes.check('Tim Kami section', { region: home.section('tim') });
  });

  visualTest('TC024 gallery page screenshot', async ({ page, eyes }) => {
    const gallery = new GalleryPage(page);
    await gallery.goto();
    await expect(gallery.heading).toBeVisible();
    await eyes.check('Galeri Instagram — full page');
  });
});
