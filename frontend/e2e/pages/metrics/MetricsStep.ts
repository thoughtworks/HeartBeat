import { config as metricsStepData } from '../../fixtures/createNew/metricsStep';
import { METRICS_STEP_SAVING_FILENAME } from '../../fixtures';
import { downloadFileAndCheck } from '../../utils/download';
import { expect, Locator, Page } from '@playwright/test';
import { size } from 'lodash';

export class MetricsStep {
  readonly page: Page;
  readonly stepTitle: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;
  readonly boardConfigurationTitle: Locator;
  readonly pipelineConfigurationTitle: Locator;
  readonly loadings: Locator;
  readonly saveAsButton: Locator;

  readonly boardCrewSettingsLabel: Locator;
  readonly boardCrewSettingChipsContainer: Locator;
  readonly boardCrewSettingSelectedChips: Locator;
  readonly boardLastAssigneeRadioBox: Locator;
  readonly boardHistoricalAssigneeRadioBox: Locator;
  readonly boardCycleTimeSection: Locator;
  readonly boardByColumnRadioBox: Locator;
  readonly boardByStatusRadioBox: Locator;
  readonly boardCycleTimeSelectForTODO: Locator;
  readonly boardCycleTimeSelectForDoing: Locator;
  readonly boardCycleTimeSelectForBlocked: Locator;
  readonly boardCycleTimeSelectForReview: Locator;
  readonly boardCycleTimeSelectForREADY: Locator;
  readonly boardCycleTimeSelectForTesting: Locator;
  readonly boardCycleTimeSelectForDone: Locator;
  readonly boardCycleTimeInputForTODO: Locator;
  readonly boardCycleTimeInputForDoing: Locator;
  readonly boardCycleTimeInputForBlocked: Locator;
  readonly boardCycleTimeInputForReview: Locator;
  readonly boardCycleTimeInputForREADY: Locator;
  readonly boardCycleTimeInputForTesting: Locator;
  readonly boardCycleTimeInputForDone: Locator;
  readonly boardConsiderAsBlockCheckbox: Locator;
  readonly boardClassificationLabel: Locator;
  readonly boardClassificationChipsContainer: Locator;
  readonly boardClassificationSelectedChips: Locator;

  readonly pipelineSettingSection: Locator;
  readonly pipelineOrganizationSelect: Locator;
  readonly pipelineNameSelect: Locator;
  readonly pipelineStepSelect: Locator;
  readonly pipelineBranchSelect: Locator;
  readonly pipelineDefaultBranchSelectContainer: Locator;
  readonly pipelineDefaultSelectedBranchChips: Locator;
  readonly pipelineBranchSelectIndicator: Locator;
  readonly pipelineBranchesErrorMessage: Locator;
  readonly pipelineCrewSettingsLabel: Locator;
  readonly pipelineCrewSettingChipsContainer: Locator;
  readonly pipelineCrewSettingSelectedChips: Locator;
  readonly homeIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.stepTitle = page.getByText('Metrics', { exact: true });
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.previousButton = page.getByRole('button', { name: 'Previous' });
    this.saveAsButton = page.getByRole('button', { name: 'Save' });
    this.boardConfigurationTitle = page.getByText('Board configuration');
    this.pipelineConfigurationTitle = page.getByText('Pipeline configuration');
    this.loadings = page.getByTestId('loading');

    this.boardCrewSettingsLabel = page.getByLabel('Included Crews *');
    this.boardCrewSettingChipsContainer = page.getByLabel('Included Crews multiple select').first();
    this.boardCrewSettingSelectedChips = this.boardCrewSettingChipsContainer
      .getByRole('button')
      .filter({ hasText: /.+/ });
    this.boardLastAssigneeRadioBox = page.getByLabel('Last assignee');
    this.boardHistoricalAssigneeRadioBox = page.getByLabel('Historical assignee');
    this.boardCycleTimeSection = page.getByLabel('Cycle time settings section');
    this.boardByColumnRadioBox = this.boardCycleTimeSection.getByLabel('By Column');
    this.boardByStatusRadioBox = this.boardCycleTimeSection.getByLabel('By Status');
    this.boardCycleTimeSelectForTODO = this.boardCycleTimeSection
      .getByLabel('Cycle time select for TODO')
      .getByLabel('Open');
    this.boardCycleTimeSelectForDoing = this.boardCycleTimeSection
      .getByLabel('Cycle time select for Doing')
      .getByLabel('Open');
    this.boardCycleTimeSelectForBlocked = this.boardCycleTimeSection
      .getByLabel('Cycle time select for Blocked')
      .getByLabel('Open');
    this.boardCycleTimeSelectForReview = this.boardCycleTimeSection
      .getByLabel('Cycle time select for Review')
      .getByLabel('Open');
    this.boardCycleTimeSelectForREADY = this.boardCycleTimeSection
      .getByLabel('Cycle time select for READY FOR TESTING')
      .getByLabel('Open');
    this.boardCycleTimeSelectForTesting = this.boardCycleTimeSection
      .getByLabel('Cycle time select for Testing')
      .getByLabel('Open');
    this.boardCycleTimeSelectForDone = this.boardCycleTimeSection
      .getByLabel('Cycle time select for Done')
      .getByLabel('Open');
    this.boardCycleTimeInputForTODO = this.boardCycleTimeSection
      .getByLabel('Cycle time select for TODO')
      .getByRole('combobox');
    this.boardCycleTimeInputForDoing = this.boardCycleTimeSection
      .getByLabel('Cycle time select for Doing')
      .getByRole('combobox');
    this.boardCycleTimeInputForBlocked = this.boardCycleTimeSection
      .getByLabel('Cycle time select for Blocked')
      .getByRole('combobox');
    this.boardCycleTimeInputForReview = this.boardCycleTimeSection
      .getByLabel('Cycle time select for Review')
      .getByRole('combobox');
    this.boardCycleTimeInputForREADY = this.boardCycleTimeSection
      .getByLabel('Cycle time select for WAIT FOR TEST')
      .getByRole('combobox');
    this.boardCycleTimeInputForTesting = this.boardCycleTimeSection
      .getByLabel('Cycle time select for Testing')
      .getByRole('combobox');
    this.boardCycleTimeInputForDone = this.boardCycleTimeSection
      .getByLabel('Cycle time select for Done')
      .getByRole('combobox');
    this.boardConsiderAsBlockCheckbox = this.boardCycleTimeSection.getByRole('checkbox');
    this.boardClassificationLabel = page.getByLabel('Distinguished By *');
    this.boardClassificationChipsContainer = page.getByLabel('Classification Setting AutoComplete');
    this.boardClassificationSelectedChips = this.boardClassificationChipsContainer
      .getByRole('button')
      .filter({ hasText: /.+/ });

    this.pipelineSettingSection = page.getByLabel('Pipeline Configuration Section');
    this.pipelineOrganizationSelect = this.pipelineSettingSection.getByLabel('Organization *');
    this.pipelineNameSelect = this.pipelineSettingSection.getByLabel('Pipeline Name *');
    this.pipelineStepSelect = this.pipelineSettingSection.getByLabel('Step *');
    this.pipelineBranchSelect = this.pipelineSettingSection.getByLabel('Branches *');
    this.pipelineDefaultBranchSelectContainer = this.pipelineSettingSection.getByLabel('Pipeline Branch AutoComplete');
    this.pipelineDefaultSelectedBranchChips = this.pipelineDefaultBranchSelectContainer
      .getByRole('button')
      .filter({ hasText: /.+/ });
    this.pipelineBranchesErrorMessage = page.getByText('The codebase branch marked in red is invalid!');
    this.pipelineBranchSelectIndicator = page.getByRole('progressbar');
    this.pipelineCrewSettingsLabel = this.pipelineSettingSection
      .getByLabel('Included Crews multiple select')
      .getByLabel('Included Crews');
    this.pipelineCrewSettingChipsContainer = this.pipelineSettingSection
      .getByLabel('Included Crews multiple select')
      .first();
    this.pipelineCrewSettingSelectedChips = this.pipelineCrewSettingChipsContainer
      .getByRole('button')
      .filter({ hasText: /.+/ });
    this.homeIcon = page.getByLabel('Home');
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
    await expect(this.boardLastAssigneeRadioBox).toBeVisible();
    await expect(this.boardLastAssigneeRadioBox).toBeChecked();
  }

  async checkClassificationText() {
    await expect(this.boardLastAssigneeRadioBox).toBeVisible();
    await expect(this.boardLastAssigneeRadioBox).toBeChecked();
  }

  async checkCycleTimeConsiderCheckboxChecked() {
    await expect(this.boardConsiderAsBlockCheckbox).toBeChecked();
  }

  async checkCycleTimeConsiderAsBlockUnchecked() {
    await expect(this.boardConsiderAsBlockCheckbox).not.toBeChecked();
  }

  async checkCycleTimeSettingIsByColumn() {
    await expect(this.boardByColumnRadioBox).toBeChecked();
  }

  async selectCrews(crews: string[]) {
    await this.boardCrewSettingsLabel.click();
    const options = this.page.getByRole('option');
    for (const option of (await options.all()).slice(1)) {
      const optionName = (await option.textContent()) as string;
      const isOptionSelected = (await option.getAttribute('aria-selected')) === 'true';
      if (crews.includes(optionName)) {
        if (!isOptionSelected) {
          await option.click();
        }
      } else {
        if (isOptionSelected) {
          await option.click();
        }
      }
    }

    await this.checkCrews(crews);
    await this.page.keyboard.press('Escape');
  }

  async checkCrews(crews: string[]) {
    await expect(this.boardCrewSettingSelectedChips).toHaveCount(crews.length);
    crews.forEach(async (crew) => {
      await expect(this.boardCrewSettingChipsContainer.getByRole('button', { name: crew })).toBeVisible();
    });
  }

  async checkCrewsAreChanged(crews: string[]) {
    await this.boardCrewSettingsLabel.click();
    await expect(this.boardCrewSettingSelectedChips).toHaveCount(crews.length);
    crews.forEach(async (crew) => {
      await expect(this.boardCrewSettingChipsContainer.getByRole('button', { name: crew })).toBeVisible();
    });
    await this.page.keyboard.press('Escape');
  }

  async selectClassifications(classificationKeys: string[]) {
    await this.boardClassificationLabel.click();
    const options = this.page.getByRole('option');
    for (const option of (await options.all()).slice(1)) {
      const optionKey = (await option.getAttribute('data-testid')) as string;
      const isOptionSelected = (await option.getAttribute('aria-selected')) === 'true';
      if (classificationKeys.includes(optionKey)) {
        if (!isOptionSelected) {
          await option.click();
        }
      } else {
        if (isOptionSelected) {
          await option.click();
        }
      }
    }

    await this.checkClassifications(classificationKeys);
    await this.page.keyboard.press('Escape');
  }

  async checkClassifications(classificationKeys: string[]) {
    await expect(this.boardClassificationSelectedChips).toHaveCount(classificationKeys.length);
  }

  async waitForHiddenLoading() {
    await expect(this.loadings.first()).toBeHidden();
  }

  async selectHistoricalAssigneeCrewFilter() {
    await this.boardHistoricalAssigneeRadioBox.click();
  }

  async selectCycleTimeSettingsType(by: string) {
    if (by === 'byColumn') {
      await this.boardByColumnRadioBox.click();
      await this.checkBoardByColumnRadioBoxChecked();
    } else {
      await this.boardByStatusRadioBox.click();
      await this.checkBoardByStatusRadioBoxChecked();
    }
  }

  async checkBoardByColumnRadioBoxChecked() {
    await expect(this.boardByColumnRadioBox).toBeChecked();
  }

  async checkBoardByStatusRadioBoxChecked() {
    await expect(this.boardByStatusRadioBox).toBeChecked();
  }

  async checkModifiedHeartbeatState([todoOption, doingOption, blockOption, testingOption, doneOption]: string[]) {
    await expect(this.boardCycleTimeInputForTODO).toHaveAttribute('value', todoOption);
    await expect(this.boardCycleTimeInputForDoing).toHaveAttribute('value', doingOption);
    await expect(this.boardCycleTimeInputForBlocked).toHaveAttribute('value', blockOption);
    await expect(this.boardCycleTimeInputForReview).toHaveAttribute('value', '----');
    await expect(this.boardCycleTimeInputForREADY).toHaveAttribute('value', '----');
    await expect(this.boardCycleTimeInputForTesting).toHaveAttribute('value', testingOption);
    await expect(this.boardCycleTimeInputForDone).toHaveAttribute('value', doneOption);
  }

  async selectHeartbeatState([
    todoOption,
    doingOption,
    blockOption,
    reviewOption,
    forReadyOption,
    testingOption,
    doneOption,
  ]: string[]) {
    await this.boardCycleTimeSelectForTODO.click();
    await this.page.getByRole('option', { name: todoOption }).click();

    await this.boardCycleTimeSelectForDoing.click();
    await this.page.getByRole('option', { name: doingOption }).click();

    await this.boardCycleTimeSelectForBlocked.click();
    await this.page.getByRole('option', { name: blockOption }).click();

    await this.boardCycleTimeSelectForReview.click();
    await this.page.getByRole('option', { name: reviewOption }).click();

    await this.boardCycleTimeSelectForREADY.click();
    await this.page.getByRole('option', { name: forReadyOption }).click();

    await this.boardCycleTimeSelectForTesting.click();
    await this.page.getByRole('option', { name: testingOption, exact: true }).click();

    await this.boardCycleTimeSelectForDone.click();
    await this.page.getByRole('option', { name: doneOption }).click();
  }

  async checkHeartbeatStateIsSet([
    todoOption,
    doingOption,
    blockOption,
    reviewOption,
    forReadyOption,
    testingOption,
    doneOption,
  ]: string[]) {
    await expect(this.boardCycleTimeSection.getByLabel('Cycle time select for TODO').getByRole('combobox')).toHaveValue(
      todoOption,
    );
    await expect(
      this.boardCycleTimeSection.getByLabel('Cycle time select for Doing').getByRole('combobox'),
    ).toHaveValue(doingOption);
    await expect(
      this.boardCycleTimeSection.getByLabel('Cycle time select for Blocked').getByRole('combobox'),
    ).toHaveValue(blockOption);
    await expect(
      this.boardCycleTimeSection.getByLabel('Cycle time select for Review').getByRole('combobox'),
    ).toHaveValue(reviewOption);
    await expect(
      this.boardCycleTimeSection.getByLabel('Cycle time select for READY FOR TESTING').getByRole('combobox'),
    ).toHaveValue(forReadyOption);
    await expect(
      this.boardCycleTimeSection.getByLabel('Cycle time select for Testing').getByRole('combobox'),
    ).toHaveValue(testingOption);
    await expect(this.boardCycleTimeSection.getByLabel('Cycle time select for Done').getByRole('combobox')).toHaveValue(
      doneOption,
    );
  }

  async selectModifiedHeartbeatState([todoOption, doingOption, blockOption, testingOption, doneOption]: string[]) {
    await this.boardCycleTimeSelectForTODO.click();
    await this.page.getByRole('option', { name: todoOption }).click();

    await this.boardCycleTimeSelectForDoing.click();
    await this.page.getByRole('option', { name: doingOption }).click();

    await this.boardCycleTimeSelectForBlocked.click();
    await this.page.getByRole('option', { name: blockOption }).click();

    await this.boardCycleTimeSelectForTesting.click();
    await this.page.getByRole('option', { name: testingOption, exact: true }).click();

    await this.boardCycleTimeSelectForDone.click();
    await this.page.getByRole('option', { name: doneOption }).click();
  }

  async selectCycleTimeConsiderAsBlockCheckbox() {
    await this.boardConsiderAsBlockCheckbox.click();
  }

  async selectOrganization(orgName: string) {
    await expect(this.loadings).toBeHidden();
    await this.pipelineOrganizationSelect.click();
    const targetOrganizationOption = this.page.getByRole('option', { name: orgName });
    await expect(targetOrganizationOption).toBeVisible();
    await targetOrganizationOption.click();
  }

  async selectPipelineName(pipelineName: string) {
    await this.pipelineNameSelect.click();
    const targetNameOption = this.page.getByRole('option', { name: pipelineName });
    await expect(targetNameOption).toBeVisible();
    await targetNameOption.click();
    await expect(this.loadings).toBeHidden();
  }

  async selectStep(doneStepMaybeWithEmoji: string) {
    await this.pipelineStepSelect.click();
    const emojiRegExp = /:.+:/;
    const emoji = doneStepMaybeWithEmoji.match(emojiRegExp);
    let stepName = '';
    if (emoji === null) {
      stepName = doneStepMaybeWithEmoji;
    } else {
      const splitor = emoji as unknown as string;
      stepName = doneStepMaybeWithEmoji.split(splitor)[1];
    }
    const targetStepOption = this.page.getByRole('option', { name: stepName });
    await expect(targetStepOption).toBeVisible();
    await targetStepOption.click();
    await expect(this.loadings).toBeHidden();
  }

  async selectBranch(branches: string[]) {
    await this.pipelineBranchSelect.click();
    for (const branchName of branches) {
      await this.page.getByRole('combobox', { name: 'Branches' }).fill(branchName);
      await this.page.getByRole('option', { name: branchName }).getByRole('checkbox').check();
      await expect(this.pipelineBranchSelectIndicator).toBeHidden();
    }
    await expect(this.pipelineDefaultSelectedBranchChips).toHaveCount(branches.length);
    await expect(this.pipelineBranchesErrorMessage).not.toBeVisible();
    await this.page.keyboard.press('Escape');
  }

  async checkBranch(branches: string[]) {
    await expect(this.pipelineDefaultSelectedBranchChips).toHaveCount(branches.length);
  }

  async selectDefaultGivenPipelineSetting(pipelineSettings: typeof metricsStepData.deployment) {
    const firstPipelineConfig = pipelineSettings[0];

    await this.selectOrganization(firstPipelineConfig.organization);
    await this.selectPipelineName(firstPipelineConfig.pipelineName);
    await this.selectStep(firstPipelineConfig.step);
    await this.selectBranch(firstPipelineConfig.branches);
  }

  async selectGivenPipelineCrews(crews: string[]) {
    await this.pipelineCrewSettingsLabel.click();
    const options = this.page.getByRole('option');
    for (const option of (await options.all()).slice(1)) {
      const optionName = (await option.textContent()) as string;
      const isOptionSelected = (await option.getAttribute('aria-selected')) === 'true';
      if (crews.includes(optionName)) {
        if (!isOptionSelected) {
          await option.click();
        }
      } else {
        if (isOptionSelected) {
          await option.click();
        }
      }
    }

    await this.checkPipelineCrews(crews);
    await this.page.keyboard.press('Escape');
  }

  async checkPipelineSetting(pipelineSettings: typeof metricsStepData.deployment) {
    const firstPipelineConfig = pipelineSettings[0];

    await expect(this.pipelineOrganizationSelect).toHaveAttribute('value', firstPipelineConfig.organization);
    await expect(this.pipelineNameSelect).toHaveAttribute('value', firstPipelineConfig.pipelineName);
    await expect(this.pipelineStepSelect).toHaveAttribute('value', firstPipelineConfig.step.replace(/:[^:\s]+: /, ''));
  }

  async checkPipelineCrews(crews: string[]) {
    await crews.forEach(async (crew) => {
      await expect(this.pipelineCrewSettingChipsContainer.getByRole('button', { name: crew })).toBeVisible();
    });
  }

  validateSavedJsonCriticalFieldsEqualsToFixture(file: typeof metricsStepData, fixture: typeof metricsStepData) {
    const fileCopy = JSON.parse(JSON.stringify(file));
    const fixtureCopy = JSON.parse(JSON.stringify(fixture));

    /**
     * Belows are tuples comparison
     *
     * Saved json array elements might present different order with the fixture,
     * Since the UI interaction is unpredictable(select and unselect options of multi-autocomplete).
     * However, if the elements are the same(regardless of order), we say, the saved json is correct.
     */
    const savedMetrics = fileCopy.metrics;
    const fixtureMetrics = fixtureCopy.metrics;
    expect(savedMetrics).toEqual(expect.arrayContaining(fixtureMetrics));
    expect(fixtureMetrics).toEqual(expect.arrayContaining(savedMetrics));

    const savedCrews = fileCopy.crews;
    const fixtureCrews = fixtureCopy.crews;
    expect(savedCrews).toEqual(expect.arrayContaining(fixtureCrews));
    expect(fixtureCrews).toEqual(expect.arrayContaining(savedCrews));

    const savedClassification = fileCopy.classification;
    const fixtureClassification = fixtureCopy.classification;
    expect(savedClassification).toEqual(expect.arrayContaining(fixtureClassification));
    expect(fixtureClassification).toEqual(expect.arrayContaining(savedClassification));

    /**
     * Then compare regular fields
     */
    delete fileCopy.metrics;
    delete fileCopy.crews;
    delete fileCopy.classification;
    delete fileCopy.doneStatus;
    delete fixtureCopy.metrics;
    delete fixtureCopy.crews;
    delete fixtureCopy.classification;
    delete fixtureCopy.doneStatus;
    expect(fileCopy).toEqual(fixtureCopy);
  }

  async saveConfigStepAsJSONThenVerifyDownloadFile(json: typeof metricsStepData) {
    return downloadFileAndCheck(this.page, this.saveAsButton, METRICS_STEP_SAVING_FILENAME, async (fileDataString) => {
      const fileData = JSON.parse(fileDataString);
      this.validateSavedJsonCriticalFieldsEqualsToFixture(fileData, json);
    });
  }

  async goToPreviousStep() {
    await this.previousButton.click();
  }

  async goToReportPage() {
    await this.page.getByRole('button', { name: 'Next' }).click();
  }

  async clickHomeIconThenBackToHomepage() {
    await this.homeIcon.click();
    await expect(this.page).toHaveURL(/\//);
  }

  async checkPipelineConfigurationAreChanged(pipelineSettings: typeof metricsStepData.deployment) {
    const firstPipelineConfig = pipelineSettings[0];

    await expect(this.pipelineOrganizationSelect).toHaveValue(firstPipelineConfig.organization);
    await expect(this.pipelineNameSelect).toHaveValue(firstPipelineConfig.pipelineName);
    await expect(this.pipelineDefaultSelectedBranchChips).toHaveCount(size(firstPipelineConfig.branches));
  }
}
