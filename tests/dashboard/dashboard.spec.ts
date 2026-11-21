import { test, expect } from '@playwright/test';
import { TEST_DATA } from '../../test-data/mudapedia.data';

/**
 * DASHBOARD SCENARIO
 *
 * Site finding (2026-11-20): GET /dashboard returns 404 — there is no
 * authenticated area on the public site. This scaffold documents the state.
 * Replace with real dashboard checks (login -> goto /dashboard -> assert
 * widgets) when the feature is available.
 *
 * TC021 — Dashboard route availability
 *   Given  the public Mudapedia website
 *   When   a visitor requests the /dashboard route
 *   Then   the response status is 404 (dashboard not implemented yet)
 */
test.describe('Dashboard', { tag: '@regression' }, () => {
  test('TC021 dashboard route is not available on the current site', async ({ request }) => {
    const response = await request.get(new URL('/dashboard', TEST_DATA.baseUrl).toString());
    expect(response.status()).toBe(404);
  });
});
