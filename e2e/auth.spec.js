const { test, expect } = require('@playwright/test');

// Auth tests run without saved auth state
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Autenticação', () => {
  test('redireciona para /login quando não autenticado', async ({ page }) => {
    // Mock login to avoid real backend
    await page.route('**/v1/auth/**', (route) =>
      route.fulfill({ status: 401, body: '{}' })
    );
    await page.goto('/');
    await expect(page).toHaveURL(/.*login/);
  });

  test('login com credenciais válidas redireciona para dashboard', async ({ page }) => {
    await page.route('**/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6IlVTRVIiLCJleHAiOjk5OTk5OTk5OTl9.test',
        }),
      });
    });

    await page.goto('/login');
    await page.getByLabel(/e-mail/i).fill('test@example.com');
    await page.getByLabel(/senha/i).fill('password123');
    await page.getByRole('button', { name: /entrar/i }).click();

    await expect(page).toHaveURL('/');
  });

  test('login com credenciais inválidas exibe mensagem de erro', async ({ page }) => {
    await page.route('**/v1/auth/login', (route) =>
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Credenciais inválidas' }),
      })
    );

    await page.goto('/login');
    await page.getByLabel(/e-mail/i).fill('wrong@example.com');
    await page.getByLabel(/senha/i).fill('wrongpassword');
    await page.getByRole('button', { name: /entrar/i }).click();

    await expect(page.getByRole('alert')).toBeVisible();
  });
});
