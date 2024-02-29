import { importMultipleDoneProjectFromFile } from '../fixtures/importFile/multiple-done-config-file';
import { importFlagAsBlockFile } from '../fixtures/importFile/add-flag-as-block-config-file';
import { importProjectFromFile } from '../fixtures/hb-e2e-for-importing-file';
import { expect, Locator, Page } from '@playwright/test';
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
  async importProjectFromFile() {
    await this.importProjectFromFileInput.setInputFiles({
      name: 'hb-e2e-test',
      mimeType: 'text/plain',
      buffer: Buffer.from(JSON.stringify(importProjectFromFile)),
    });
  }

  async importMultipleDoneProjectFromFile() {
    await this.importProjectFromFileInput.setInputFiles({
      name: 'hb-e2e-test',
      mimeType: 'text/plain',
      buffer: Buffer.from(JSON.stringify(importMultipleDoneProjectFromFile)),
    });
  }

  async importFlagAsBlockProjectFromFile() {
    await this.importProjectFromFileInput.setInputFiles({
      name: 'hb-e2e-test',
      mimeType: 'text/plain',
      buffer: Buffer.from(JSON.stringify(importFlagAsBlockFile)),
    });
  }

  async waitForShown() {
    await expect(await this.importProjectFromFileButton).toBeVisible();
  }
}
