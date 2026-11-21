import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { TEST_DATA } from '../test-data/mudapedia.data';

/** Page Object for the /galeri page. */
export class GalleryPage extends BasePage {
  readonly d = TEST_DATA;

  async goto(): Promise<void> {
    await this.open(new URL(this.d.gallery.path, this.d.baseUrl).toString());
  }

  get heading(): Locator {
    return this.page.getByRole('heading', { name: this.d.gallery.heading });
  }

  get postLinks(): Locator {
    return this.page.getByRole('link', { name: 'Lihat Postingan' });
  }
}
