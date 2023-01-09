import { test, expect } from '@playwright/test';

test('Hello world', async ({ page }) => {
  await page.goto('http://localhost:5173');
  const locator = page.locator('.title');
  await expect(locator).toBeVisible();
});
