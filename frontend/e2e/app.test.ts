import { test, expect } from '@playwright/test'

const PROJECT_NAME = 'Heartbeat'

test('should have project title', async ({ page }) => {
  await page.goto('/index.html')

  const projectTitle = page.getByTitle(PROJECT_NAME)

  await expect(projectTitle).toBeVisible()
})
