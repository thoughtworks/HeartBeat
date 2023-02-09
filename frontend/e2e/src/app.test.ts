import { test, expect } from '@playwright/test'

const PROJECT_NAME = 'Heartbeat'

const startApp = async (page) => {
  await page.goto('/index.html')
}

test('should have project title', async ({ page }) => {
  await startApp(page)

  const projectTitle = page.getByTitle(PROJECT_NAME)

  await expect(projectTitle).toBeVisible()
})
test('should create a new project', async ({ page }) => {
  await startApp(page)
  await page.getByRole('button', { name: 'Create a new project' }).click()

  await expect(page).toHaveURL(/metrics/)
})
