import { Page, expect } from '@playwright/test'
import { STEPS } from '../fixtures'

export default class Metrics {
  page: Page
  constructor(page: Page) {
    this.page = page
    this.page.goto('/index.html')
  }

  async createNewProject() {
    await this.page.getByRole('button', { name: 'Create a new project' }).click()
  }

  async checkSteps() {
    STEPS.map(async (label) => {
      await expect(this.page.getByText(label, { exact: true })).toBeTruthy()
    })
  }

  async close() {
    await this.page.close()
  }
}
