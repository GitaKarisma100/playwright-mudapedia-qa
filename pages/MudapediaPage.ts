import type { Locator, Page } from '@playwright/test';

/** Shared base URL for the Mudapedia test suite. */
export const BASE_URL = 'https://mudapediadigitalindonesia.com/';

/**
 * Page Object for the Mudapedia landing page.
 * Reused by the smoke spec and the practice specs.
 * The site is React/Next.js — always wait for 'networkidle' before interacting.
 */
export class MudapediaPage {
  readonly page: Page;
  readonly hero: Locator;
  readonly beliPaket: Locator;
  readonly priceBasic: Locator;
  readonly sui: Locator;
  readonly magang: Locator;
  readonly semua: Locator;
  readonly faq: Locator;
  readonly themeToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.hero = page.getByRole('heading', { level: 1 }).first();
    this.beliPaket = page.getByRole('button', { name: 'Beli Paket' });
    this.priceBasic = page.getByText('Rp. 35.500.000');
    this.sui = page.getByRole('button', { name: 'SUI', exact: true });
    this.magang = page.getByRole('button', { name: 'Magang', exact: true });
    this.semua = page.getByRole('button', { name: 'Semua', exact: true });
    this.faq = page.locator('button[aria-expanded]').first();
    this.themeToggle = page.getByRole('button', { name: 'Toggle theme' }).first();
  }

  async goto(): Promise<void> {
    await this.page.goto(BASE_URL, { waitUntil: 'networkidle' });
  }
}
