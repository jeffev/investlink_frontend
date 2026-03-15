const { test: setup, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const AUTH_FILE = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Mock the login API
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

  // Wait for redirect to dashboard
  await page.waitForURL('/');

  // Save auth state
  const dir = path.dirname(AUTH_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  await page.context().storageState({ path: AUTH_FILE });
});
