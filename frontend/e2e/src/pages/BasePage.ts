import { Page } from '@playwright/test'

export default class BasePage {
  page: Page
  constructor(page: Page) {
    this.page = page
  }

  async navigate(path) {
    await this.page.goto(path)
  }

  async close() {
    await this.page.close()
  }
}
