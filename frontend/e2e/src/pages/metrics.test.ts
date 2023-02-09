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
  await expect(page.getByRole('button', { name: 'Next' })).toBeTruthy()
}

const checkBackButton = async (page) => {
  await expect(page.getByRole('button', { name: 'Back' })).toBeTruthy()
}

const checkExportDataButton = async (page) => {
  await expect(page.getByRole('button', { name: 'Export board data' })).toBeTruthy()
}

const clickNextButton = async (page) => {

  await page.getByRole('button', { name: 'Next', exact: true }).first().click()
}

const checkProjectName = async (page) => {
  await expect(page.getByText('Project Name *')).toBeVisible()
  await page.getByLabel('Project Name *').fill('test Project Name')
  await page.getByLabel('Project Name *').fill('')
  await expect(page.getByText('Project Name is required')).toBeTruthy()
}

const checkCollectionData = async (page) => {
  await page.getByRole('heading', { name: 'Collection Data' })
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

const checkDateRangePicker = async (page) => {
  const today = new Date()
  const year = today.getFullYear()
  const day = today.getDate()
  await expect(page.getByLabel('Form *')).toBeTruthy()
  await page.getByRole('button', { name: 'Choose date' }).nth(0).click()
  await page.getByRole('gridcell', { name: `${day}`, exact: true }).click()
  await expect(page.getByText(`${today.getMonth() + 1}/${day}/${year}`)).toBeTruthy()

  await expect(page.getByLabel('To *')).toBeTruthy()
  await page.getByRole('button', { name: 'Choose date' }).nth(1).click()
  await page
    .getByRole('gridcell', { name: `${day}` })
    .nth(1)
    .click()
  await expect(page.getByText(`${today.getMonth() + 1}/${day}/${year}`)).toBeTruthy()

  await page.getByLabel('From *').click()
  await page.getByLabel('From *').fill('02/20')
  expect(await page.getByText('From *').evaluate((e) => window.getComputedStyle(e).getPropertyValue('color'))).not.toBe(
    'black'
  )

  await page.getByLabel('To *').click()
  await page.getByLabel('To *').fill('02/20')
  expect(await page.getByText('To *').evaluate((e) => window.getComputedStyle(e).getPropertyValue('color'))).not.toBe(
    'black'
  )
}

const checkRequireData = async (page) => {
  await page.getByRole('button', { name: 'Required Data' }).click()
  await page.getByRole('option', { name: 'Velocity' }).getByRole('checkbox').check()
  await page.getByRole('option', { name: 'Classification' }).getByRole('checkbox').check()
  await page.locator('.MuiBackdrop-root').click()
  await expect(page.getByText('Velocity,Classification')).toBeTruthy()
  await page.getByRole('button', { name: 'Required Data' }).click()
  await page.getByRole('option', { name: 'Velocity' }).getByRole('checkbox').uncheck()
  await page.getByRole('option', { name: 'Classification' }).getByRole('checkbox').uncheck()
  await page.locator('.MuiBackdrop-root').click()
  await expect(page.getByText('Metrics is required')).toBeTruthy()
}

const checkConfigStepPage = async (page) => {
  await checkSteps(page)
  await checkProjectName(page)
  await checkCollectionData(page)
  await checkDateRangePicker(page)
  await checkRequireData(page)
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
