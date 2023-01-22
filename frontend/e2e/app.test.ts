import { test, expect } from '@playwright/test';

const PROJECT_NAME = 'Heartbeat';

test('Hello world', async ({ page }) => {
  await page.goto('/index.html');

  const projectTitle = page.getByText(PROJECT_NAME);

  await expect(projectTitle).toBeVisible();
});
