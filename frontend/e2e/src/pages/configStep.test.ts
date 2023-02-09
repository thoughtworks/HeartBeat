import { expect, test } from '@playwright/test'

const PROJECT_NAME_LABEL = 'Project Name *'
const REGULAR_CALENDAR = 'Regular Calendar(Weekend Considered)'
const CHINA_CALENDAR = 'Calendar with Chinese Holiday'
const COLLECTION_DATA = 'Collection Data'
const FORM_LABEL = 'From *'
const CHOOSE_DATA = 'Choose date'
const TO_LABEL = 'To *'
const ERROR_DATE = '02/20'
const REQUIRED_DATA = 'Required Data'
const VELOCITY = 'Velocity'
const CLASSIFICATION = 'Classification'

const clickCreateNewProjectButton = async (page) => {
  await page.goto('/index.html')
  await page.getByRole('button', { name: 'Create a new project' }).click()
}

const checkProjectName = async (page) => {
  await expect(page.getByText(PROJECT_NAME_LABEL)).toBeVisible()
  await page.getByLabel(PROJECT_NAME_LABEL).fill('test Project Name')
  await page.getByLabel(PROJECT_NAME_LABEL).fill('')
  await expect(page.getByText('Project Name is required')).toBeTruthy()
}

const checkCollectionData = async (page) => {
  await page.getByRole('heading', { name: COLLECTION_DATA })
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
  const month = today.getMonth() + 1

  await expect(page.getByLabel(FORM_LABEL)).toBeTruthy()

  await page.getByRole('button', { name: CHOOSE_DATA }).nth(0).click()
  await page.getByRole('gridcell', { name: `${day}`, exact: true }).click()

  await expect(page.getByText(`${month}/${day}/${year}`)).toBeTruthy()

  await expect(page.getByLabel(TO_LABEL)).toBeTruthy()

  await page.getByRole('button', { name: CHOOSE_DATA }).nth(1).click()
  await page
    .getByRole('gridcell', { name: `${day}` })
    .nth(1)
    .click()

  await expect(page.getByText(`${month}/${day}/${year}`)).toBeTruthy()

  await page.getByLabel(FORM_LABEL).click()
  await page.getByLabel(FORM_LABEL).fill(ERROR_DATE)

  expect(
    await page.getByText(FORM_LABEL).evaluate((e) => window.getComputedStyle(e).getPropertyValue('color'))
  ).not.toBe('black')

  await page.getByLabel(TO_LABEL).click()
  await page.getByLabel(TO_LABEL).fill(ERROR_DATE)

  expect(await page.getByText(TO_LABEL).evaluate((e) => window.getComputedStyle(e).getPropertyValue('color'))).not.toBe(
    'black'
  )
}

const checkRequireData = async (page) => {
  await page.getByRole('button', { name: REQUIRED_DATA }).click()
  await page.getByRole('option', { name: VELOCITY }).getByRole('checkbox').check()
  await page.getByRole('option', { name: CLASSIFICATION }).getByRole('checkbox').check()
  await page.locator('.MuiBackdrop-root').click()

  await expect(page.getByText('Velocity,Classification')).toBeTruthy()

  await page.getByRole('button', { name: REQUIRED_DATA }).click()
  await page.getByRole('option', { name: VELOCITY }).getByRole('checkbox').uncheck()
  await page.getByRole('option', { name: CLASSIFICATION }).getByRole('checkbox').uncheck()
  await page.locator('.MuiBackdrop-root').click()

  await expect(page.getByText('Metrics is required')).toBeTruthy()
}

const checkBoard = async (page) => {
  await expect(page.locator('heading=board')).toBeTruthy()
  await expect(page.locator('text=Jira')).toBeTruthy()

  await page.getByRole('button', { name: 'board' }).click()
  await page.getByText('Classic Jira').click()

  await expect(page.locator('text=Classic Jira')).toBeTruthy()
}

const checkConfigStepPage = async (page) => {
  await checkProjectName(page)
  await checkCollectionData(page)
  await checkDateRangePicker(page)
  await checkRequireData(page)
  await checkBoard(page)
}

test('should check config step page', async ({ page }) => {
  await clickCreateNewProjectButton(page)
  await checkConfigStepPage(page)
})
