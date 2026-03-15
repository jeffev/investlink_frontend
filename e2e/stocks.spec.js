const { test, expect } = require('@playwright/test');
const { setupMockApi } = require('./helpers/mockApi');

test.describe('Lista de Ações', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockApi(page);
    await page.goto('/listaAcoes');
  });

  test('exibe linhas na tabela', async ({ page }) => {
    await expect(page.getByRole('cell', { name: 'PETR4' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'VALE3' })).toBeVisible();
  });

  test('exibe campo de busca', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar por ticker/i);
    await expect(searchInput).toBeVisible();
  });

  test('exibe chips de filtro', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'BARATA' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'DY > 8%' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Top Magic Formula' })).toBeVisible();
  });

  test('chip BARATA filtra a tabela', async ({ page }) => {
    // Mock to return only BARATA stocks when chip is active
    await page.route('**/v1/stocks**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            { ticker: 'PETR4', price: 38.5, ml_label: 'BARATA', dy: 12.5, p_l: 4.2, favorita: false, companyname: 'Petrobras', sectorname: 'Petróleo', roic: 18.5, magic_formula_rank: 3 },
          ],
          pagination: { total: 1, page: 1, per_page: 15 },
        }),
      });
    });

    await page.getByRole('button', { name: 'BARATA' }).click();

    // VALE3 should not be visible (ml_label: NEUTRA)
    await expect(page.getByRole('cell', { name: 'VALE3' })).not.toBeVisible();
  });

  test('navega para detalhe da ação ao clicar em Info', async ({ page }) => {
    // Setup individual stock route
    await page.route('**/v1/stock/PETR4', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ticker: 'PETR4', price: 38.5, ml_label: 'BARATA', companyname: 'Petrobras',
        }),
      });
    });
    await page.route('**/v1/stocks/predictions', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) });
    });

    // Click first Info button
    await page.getByRole('button', { name: /ver detalhes/i }).first().click();

    await expect(page).toHaveURL(/\/acao\//);
    await expect(page.getByText('PETR4')).toBeVisible();
  });
});
