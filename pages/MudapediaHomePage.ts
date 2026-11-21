import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { TEST_DATA } from '../test-data/mudapedia.data';
import { expect } from '@playwright/test';

/**
 * Page Object for the Mudapedia landing page.
 * Locators live here; specs only call intention-revealing methods.
 */
export class MudapediaHomePage extends BasePage {
  readonly d = TEST_DATA;

  async goto(): Promise<void> {
    await this.open(this.d.baseUrl);
  }

  // ---- Locators -----------------------------------------------------------
  get heroHeading(): Locator {
    return this.page.getByRole('heading', { name: this.d.hero.heading });
  }

  get heroIntro(): Locator {
    return this.page.getByText(this.d.hero.intro).first();
  }

  navLink(label: string): Locator {
    return this.page.getByRole('link', { name: label }).first();
  }

  section(id: string): Locator {
    return this.page.locator(`#${id}`);
  }

  sectionLink(id: string): Locator {
    return this.page.locator(`a[href="/#${id}"]`).first();
  }

  get beliPaketButtons(): Locator {
    return this.page.getByRole('button', { name: 'Beli Paket' });
  }

  packageCard(name: string): Locator {
    return this.page.getByText(name);
  }

  price(text: string): Locator {
    return this.page.getByText(text);
  }

  chainTab(name: string): Locator {
    return this.page.getByRole('button', { name, exact: true });
  }

  teamMember(name: string): Locator {
    return this.page.getByRole('heading', { name, exact: true });
  }

  filterButton(name: string): Locator {
    return this.page.getByRole('button', { name, exact: true });
  }

  get faqItems(): Locator {
    return this.page.locator('button[aria-expanded]');
  }

  get themeToggle(): Locator {
    return this.page.getByRole('button', { name: this.d.theme.toggleLabel }).first();
  }

  get themeToggleByLabel(): Locator {
    return this.page.getByLabel(this.d.theme.toggleLabel).first();
  }

  get emailLink(): Locator {
    return this.page.locator(`a[href="${this.d.contact.emailHref}"]`);
  }

  get phoneText(): Locator {
    return this.page.getByText(this.d.contact.phone);
  }

  // ---- Interactions / assertions -----------------------------------------
  async expectHeroVisible(): Promise<void> {
    await this.expectVisible(this.heroHeading);
    await this.expectVisible(this.heroIntro);
  }

  async expectNavigationIntact(): Promise<void> {
    for (const id of this.d.sections.filter((s) => s !== 'galeri')) {
      await expect(this.sectionLink(id)).toHaveCount(1);
      await expect(this.section(id)).toHaveCount(1);
    }
    await expect(this.page.locator(`a[href="${this.d.gallery.path}"]`).first()).toHaveCount(1);
  }

  async clickSection(id: string): Promise<void> {
    await this.sectionLink(id).click();
  }

  async expectHash(id: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`#${id}$`));
    await this.expectVisible(this.section(id));
  }

  async expectPricingVisible(): Promise<void> {
    for (const name of this.d.pricing.packages) await this.expectVisible(this.packageCard(name));
    await this.expectVisible(this.price(this.d.pricing.solanaBasePrice));
    await expect(this.beliPaketButtons).toHaveCount(this.d.pricing.buyButtonCount);
  }

  async switchChain(name: string, expectedPrice: string, oldPrice: string): Promise<void> {
    await this.expectVisible(this.price(oldPrice));
    await this.chainTab(name).click();
    await this.expectVisible(this.price(expectedPrice));
    await expect(this.price(oldPrice)).toHaveCount(0);
  }

  async filterTeam(filter: string, hidden: readonly string[], stillVisible: string): Promise<void> {
    for (const name of hidden) await this.expectVisible(this.teamMember(name));
    await this.filterButton(filter).click();
    for (const name of hidden) await expect(this.teamMember(name)).toBeHidden();
    await this.expectVisible(this.teamMember(stillVisible));
    await this.filterButton('Semua').click();
    await this.expectVisible(this.teamMember(hidden[0]));
  }

  async expandFirstFaq(): Promise<void> {
    await expect(this.faqItems).toHaveCount(this.d.faqCount);
    await expect(this.faqItems.first()).toHaveAttribute('aria-expanded', 'false');
    await this.faqItems.first().click();
    await expect(this.faqItems.first()).toHaveAttribute('aria-expanded', 'true');
  }

  getHtmlClass(): Promise<string | null> {
    return this.page.locator('html').getAttribute('class');
  }
}
