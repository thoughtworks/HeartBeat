import { test, expect } from '@playwright/test';

test('Hello world', async ({ page }) => {
  await page.goto('http://localhost:4321');
  const locator = page.locator('.title');

  expect(locator).toContainText(['Hello World']);
  await expect(locator).toBeVisible();
});
