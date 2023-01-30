import { expect, test } from '@playwright/test'

const steps = ['Config', 'Metrics', 'Export']

test('should render metrics page', async ({ page }) => {
  await page.goto('/index.html')

  await page.getByRole('button', { name: 'Create a new project' }).click()

  steps.map(async (label) => {
    await expect(page.getByText(label)).toBeVisible()
  })
  await expect(page.getByText('Step 1')).toBeVisible()
  await expect(page.getByText('Next')).toBeVisible()
  await expect(page.getByText('Back')).toBeVisible()

  await page.getByRole('button', { name: 'Next' }).click()
  await expect(page.getByText('Step 2')).toBeVisible()

  await page.getByRole('button', { name: 'Next' }).click()
  await expect(page.getByText('Step 3')).toBeVisible()
  await expect(page.getByText('Export board data')).toBeVisible()
})
