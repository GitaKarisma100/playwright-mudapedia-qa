import { test, expect } from '../../fixtures';
import { setFormFixture } from '../../utils/helpers';

/**
 * REGRESSION — Playwright API coverage with POM + custom fixtures + test data.
 * IDs TC001-TC014. Tagged @regression.
 */
test.describe('Mudapedia — Regression / API coverage', { tag: '@regression' }, () => {
  test('TC001 goto + url + title', async ({ homePage, testData }) => {
    expect(homePage.currentUrl()).toBe(testData.baseUrl);
    await homePage.expectTitle(testData.title);
  });

  test('TC002 reload keeps the page usable', async ({ homePage, page }) => {
    await page.reload({ waitUntil: 'networkidle' });
    await homePage.expectVisible(homePage.firstHeading);
  });

  test('TC003 goBack / goForward between home and gallery', async ({ homePage, page, testData, galleryPage }) => {
    await homePage.navLink('Galeri').click();
    await expect(page).toHaveURL(/\/galeri$/);
    await galleryPage.expectVisible(galleryPage.heading);

    await page.goBack({ waitUntil: 'networkidle' });
    expect(page.url()).toBe(testData.baseUrl);
    await page.goForward({ waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/galeri$/);
  });

  test('TC004 anchor navigation to sections', async ({ homePage, testData }) => {
    for (const id of testData.sections.filter((s) => s !== 'galeri')) {
      await homePage.clickSection(id);
      await homePage.expectHash(id);
    }
  });

  test('TC005 getByRole finds heading, button and link', async ({ homePage, testData }) => {
    await homePage.expectVisible(homePage.heroHeading);
    await homePage.expectVisible(homePage.themeToggle);
    await homePage.expectVisible(homePage.navLink('Tim Kami'));
    expect(testData.team.filters.length).toBe(3);
  });

  test('TC006 getByText finds package names and hero copy', async ({ homePage, testData }) => {
    for (const name of testData.pricing.packages) await homePage.expectVisible(homePage.packageCard(name));
    await homePage.expectVisible(homePage.heroIntro);
  });

  test('TC007 getByLabel finds the theme toggle by aria-label', async ({ homePage }) => {
    await homePage.expectVisible(homePage.themeToggleByLabel);
  });

  test('TC008 getByPlaceholder + fill + type on a local fixture', async ({ page, testData, utils }) => {
    await utils.setFormFixture(page);
    const input = page.getByPlaceholder(testData.formFixture.placeholder);
    await input.fill('token solana');
    await expect(input).toHaveValue('token solana');
    await input.fill('');
    await input.type('sui');
    await expect(input).toHaveValue('sui');
  });

  test('TC009 getByTestId on a local fixture', async ({ page, testData, utils }) => {
    await utils.setFormFixture(page);
    await expect(page.getByTestId(testData.formFixture.testId)).toHaveText('Paket Dasar');
  });

  test('TC010 locator() with CSS and XPath', async ({ homePage, page }) => {
    await expect(page.locator('a[href="/galeri"]').first()).toBeVisible();
    await expect(page.locator('//h1').first()).toBeVisible();
    await expect(homePage.firstHeading).toBeVisible();
  });

  test('TC011 click() chain tab changes the price', async ({ homePage, testData }) => {
    await homePage.switchChain('SUI', testData.pricing.suiBasePrice, testData.pricing.solanaBasePrice);
  });

  test('TC012 press() keyboard on a local fixture', async ({ page, testData, utils }) => {
    await utils.setFormFixture(page);
    const field = page.getByTestId(testData.formFixture.pressFieldId);
    await field.fill('halo');
    await field.press('Enter');
    await expect(page.locator('#press-result')).toHaveText(testData.formFixture.pressResult);
  });

  test('TC013 check() / uncheck() on a local fixture', async ({ page, testData, utils }) => {
    await utils.setFormFixture(page);
    const checkbox = page.getByLabel(testData.formFixture.checkboxLabel);
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('TC014 selectOption() on a local fixture', async ({ page, testData, utils }) => {
    await utils.setFormFixture(page);
    const select = page.getByLabel(testData.formFixture.selectLabel);
    await select.selectOption('sui');
    await expect(select).toHaveValue('sui');
  });
});
