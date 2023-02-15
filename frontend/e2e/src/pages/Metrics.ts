import { Page, expect, Locator } from '@playwright/test'
import { STEPS } from '../fixtures'
import BasePage from './BasePage'

const today = new Date()
const year = today.getFullYear()
const day = today.getDate()
const month = today.getMonth() + 1

export default class Metrics extends BasePage {
  readonly projectNameErrorMessage: Locator
  readonly projectNameInput: Locator
  readonly collectionDate: Locator
  readonly regularCalendar: Locator
  readonly chinaCalendar: Locator
  readonly chooseDateButton: Locator
  readonly chooseDate: Locator
  readonly requireDataButton: Locator
  readonly velocityCheckbox: Locator
  readonly classificationCheckbox: Locator
  readonly requiredDataErrorMessage: Locator

  constructor(page: Page) {
    super(page)
    super.navigate('/metrics')
    this.projectNameInput = page.locator('label', { hasText: 'Project Name *' })
    this.projectNameErrorMessage = page.locator('Project Name is required')
    this.collectionDate = page.locator('h3', { hasText: 'Collection Date' })
    this.regularCalendar = page.locator("input[value='Regular Calendar(Weekend Considered)']")
    this.chinaCalendar = page.locator("input[value='Calendar with Chinese Holiday']")
    this.chooseDateButton = page.getByRole('button', { name: 'Choose date' })
    this.chooseDate = page.getByRole('gridcell', { name: `${day}`, exact: true })
    this.requireDataButton = page.getByRole('button', { name: 'Required Data' })
    this.velocityCheckbox = page.getByRole('option', { name: 'Velocity' }).getByRole('checkbox')
    this.classificationCheckbox = page.getByRole('option', { name: 'Classification' }).getByRole('checkbox')
    this.requiredDataErrorMessage = page.locator('Metrics is required')
  }

  async checkSteps() {
    STEPS.map(async (label) => {
      await expect(this.page.getByText(label, { exact: true })).toBeTruthy()
    })
  }

  async typeProjectName(projectName: string) {
    await this.projectNameInput.fill(projectName)
  }

  async selectRegularCalendar() {
    await this.regularCalendar.click()

    await expect(this.chinaCalendar).not.toBeChecked()
    await expect(this.regularCalendar).toBeChecked()
  }

  async selectDateRange() {
    await this.chooseDateButton.nth(0).click()
    await this.chooseDate.click()

    expect(this.page.getByText(`${month}/${day}/${year}`)).toBeTruthy()

    await this.chooseDateButton.nth(1).click()
    await this.chooseDate.click()

    expect(this.page.getByText(`${month}/${day}/${year}`)).toBeTruthy()
  }

  async selectVelocityAndClassificationInRequireData() {
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
}
