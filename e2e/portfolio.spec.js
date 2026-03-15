const { test, expect } = require('@playwright/test');
const { setupMockApi } = require('./helpers/mockApi');

test.describe('Portfolio', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockApi(page);
    await page.goto('/portfolio');
  });

  test('exibe título Minha Carteira', async ({ page }) => {
    await expect(page.getByText('Minha Carteira')).toBeVisible();
  });

  test('exibe resumo com Total Investido', async ({ page }) => {
    await expect(page.getByText('Total Investido')).toBeVisible();
  });

  test('exibe posição PETR4 na tabela', async ({ page }) => {
    await expect(page.getByRole('cell', { name: 'PETR4' })).toBeVisible();
  });

  test('abre modal para adicionar posição', async ({ page }) => {
    await page.getByRole('button', { name: /adicionar posição/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog').getByText(/adicionar/i)).toBeVisible();
  });
});
