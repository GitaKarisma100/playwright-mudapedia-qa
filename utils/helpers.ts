import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

/** Reusable helpers shared across specs — no page-specific locators here. */
export function sectionHash(id: string): string {
  return `#${id}`;
}

/** Assert the page has no horizontal overflow at the current viewport. */
export async function expectNoHorizontalOverflow(page: Page, maxDelta = 1): Promise<void> {
  const size = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(size.scrollWidth).toBeLessThanOrEqual(size.innerWidth + maxDelta);
}

/**
 * Theme toggles can be a no-op on the first click when the OS already prefers
 * the active theme. Click until the class actually changes (max 3 attempts).
 */
export async function toggleThemeUntilChanged(
  page: Page,
  toggler: { click: () => Promise<void> },
  maxAttempts = 3,
): Promise<{ before: string | null; after: string | null }> {
  const html = page.locator('html');
  const before = await html.getAttribute('class');
  let after = before;
  for (let i = 0; i < maxAttempts && after === before; i++) {
    await toggler.click();
    after = await html.getAttribute('class');
  }
  expect(after).not.toBe(before);
  return { before, after };
}

/** Load a tiny local form fixture for demonstrating form-related APIs. */
export async function setFormFixture(page: Page): Promise<void> {
  await page.setContent(`
    <input placeholder="Cari paket" aria-label="Kata kunci" />
    <div data-testid="paket-dasar">Paket Dasar</div>
    <label><input type="checkbox" /> Saya setuju</label>
    <label for="chain">Jaringan
      <select id="chain">
        <option value="solana">SOLANA</option>
        <option value="sui">SUI</option>
      </select>
    </label>
    <input data-testid="press-field" />
    <div id="press-result"></div>
    <script>
      document.querySelector('[data-testid=press-field]').addEventListener('keydown', e => {
        if (e.key === 'Enter') document.getElementById('press-result').textContent = 'enter-ditekan';
      });
    </script>`);
}
