import { expect, test } from '@playwright/test'

const steps = ['Config', 'Metrics', 'Export']
export const REGULAR_CALENDAR = 'Regular Calendar(Weekend Considered)'
export const CHINA_CALENDAR = 'Calendar with Chinese Holiday'

const clickCreateNewProjectButton = async (page) => {
  await page.goto('/index.html')
  await page.getByRole('button', { name: 'Create a new project' }).click()
}

const checkSteps = async (page) => {
  steps.map(async (label) => {
    await expect(page.getByText(label, { exact: true })).toBeVisible()
  })
}

const checkNextButton = async (page) => {
  await expect(page.getByRole('button', { name: 'Next' })).toBeVisible()
}

const checkBackButton = async (page) => {
  await expect(page.getByRole('button', { name: 'Back' })).toBeVisible()
}

const checkExportDataButton = async (page) => {
  await expect(page.getByRole('button', { name: 'Export board data' })).toBeVisible()
}

const clickNextButton = async (page) => {
  await page.getByRole('button', { name: 'Next' }).click()
}

const checkProjectName = async (page) => {
  await expect(page.getByText('Project Name')).toBeVisible()
}

const checkCollectionData = async (page) => {
  const defaultValue = page.getByRole('radio', { name: REGULAR_CALENDAR })
  const regularCalendar = page.getByRole('radio', { name: REGULAR_CALENDAR })
  const chinaCalendar = page.getByRole('radio', { name: CHINA_CALENDAR })

  await expect(regularCalendar).toBeVisible()
  await expect(chinaCalendar).toBeVisible()
  await expect(defaultValue).toBeChecked()
  await expect(chinaCalendar).not.toBeChecked()

  chinaCalendar.click()

  await expect(chinaCalendar).toBeChecked()
  await expect(regularCalendar).not.toBeChecked()

  regularCalendar.click()

  await expect(regularCalendar).toBeChecked()
  await expect(chinaCalendar).not.toBeChecked()
}

const checkConfigStepPage = async (page) => {
  await checkSteps(page)
  await checkProjectName(page)
  await checkCollectionData(page)
  await checkNextButton(page)
  await checkBackButton(page)
}

const checkMetricsStepPage = async (page) => {
  await checkSteps(page)
  await checkProjectName(page)
  await checkNextButton(page)
  await checkBackButton(page)
}

const checkExportStepPage = async (page) => {
  await checkSteps(page)
  await checkProjectName(page)
  await checkExportDataButton(page)
  await checkBackButton(page)
}

test('should render metrics page', async ({ page }) => {
  await clickCreateNewProjectButton(page)

  await checkConfigStepPage(page)

  await clickNextButton(page)

  await checkMetricsStepPage(page)

  await clickNextButton(page)

  await checkExportStepPage(page)
})
