const { test, expect } = require('@playwright/test');
const { setupMockApi } = require('./helpers/mockApi');

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockApi(page);
    await page.goto('/');
  });

  test('exibe título Dashboard', async ({ page }) => {
    await expect(page.getByText('Dashboard')).toBeVisible();
  });

  test('exibe card Minhas Favoritas', async ({ page }) => {
    await expect(page.getByText('Minhas Favoritas')).toBeVisible();
  });

  test('exibe card Top Picks ML', async ({ page }) => {
    await expect(page.getByText(/Top Picks ML/)).toBeVisible();
  });

  test('exibe card Meu Portfólio quando há investimentos', async ({ page }) => {
    await expect(page.getByText('Meu Portfólio')).toBeVisible();
  });
});
