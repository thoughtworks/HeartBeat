import { Page, expect, Locator } from '@playwright/test'
import { ERROR_DATE, STEPS } from '../fixtures'

const today = new Date()
const year = today.getFullYear()
const day = today.getDate()
const month = today.getMonth() + 1

export default class Metrics {
  page: Page
  readonly projectNameErrorMessage: Locator
  readonly projectNameLabel: Locator
  readonly collectionDate: Locator
  readonly regularCalendar: Locator
  readonly chinaCalendar: Locator
  readonly chooseDateButton: Locator
  readonly chooseDate: Locator
  readonly formDateLabel: Locator
  readonly endDateLabel: Locator
  readonly requireDataButton: Locator
  readonly velocityCheckbox: Locator
  readonly classificationCheckbox: Locator
  readonly requiredDataErrorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.page.goto('/index.html')
    this.projectNameLabel = page.locator('label', { hasText: 'Project Name *' })
    this.projectNameErrorMessage = page.locator('Project Name is required')
    this.collectionDate = page.locator('h3', { hasText: 'Collection Date' })
    this.regularCalendar = page.locator("input[value='Regular Calendar(Weekend Considered)']")
    this.chinaCalendar = page.locator("input[value='Calendar with Chinese Holiday']")
    this.chooseDateButton = page.getByRole('button', { name: 'Choose date' })
    this.chooseDate = page.getByRole('gridcell', { name: `${day}`, exact: true })
    this.formDateLabel = page.getByLabel('From *')
    this.endDateLabel = page.getByLabel('To *')
    this.requireDataButton = page.getByRole('button', { name: 'Required Data' })
    this.velocityCheckbox = page.getByRole('option', { name: 'Velocity' }).getByRole('checkbox')
    this.classificationCheckbox = page.getByRole('option', { name: 'Classification' }).getByRole('checkbox')
    this.requiredDataErrorMessage = page.locator('Metrics is required')
  }

  async createNewProject() {
    await this.page.getByRole('button', { name: 'Create a new project' }).click()
  }

  async checkSteps() {
    STEPS.map(async (label) => {
      await expect(this.page.getByText(label, { exact: true })).toBeTruthy()
    })
  }

  async checkProjectName() {
    await this.projectNameLabel.fill('test Project Name')
    await this.projectNameLabel.fill('')
  }

  async switchCollectionDate() {
    await this.chinaCalendar.click()
    await expect(this.chinaCalendar).toBeChecked()
    await expect(this.regularCalendar).not.toBeChecked()

    await this.regularCalendar.click()
    await expect(this.chinaCalendar).not.toBeChecked()
    await expect(this.regularCalendar).toBeChecked()
  }

  async checkDateRangePicker() {
    await this.chooseDateButton.nth(0).click()
    await this.chooseDate.click()
    expect(this.page.getByText(`${month}/${day}/${year}`)).toBeTruthy()

    await this.chooseDateButton.nth(1).click()
    await this.chooseDate.click()
    expect(this.page.getByText(`${month}/${day}/${year}`)).toBeTruthy()
  }

  async checkDatePickerError() {
    await this.formDateLabel.click()
    await this.formDateLabel.fill(ERROR_DATE)

    expect(this.formDateLabel.evaluate((e) => window.getComputedStyle(e).getPropertyValue('color'))).not.toBe('black')

    await this.endDateLabel.click()
    await this.endDateLabel.fill(ERROR_DATE)

    expect(this.endDateLabel.evaluate((e) => window.getComputedStyle(e).getPropertyValue('color'))).not.toBe('black')
  }

  async checkMultipleRequireData() {
    await this.requireDataButton.click()
    await this.velocityCheckbox.check()
    await this.classificationCheckbox.check()
    await this.page.locator('.MuiBackdrop-root').click()

    await expect(this.requireDataButton).toHaveText('Velocity,Classification')

    await this.requireDataButton.click()
    await this.velocityCheckbox.uncheck()
    await this.classificationCheckbox.uncheck()
    await this.page.locator('.MuiBackdrop-root').click()

    expect(this.requiredDataErrorMessage).toBeTruthy()
  }

  async close() {
    await this.page.close()
  }
}
