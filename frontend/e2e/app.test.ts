import { test, expect } from '@playwright/test';

test('Hello world', async ({ page }) => {
  await page.goto('/index.html');
  const locator = page.locator('.title');

  expect(locator).toContainText(['Hello World']);
  await expect(locator).toBeVisible();
});
