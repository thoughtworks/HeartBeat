import { expect, test } from '@playwright/test'

const STEPS = ['Config', 'Metrics', 'Export']
const BACK = 'Back'
const NEXT = 'Next'
const EXPORT_BOARD_DATA = 'Export board data'

const clickCreateNewProjectButton = async (page) => {
  await page.goto('/index.html')
  await page.getByRole('button', { name: 'Create a new project' }).click()
}

const checkSteps = async (page) => {
  STEPS.map(async (label) => {
    await expect(page.getByText(label, { exact: true })).toBeTruthy()
  })
}

export const checkNextButton = async (page) => {
  await expect(page.getByRole('button', { name: NEXT })).toBeTruthy()
}

export const checkBackButton = async (page) => {
  await expect(page.getByRole('button', { name: BACK })).toBeTruthy()
}

const checkExportDataButton = async (page) => {
  await expect(page.getByRole('button', { name: EXPORT_BOARD_DATA })).toBeTruthy()
}

const clickNextButton = async (page) => {
  await page.getByRole('button', { name: NEXT, exact: true }).first().click()
}

const checkConfigStepPage = async (page) => {
  await checkSteps(page)
  await checkNextButton(page)
  await checkBackButton(page)
}

const checkMetricsStepPage = async (page) => {
  await checkSteps(page)
  await checkNextButton(page)
  await checkBackButton(page)
}

const checkExportStepPage = async (page) => {
  await checkSteps(page)
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
