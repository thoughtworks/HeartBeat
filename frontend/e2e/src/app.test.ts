import { test, expect } from '@playwright/test'

const PROJECT_NAME = 'Heartbeat'

test('should have project title', async ({ page }) => {
  await page.goto('/index.html')

  const projectTitle = page.getByTitle(PROJECT_NAME)

  await expect(projectTitle).toBeVisible()
})
test('should create a new project', async ({ page }) => {
  await page.goto('/index.html')

  await page.getByRole('button', { name: 'Create a new project' }).click()

  await expect(page).toHaveURL(/.*metrics/)
})
