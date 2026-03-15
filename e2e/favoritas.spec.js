const { test, expect } = require('@playwright/test');
const { setupMockApi } = require('./helpers/mockApi');

test.describe('Favoritas', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockApi(page);
    await page.goto('/favoritas');
  });

  test('exibe a lista de favoritas', async ({ page }) => {
    await expect(page.getByRole('cell', { name: 'PETR4' })).toBeVisible();
  });

  test('exibe preço teto formatado em BRL', async ({ page }) => {
    await expect(page.getByText(/R\$\s*45/)).toBeVisible();
  });
});
