import { Page, expect, Locator } from '@playwright/test'
import { STEPS } from '../fixtures'

export default class Metrics {
  page: Page
  readonly errorMessage: Locator
  readonly projectNameLabel: Locator
  readonly collectionDate: Locator
  readonly regularCalendar: Locator
  readonly chinaCalendar: Locator

  constructor(page: Page) {
    this.page = page
    this.page.goto('/index.html')
    this.projectNameLabel = page.locator('label', { hasText: 'Project Name *' })
    this.errorMessage = page.locator('Project Name is required')
    this.collectionDate = page.locator('h3', { hasText: 'Collection Date' })
    this.regularCalendar = page.locator("input[value='Regular Calendar(Weekend Considered)']")
    this.chinaCalendar = page.locator("input[value='Calendar with Chinese Holiday']")
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

  async close() {
    await this.page.close()
  }
}
