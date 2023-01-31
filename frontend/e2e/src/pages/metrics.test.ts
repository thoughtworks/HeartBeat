import { expect, test } from '@playwright/test'

const steps = ['Config', 'Metrics', 'Export']

const createNewProject = async (page) => {
  await page.goto('/index.html')
  await page.getByRole('button', { name: 'Create a new project' }).click()
}

const nextStep = async (page) => {
  await page.getByRole('button', { name: 'Next' }).click()
}

const checkMetricsConfigPage = async (page) => {
  steps.map(async (label) => {
    await expect(page.getByText(label)).toBeVisible()
  })
  await expect(page.getByText('Step 1')).toBeVisible()
  await expect(page.getByText('Next')).toBeVisible()
  await expect(page.getByText('Back')).toBeVisible()
}

const checkMetricsPage = async (page) => {
  steps.map(async (label) => {
    await expect(page.getByText(label)).toBeVisible()
  })
  await expect(page.getByText('Step 2')).toBeVisible()
  await expect(page.getByText('Next')).toBeVisible()
  await expect(page.getByText('Back')).toBeVisible()
}

const checkExpectExportPage = async (page) => {
  await expect(page.getByText('Step 3')).toBeVisible()
  await expect(page.getByText('Export board data')).toBeVisible()
  await expect(page.getByText('Back')).toBeVisible()
}

test('should render metrics page', async ({ page }) => {
  await createNewProject(page)

  await checkMetricsConfigPage(page)

  await nextStep(page)

  await checkMetricsPage(page)

  await nextStep(page)

  await checkExpectExportPage(page)
})
