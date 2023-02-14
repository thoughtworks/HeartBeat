import { Page } from '@playwright/test'

export default class Home {
  page: Page
  constructor(page: Page) {
    this.page = page
    this.page.goto('/index.html')
  }

  async createNewProject() {
    await this.page.getByRole('button', { name: 'Create a new project' }).click()
  }

  async close() {
    await this.page.close()
  }
}
