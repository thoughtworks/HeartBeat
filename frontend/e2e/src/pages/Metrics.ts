import { Page, expect, Locator } from '@playwright/test'
import { STEPS } from '../fixtures'

export default class Metrics {
  page: Page
  readonly errorMessage: Locator
  readonly projectNameLabel: Locator

  constructor(page: Page) {
    this.page = page
    this.page.goto('/index.html')
    this.projectNameLabel = page.locator('label', { hasText: 'Project Name *' })
    this.errorMessage = page.locator('Project Name is required')
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

  async close() {
    await this.page.close()
  }
}
