import { test, expect } from '../../fixtures';

/**
 * REGRESSION — interactive UI behaviours.
 * IDs TC015-TC020. Tagged @regression.
 */
test.describe('Mudapedia — Regression / Interactions', { tag: '@regression' }, () => {
  test('TC015 renders all three pricing packages', async ({ homePage, testData }) => {
    await homePage.expectPricingVisible();
    expect(testData.pricing.chains).toContain('SOLANA');
  });

  test('TC016 switching to SUI updates the displayed price', async ({ homePage, testData }) => {
    await homePage.switchChain('SUI', testData.pricing.suiBasePrice, testData.pricing.solanaBasePrice);
  });

  test('TC017 team filter hides staff and restores them', async ({ homePage, testData }) => {
    await homePage.filterTeam('Magang', testData.team.staff, testData.team.internStillVisible);
  });

  test('TC018 FAQ accordion expands on click', async ({ homePage }) => {
    await homePage.expandFirstFaq();
  });

  test('TC019 theme toggle changes the theme class', async ({ homePage, page, testData, utils }) => {
    const result = await utils.toggleThemeUntilChanged(page, homePage.themeToggle);
    expect(result.after).not.toBe(result.before);
    expect(testData.theme.toggleLabel).toBe('Toggle theme');
  });

  test('TC020 mobile viewport has no horizontal overflow', async ({ homePage, page, testData, utils }) => {
    await page.setViewportSize(testData.viewport.mobile);
    await page.reload({ waitUntil: 'networkidle' });
    await homePage.expectVisible(homePage.firstHeading);
    await homePage.expectVisible(page.getByRole('button', { name: 'Toggle menu' }));
    await utils.expectNoHorizontalOverflow(page);
  });
});
