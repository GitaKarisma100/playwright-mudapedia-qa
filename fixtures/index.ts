import { test as base, expect } from '@playwright/test';
import { MudapediaHomePage } from '../pages/MudapediaHomePage';
import { GalleryPage } from '../pages/GalleryPage';
import { TEST_DATA, type TestData } from '../test-data/mudapedia.data';
import * as helpers from '../utils/helpers';

/**
 * Custom fixtures: dependency injection for page objects, test data and utils.
 * `homePage` is pre-navigated (networkidle) so specs stay declarative.
 */
type AppFixtures = {
  homePage: MudapediaHomePage;
  galleryPage: GalleryPage;
  testData: TestData;
  utils: typeof helpers;
};

export const test = base.extend<AppFixtures>({
  testData: async ({}, use) => {
    await use(TEST_DATA);
  },
  utils: async ({}, use) => {
    await use(helpers);
  },
  homePage: async ({ page }, use) => {
    const home = new MudapediaHomePage(page);
    await home.goto();
    await use(home);
  },
  galleryPage: async ({ page }, use) => {
    await use(new GalleryPage(page));
  },
});

export { expect };
