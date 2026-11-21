import { test, expect } from '../../fixtures';

/**
 * E2E — real user journeys across sections and pages.
 * IDs TC029-TC030. Tagged @e2e.
 */
test.describe('Mudapedia — End-to-End journeys', { tag: '@e2e' }, () => {
  test('TC029 navigate the full section journey', async ({ homePage, testData }) => {
    for (const id of ['tim', 'harga', 'tentang'] as const) {
      await homePage.clickSection(id);
      await homePage.expectHash(id);
    }
    expect(testData.sections).toContain('galeri');
  });

  test('TC030 open gallery, go back and forward again', async ({ homePage, galleryPage, page, testData }) => {
    await homePage.navLink('Galeri').click();
    await expect(page).toHaveURL(/\/galeri$/);
    await galleryPage.expectVisible(galleryPage.heading);
    expect(await galleryPage.postLinks.count()).toBeGreaterThan(0);

    await page.goBack({ waitUntil: 'networkidle' });
    expect(page.url()).toBe(testData.baseUrl);
    await homePage.expectHeroVisible();

    await page.goForward({ waitUntil: 'networkidle' });
    await galleryPage.expectVisible(galleryPage.heading);
  });
});
