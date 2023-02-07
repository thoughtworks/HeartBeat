import { expect, test } from '@playwright/test'

const NEXT = 'Next'
const BACK = 'Back'
const EXPORT_BOARD_DATA = 'Export board data'
const STEPS = ['Config', 'Metrics', 'Export']

const clickCreateNewProjectButton = async (page) => {
  await page.goto('/index.html')
  await page.getByRole('button', { name: 'Create a new project' }).click()
}

const clickNextButton = async (page) => {
  await page.getByRole('button', { name: NEXT }).click()
}

const checkConfigStepPage = async (page) => {
  STEPS.map(async (label) => {
    await expect(page.getByText(label)).toBeVisible()
  })
  await expect(page.getByText('Step 1')).toBeVisible()
  await expect(page.getByRole('button', { name: NEXT })).toBeVisible()
  await expect(page.getByRole('button', { name: BACK })).toBeVisible()
}

const checkMetricsStepPage = async (page) => {
  STEPS.map(async (label) => {
    await expect(page.getByText(label)).toBeVisible()
  })
  await expect(page.getByText('Step 2')).toBeVisible()
  await expect(page.getByRole('button', { name: NEXT })).toBeVisible()
  await expect(page.getByRole('button', { name: BACK })).toBeVisible()
}

const checkExportStepPage = async (page) => {
  STEPS.map(async (label) => {
    await expect(page.getByText(label, { exact: true })).toBeVisible()
  })
  await expect(page.getByText('Step 3')).toBeVisible()
  await expect(page.getByRole('button', { name: EXPORT_BOARD_DATA })).toBeVisible()
  await expect(page.getByRole('button', { name: BACK })).toBeVisible()
}

test('should render metrics page', async ({ page }) => {
  await clickCreateNewProjectButton(page)

  await checkConfigStepPage(page)

  await clickNextButton(page)

  await checkMetricsStepPage(page)

  await clickNextButton(page)

  await checkExportStepPage(page)
})
