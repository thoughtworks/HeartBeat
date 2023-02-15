import { Page } from '@playwright/test'
import BasePage from './BasePage'

export default class Home extends BasePage {
  constructor(page: Page) {
    super(page)
    super.navigate('/')
  }

  async createNewProject() {
    await this.page.getByRole('button', { name: 'Create a new project' }).click()
  }
}
