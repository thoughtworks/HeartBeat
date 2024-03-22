import { expect, Locator, Page } from '@playwright/test';
import path from 'path';
export class HomePage {
  readonly page: Page;
  readonly importProjectFromFileButton: Locator;
  readonly createANewProjectButton: Locator;
  readonly importProjectFromFileInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.importProjectFromFileButton = page.getByRole('button', { name: 'Import project from file' });
    this.importProjectFromFileInput = page.getByTestId('testInput');
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
  async importProjectFromFile(jsonPath: string) {
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.importProjectFromFileButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, jsonPath));
  }

  async waitForShown() {
    await expect(await this.importProjectFromFileButton).toBeVisible();
  }
}
