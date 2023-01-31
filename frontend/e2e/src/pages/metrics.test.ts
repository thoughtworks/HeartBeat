import { expect, test } from '@playwright/test'

const steps = ['Config', 'Metrics', 'Export']

const clickCreateNewProjectButton = async (page) => {
  await page.goto('/index.html')
  await page.getByRole('button', { name: 'Create a new project' }).click()
}

const clickNextButton = async (page) => {
  await page.getByRole('button', { name: 'Next' }).click()
}

const checkConfigStepPage = async (page) => {
  steps.map(async (label) => {
    await expect(page.getByText(label)).toBeVisible()
  })
  await expect(page.getByText('Project Name')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Next' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Back' })).toBeVisible()
}

const checkMetricsStepPage = async (page) => {
  steps.map(async (label) => {
    await expect(page.getByText(label)).toBeVisible()
  })
  await expect(page.getByText('Project Name')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Next' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Back' })).toBeVisible()
}

const checkExportStepPage = async (page) => {
  steps.map(async (label) => {
    await expect(page.getByText(label, { exact: true })).toBeVisible()
  })
  await expect(page.getByText('Project Name')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Export board data' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Back' })).toBeVisible()
}

test('should render metrics page', async ({ page }) => {
  await clickCreateNewProjectButton(page)

  await checkConfigStepPage(page)

  await clickNextButton(page)

  await checkMetricsStepPage(page)

  await clickNextButton(page)

  await checkExportStepPage(page)
})
