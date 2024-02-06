import { expect, Locator, Page } from '@playwright/test';
export class HomePage {
  readonly page: Page;
  readonly importProjectFromFileButton: Locator;
  readonly createANewProjectButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.importProjectFromFileButton = page.getByRole('button', { name: 'Import project from file' });
    this.createANewProjectButton = page.getByRole('button', { name: 'Create a new project' });
  }

  async goto() {
    await this.page.goto('/');

    await expect(this.importProjectFromFileButton).toBeVisible();
    await expect(this.createANewProjectButton).toBeVisible();
  }

  async createANewProject() {
    await this.createANewProjectButton.click();
  }
}
