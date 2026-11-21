import { test, expect } from '@playwright/test';
import { BASE_URL } from '../pages/MudapediaPage';

/**
 * ============================================================================
 * TEST CASE IDS: TC001 - TC014  (format TC001-TCXXX)
 * Website: https://mudapediadigitalindonesia.com/
 *
 * Live page facts used here (checked 2026-11-20):
 *   - real section ids are #tim, #harga, #tentang, #galeri
 *     (the names #TimKami / #tentangkami are labels, not actual ids)
 *   - /galeri is a real page (h1 = "Galeri Instagram")
 *   - the landing page has NO input, textarea, select or checkbox.
 *     Therefore fill/type/check/uncheck/selectOption/getByPlaceholder/
 *     getByTestId are exercised on a tiny local HTML fixture via
 *     page.setContent() — no behaviour is invented for the real site.
 *
 * TC001 goto + title + url       : open URL, verify current URL and title
 * TC002 reload                   : refresh and verify page still loads
 * TC003 goBack + goForward       : home -> /galeri -> back -> forward
 * TC004 anchor navigation        : #tim, #harga, #tentang links & targets
 * TC005 getByRole                : heading, button, link by role
 * TC006 getByText                : package names and body copy
 * TC007 getByLabel               : button with aria-label "Toggle theme"
 * TC008 getByPlaceholder + fill + type (fixture)
 * TC009 getByTestId (fixture)
 * TC010 locator() CSS + XPath
 * TC011 click() on live chain tab changes price
 * TC012 press() keyboard (fixture)
 * TC013 check() / uncheck() (fixture)
 * TC014 selectOption() dropdown (fixture)
 * ============================================================================
 */
test.describe('Mudapedia — Playwright API coverage', () => {
  test.beforeEach(async ({ page }) => {
    // The site is React/Next.js: hydration completes on networkidle.
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  });

  test('TC001 page.goto(), page.url() and page.title()', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    expect(page.url()).toBe(BASE_URL);
    expect(await page.title()).toBe('Mudapedia Digital Indonesia');
    await expect(page).toHaveTitle('Mudapedia Digital Indonesia');
  });

  test('TC002 page.reload() refreshes the page', async ({ page }) => {
    await expect(page).toHaveTitle('Mudapedia Digital Indonesia');
    await page.reload({ waitUntil: 'networkidle' });
    expect(page.url()).toBe(BASE_URL);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  });

  test('TC003 page.goBack() and page.goForward()', async ({ page }) => {
    await page.getByRole('link', { name: 'Galeri', exact: true }).first().click();
    await expect(page).toHaveURL(/\/galeri$/);
    await expect(page.getByRole('heading', { name: 'Galeri Instagram' })).toBeVisible();

    await page.goBack({ waitUntil: 'networkidle' });
    expect(page.url()).toBe(BASE_URL);

    await page.goForward({ waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/galeri$/);
  });

  test('TC004 anchor links #tim, #harga, #tentang navigate to sections', async ({ page }) => {
    for (const id of ['tim', 'harga', 'tentang']) {
      await page.locator(`a[href="/#${id}"]`).first().click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
  });

  test('TC005 getByRole() finds heading, button and link', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Kecepatan dalam Industri Web3/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Toggle theme' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Tim Kami' }).first()).toBeVisible();
  });

  test('TC006 getByText() finds package names and hero copy', async ({ page }) => {
    await expect(page.getByText('Paket Dasar')).toBeVisible();
    await expect(page.getByText('Paket Standar')).toBeVisible();
    await expect(page.getByText(/Web3, blockchain, dan kripto/).first()).toBeVisible();
  });

  test('TC007 getByLabel() finds the theme button by aria-label', async ({ page }) => {
    await expect(page.getByLabel('Toggle theme').first()).toBeVisible();
  });

  test('TC008 getByPlaceholder() + .fill() + .type() on a local fixture', async ({ page }) => {
    await page.setContent('<input placeholder="Cari paket" aria-label="Kata kunci" />');
    const input = page.getByPlaceholder('Cari paket');

    await input.fill('token solana');
    await expect(input).toHaveValue('token solana');

    await input.fill('');
    await input.type('sui'); // deprecated API, included because requested
    await expect(input).toHaveValue('sui');
  });

  test('TC009 getByTestId() on a local fixture', async ({ page }) => {
    await page.setContent('<div data-testid="paket-dasar">Paket Dasar</div>');
    await expect(page.getByTestId('paket-dasar')).toHaveText('Paket Dasar');
  });

  test('TC010 locator() with CSS and XPath', async ({ page }) => {
    await expect(page.locator('a[href="/galeri"]').first()).toBeVisible();
    await expect(page.locator('//h1').first()).toBeVisible();
  });

  test('TC011 .click() switches the blockchain tab and price', async ({ page }) => {
    await expect(page.getByText('Rp. 35.500.000')).toBeVisible();
    await page.getByRole('button', { name: 'SUI', exact: true }).click();
    await expect(page.getByText('Rp. 26.000.000')).toBeVisible();
  });

  test('TC012 .press() keyboard on a local fixture', async ({ page }) => {
    await page.setContent(`
      <input data-testid="press-field" />
      <div id="result"></div>
      <script>
        document.querySelector('[data-testid=press-field]').addEventListener('keydown', e => {
          if (e.key === 'Enter') document.getElementById('result').textContent = 'enter-ditekan';
        });
      </script>`);
    const field = page.getByTestId('press-field');
    await field.fill('halo');
    await field.press('Enter');
    await expect(page.locator('#result')).toHaveText('enter-ditekan');
  });

  test('TC013 .check() and .uncheck() on a local fixture', async ({ page }) => {
    await page.setContent('<label><input type="checkbox" /> Saya setuju</label>');
    const checkbox = page.getByLabel('Saya setuju');
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('TC014 .selectOption() on a local fixture', async ({ page }) => {
    await page.setContent(`
      <label for="chain">Jaringan
        <select id="chain">
          <option value="solana">SOLANA</option>
          <option value="sui">SUI</option>
        </select>
      </label>`);
    const select = page.getByLabel('Jaringan');
    await select.selectOption('sui');
    await expect(select).toHaveValue('sui');
  });
});
