import { test, expect } from '@playwright/test';
import { MudapediaPage } from '../../pages/MudapediaPage';

/**
 * PRACTICE SCENARIOS — interactive checks (IDs follow TC001-TCXXX format).
 * Website: https://mudapediadigitalindonesia.com/
 *
 * TC015 Pricing packages : all 3 packages and their "Beli Paket" buttons render.
 * TC016 Chain switching  : clicking SUI changes the displayed token price.
 * TC017 Team filter       : "Magang" hides staff, "Semua" restores them.
 * TC018 FAQ accordion     : first question expands (aria-expanded true).
 * TC019 Theme toggle      : <html> class changes after clicking the toggle.
 * TC020 Mobile layout     : hero visible at 390x844 with no horizontal overflow.
 *
 * Note: the site needs hydration; page object's goto() waits for 'networkidle'.
 */
test.describe('Practice — Mudapedia interactive UI', () => {
  let web: MudapediaPage;

  test.beforeEach(async ({ page }) => {
    web = new MudapediaPage(page);
    await web.goto();
  });

  test('TC015 renders all three pricing packages', async ({ page }) => {
    await expect(page.getByText('Paket Dasar')).toBeVisible();
    await expect(page.getByText('Paket Standar')).toBeVisible();
    await expect(page.getByText('Paket Lanjutan')).toBeVisible();
    await expect(web.priceBasic).toBeVisible();
    await expect(web.beliPaket).toHaveCount(3);
  });

  test('TC016 switching to SUI updates the displayed price', async ({ page }) => {
    await expect(web.priceBasic).toBeVisible();
    await web.sui.click();
    await expect(page.getByText('Rp. 26.000.000')).toBeVisible();
    await expect(web.priceBasic).toHaveCount(0);
  });

  test('TC017 team filter hides and restores members', async ({ page }) => {
    const iqbal = page.getByRole('heading', { name: 'Iqbal', exact: true });
    const theo = page.getByRole('heading', { name: 'Theo', exact: true });
    await expect(iqbal).toBeVisible();
    await expect(theo).toBeVisible();

    await web.magang.click();
    await expect(iqbal).toBeHidden();
    await expect(theo).toBeHidden();
    await expect(page.getByRole('heading', { name: 'Joko', exact: true })).toBeVisible();

    await web.semua.click();
    await expect(iqbal).toBeVisible();
  });

  test('TC018 FAQ accordion expands on click', async () => {
    await expect(web.faq).toHaveAttribute('aria-expanded', 'false');
    await web.faq.click();
    await expect(web.faq).toHaveAttribute('aria-expanded', 'true');
  });

  test('TC019 theme toggle changes the theme class', async () => {
    const html = web.page.locator('html');
    const before = await html.getAttribute('class');

    let after = before;
    for (let i = 0; i < 3 && after === before; i++) {
      await web.themeToggle.click();
      after = await html.getAttribute('class');
    }
    expect(after).not.toBe(before);
  });

  test('TC020 mobile viewport has no horizontal overflow', async () => {
    await web.page.setViewportSize({ width: 390, height: 844 });
    await web.page.reload({ waitUntil: 'networkidle' });

    await expect(web.hero).toBeVisible();
    await expect(web.page.getByRole('button', { name: 'Toggle menu' })).toBeVisible();

    const overflow = await web.page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.innerWidth + 1);
  });
});
