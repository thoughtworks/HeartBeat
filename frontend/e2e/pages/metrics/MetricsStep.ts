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
  readonly distinguishedBySelect: Locator;
  readonly loadings: Locator;
  readonly cycleTimeSelectForTODOSelect: Locator;
  readonly cycleTimeSelectForDoingSelect: Locator;
  readonly cycleTimeSelectForBlockedSelect: Locator;
  readonly cycleTimeSelectForReviewSelect: Locator;
  readonly cycleTimeSelectForREADYSelect: Locator;
  readonly cycleTimeSelectForTestingSelect: Locator;
  readonly cycleTimeSelectForDoneSelect: Locator;
  readonly organizationSelect: Locator;
  readonly pipelineNameSelect: Locator;
  readonly stepSelect: Locator;
  readonly branchSelect: Locator;
  readonly branchSelectIndicator: Locator;

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
    this.distinguishedBySelect = page.getByLabel('Distinguished By *');
    this.loadings = this.page.getByTestId('loading');
    this.cycleTimeSelectForTODOSelect = page.getByLabel('Cycle time select for TODO').getByLabel('Open');
    this.cycleTimeSelectForDoingSelect = page.getByLabel('Cycle time select for Doing').getByLabel('Open');
    this.cycleTimeSelectForBlockedSelect = page.getByLabel('Cycle time select for Blocked').getByLabel('Open');
    this.cycleTimeSelectForReviewSelect = page.getByLabel('Cycle time select for Review').getByLabel('Open');
    this.cycleTimeSelectForREADYSelect = page.getByLabel('Cycle time select for READY').getByLabel('Open');
    this.cycleTimeSelectForTestingSelect = page.getByLabel('Cycle time select for Testing').getByLabel('Open');
    this.cycleTimeSelectForDoneSelect = page.getByLabel('Cycle time select for Done').getByLabel('Open');
    this.organizationSelect = page.getByLabel('Organization *');
    this.pipelineNameSelect = page.getByLabel('Pipeline Name *');
    this.stepSelect = page.getByLabel('Step *');
    this.branchSelect = page.getByLabel('Branches *');
    this.branchSelectIndicator = page.getByRole('progressbar');
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
  async waitForHiddenLoading() {
    await expect(this.loadings.first()).toBeHidden();
  }
  async selectHeartbeatState(
    todoOption: string,
    doingOption: string,
    blockOption: string,
    reviewOption: string,
    forReadyOption: string,
    testingOption: string,
    doneOption: string,
  ) {
    await this.cycleTimeSelectForTODOSelect.click();
    await this.page.getByRole('option', { name: todoOption }).click();

    await this.cycleTimeSelectForDoingSelect.click();
    await this.page.getByRole('option', { name: doingOption }).click();

    await this.cycleTimeSelectForBlockedSelect.click();
    await this.page.getByRole('option', { name: blockOption }).click();

    await this.cycleTimeSelectForReviewSelect.click();
    await this.page.getByRole('option', { name: reviewOption }).click();

    await this.cycleTimeSelectForREADYSelect.click();
    await this.page.getByRole('option', { name: forReadyOption }).click();

    await this.cycleTimeSelectForTestingSelect.click();
    await this.page.getByRole('option', { name: testingOption, exact: true }).click();

    await this.cycleTimeSelectForDoneSelect.click();
    await this.page.getByRole('option', { name: doneOption }).click();
  }

  async selectDistinguishedByOptions() {
    await this.distinguishedBySelect.click();
    await this.page.getByRole('option', { name: 'All' }).click();
    await this.page.getByRole('option', { name: 'Design' }).click();
  }

  async selectPipelineSetting() {
    await this.selectOrganization('Thoughtworks-Heartbeat');
    await this.selectPipelineName('Heartbeat');
    await this.selectStep('Deploy prod');
    await this.selectBranch('main');
  }

  async selectOrganization(orgName: string) {
    await expect(this.loadings).toBeHidden();
    await this.organizationSelect.click();
    await this.page.getByRole('option', { name: orgName }).click();
  }

  async selectPipelineName(pipelineName: string) {
    await this.pipelineNameSelect.click();
    await this.page.getByRole('option', { name: pipelineName }).click();
    await expect(this.loadings).toBeHidden();
  }

  async selectStep(doneStep: string) {
    await this.stepSelect.click();
    await this.page.getByRole('option', { name: doneStep }).click();
    await expect(this.page.getByTestId('loading')).toBeHidden();
    await expect(this.page.getByTestId('loading')).toBeHidden();
  }

  async selectBranch(branchName: string) {
    await this.branchSelect.click();
    await this.page.getByRole('combobox', { name: 'Branches' }).fill('main');
    await this.page.getByRole('option', { name: branchName }).getByRole('checkbox').check();
    // await expect(this.page.getByTestId('CancelIcon')).toBeVisible();
    await expect(this.branchSelectIndicator).toBeHidden();
  }

  async goToReportPage() {
    await this.page.getByRole('button', { name: 'Next' }).click();
  }
}
