import { expect, Locator, Page } from '@playwright/test';

export class MetricsStep {
  readonly page: Page;
  readonly stepTitle: Locator;
  readonly nextButton: Locator;
  readonly boardConfigurationTitle: Locator;
  readonly pipelineConfigurationTitle: Locator;
  readonly lastAssigneeRadioBox: Locator;
  readonly cycleTimeSection: Locator;
  readonly considerAsBlockCheckbox: Locator;
  readonly byColumnRadioBox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.stepTitle = page.getByText('Metrics', { exact: true });
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.boardConfigurationTitle = page.getByText('Board configuration');
    this.pipelineConfigurationTitle = page.getByText('Pipeline configuration');
    this.lastAssigneeRadioBox = page.getByLabel('Last assignee');
    this.cycleTimeSection = page.getByLabel('Cycle time settings section');
    this.considerAsBlockCheckbox = this.cycleTimeSection.getByRole('checkbox');
    this.byColumnRadioBox = this.cycleTimeSection.getByLabel('By Column');
  }

  async waitForShown() {
    await expect(this.stepTitle).toHaveClass(/Mui-active/);
  }

  async validateNextButtonNotClickable() {
    await expect(this.nextButton).toBeDisabled();
  }

  async checkBoardConfigurationVisible() {
    await expect(this.boardConfigurationTitle).toBeVisible();
  }

  async checkPipelineConfigurationVisible() {
    await expect(this.pipelineConfigurationTitle).toBeVisible();
  }

  async checkLastAssigneeCrewFilterChecked() {
    await expect(this.lastAssigneeRadioBox).toBeVisible();
    await expect(this.lastAssigneeRadioBox).toBeChecked();
  }

  async checkCycleTimeConsiderCheckboxChecked() {
    await expect(this.considerAsBlockCheckbox).toBeChecked();
  }

  async checkCycleTimeSettingIsByColumn() {
    await expect(this.byColumnRadioBox).toBeChecked();
  }
}
