import { test, expect } from '../../fixtures';

/**
 * SMOKE — fast critical checks. Tagged @smoke for CI PR gating.
 * IDs TC025-TC028 continue the TC001-TCXXX convention.
 */
test.describe('Mudapedia — Smoke', () => {
  test('TC025 page title and meta description', { tag: '@smoke' }, async ({ homePage, page, testData }) => {
    await homePage.expectTitle(testData.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', testData.metaDescription);
  });

  test('TC026 hero renders owner and QA role', { tag: '@smoke' }, async ({ homePage }) => {
    await homePage.expectHeroVisible();
  });

  test('TC027 navigation anchors point to real sections', { tag: '@smoke' }, async ({ homePage }) => {
    await homePage.expectNavigationIntact();
  });

  test('TC028 contact details are present', { tag: '@smoke' }, async ({ homePage, testData }) => {
    await homePage.expectVisible(homePage.phoneText);
    await expect(homePage.emailLink).toHaveCount(1);
    await expect(homePage.page.getByText(testData.contact.city).first()).toBeVisible();
  });
});
