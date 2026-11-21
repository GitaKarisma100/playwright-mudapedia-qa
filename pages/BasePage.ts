import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Base Page Object: common browser interactions shared by every page object.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** React/Next.js sites need hydration; networkidle is a reliable proxy. */
  async open(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  async waitForReady(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async expectTitle(title: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  currentUrl(): string {
    return this.page.url();
  }

  get firstHeading(): Locator {
    return this.page.getByRole('heading', { level: 1 }).first();
  }

  async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }
}
