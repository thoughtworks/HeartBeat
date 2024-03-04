import { config as configStepData } from '../../fixtures/createNew/configStep';
import { METRICS_STEP_SAVING_FILENAME } from '../../fixtures';
import { downloadFileAndCheck } from '../../utils/download';
import { expect, Locator, Page } from '@playwright/test';
import { Dayjs } from 'dayjs';

interface IBoardData {
  boardId: string;
  email: string;
  site: string;
  token: string;
}

interface IPipelineToolData {
  token: string;
}

interface ISourceControlData {
  token: string;
}

export class ConfigStep {
  readonly page: Page;
  readonly stepTitle: Locator;
  readonly projectNameInput: Locator;
  readonly regularCalendar: Locator;
  readonly chineseCalendar: Locator;
  readonly fromDateInput: Locator;
  readonly fromDateInputButton: Locator;
  readonly fromDateInputValueSelect: (fromDay: Dayjs) => Locator;
  readonly toDateInput: Locator;
  readonly toDateInputButton: Locator;
  readonly toDateInputValueSelect: (toDay: Dayjs) => Locator;
  readonly requireDataButton: Locator;
  readonly velocityCheckbox: Locator;
  readonly classificationCheckbox: Locator;
  readonly requiredDataErrorMessage: Locator;
  readonly previousButton: Locator;
  readonly nextButton: Locator;
  readonly previousModal: Locator;
  readonly previousModalYesButton: Locator;
  readonly previousModalCancelButton: Locator;
  readonly requiredMetricsLabel: Locator;
  readonly requiredMetricsAllOption: Locator;
  readonly boardContainer: Locator;
  readonly boardTypeSelect: Locator;
  readonly boardIdInput: Locator;
  readonly boardEmailInput: Locator;
  readonly boardSiteInput: Locator;
  readonly boardTokenInput: Locator;
  readonly boardVerifyButton: Locator;
  readonly boardVerifiedButton: Locator;
  readonly boardResetButton: Locator;
  readonly pipelineToolContainer: Locator;
  readonly pipelineToolTypeSelect: Locator;
  readonly pipelineToolTypeBuildKiteOption: Locator;
  readonly pipelineToolTokenInput: Locator;
  readonly pipelineToolVerifyButton: Locator;
  readonly pipelineToolVerifiedButton: Locator;
  readonly pipelineToolResetButton: Locator;
  readonly sourceControlContainer: Locator;
  readonly sourceControlTypeSelect: Locator;
  readonly sourceControlTokenInput: Locator;
  readonly sourceControlVerifyButton: Locator;
  readonly sourceControlVerifiedButton: Locator;
  readonly sourceControlResetButton: Locator;
  readonly saveAsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.stepTitle = page.getByText('Config');
    this.projectNameInput = page.getByLabel('Project name *');
    this.regularCalendar = page.getByText('Regular Calendar(Weekend');
    this.chineseCalendar = page.getByText('Calendar with Chinese Holiday');
    this.fromDateInput = page.getByRole('textbox', { name: 'From *' });
    this.fromDateInputButton = page
      .locator('div')
      .filter({ hasText: /^From \*$/ })
      .getByRole('button', { name: 'Choose date' });
    this.fromDateInputValueSelect = (fromDay: Dayjs) =>
      page.getByRole('dialog', { name: 'From *' }).getByRole('gridcell', { name: `${fromDay.date()}` });
    this.toDateInput = page.getByRole('textbox', { name: 'To *' });
    this.toDateInputButton = page
      .locator('div')
      .filter({ hasText: /^To \*$/ })
      .getByRole('button', { name: 'Choose date' });
    this.toDateInputValueSelect = (toDay: Dayjs) =>
      page.getByRole('dialog', { name: 'To *' }).getByRole('gridcell', { name: `${toDay.date()}` });

    this.requireDataButton = page.getByRole('button', { name: 'Required Data' });
    this.velocityCheckbox = page.getByRole('option', { name: 'Velocity' }).getByRole('checkbox');
    this.classificationCheckbox = page.getByRole('option', { name: 'Classification' }).getByRole('checkbox');
    this.requiredDataErrorMessage = page.getByText('Metrics is required');
    this.previousButton = page.getByRole('button', { name: 'Previous' });
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.previousModal = page.getByText('All the filled data will be cleared. Continue to Home page?');
    this.previousModalYesButton = page.getByRole('button', { name: 'Yes' });
    this.previousModalCancelButton = page.getByRole('button', { name: 'Cancel' });

    this.requiredMetricsLabel = page.getByLabel('Required metrics *');
    this.requiredMetricsAllOption = page.getByRole('option', { name: 'All' });

    this.boardContainer = page.getByLabel('Board Config');
    this.boardTypeSelect = this.boardContainer.getByLabel('Board *');
    this.boardIdInput = this.boardContainer.getByLabel('Board Id *');
    this.boardEmailInput = this.boardContainer.getByLabel('Email *');
    this.boardSiteInput = this.boardContainer.getByLabel('Site *');
    this.boardTokenInput = this.boardContainer.getByLabel('Token *');
    this.boardVerifyButton = this.boardContainer.getByRole('button', { name: 'Verify' });
    this.boardVerifiedButton = this.boardContainer.getByRole('button', { name: 'Verified' });
    this.boardResetButton = this.boardContainer.getByRole('button', { name: 'Reset' });

    this.pipelineToolContainer = page.getByLabel('Pipeline Tool Config');
    this.pipelineToolTypeSelect = this.pipelineToolContainer.getByLabel('Pipeline Tool *');
    this.pipelineToolTypeBuildKiteOption = page.getByRole('option', { name: 'BuildKite' });
    this.pipelineToolTokenInput = this.pipelineToolContainer.getByLabel('Token');
    this.pipelineToolVerifyButton = this.pipelineToolContainer.getByRole('button', { name: 'Verify' });
    this.pipelineToolVerifiedButton = this.pipelineToolContainer.getByRole('button', { name: 'Verified' });
    this.pipelineToolResetButton = this.pipelineToolContainer.getByRole('button', { name: 'Reset' });

    this.sourceControlContainer = page.getByLabel('Source Control Config');
    this.sourceControlTypeSelect = this.sourceControlContainer.getByLabel('Source Control *');
    this.sourceControlTokenInput = this.sourceControlContainer.getByLabel('Token');
    this.sourceControlVerifyButton = this.sourceControlContainer.getByRole('button', { name: 'Verify' });
    this.sourceControlVerifiedButton = this.sourceControlContainer.getByRole('button', { name: 'Verified' });
    this.sourceControlResetButton = this.sourceControlContainer.getByRole('button', { name: 'Reset' });

    this.saveAsButton = page.getByRole('button', { name: 'Save' });
  }

  async waitForShown() {
    await expect(this.stepTitle).toHaveClass(/Mui-active/);
  }

  async typeInProjectName(projectName: string) {
    await this.projectNameInput.fill(projectName);
  }

  async clickPreviousButtonThenGoHome() {
    await this.previousButton.click();

    await expect(this.previousModal).toBeVisible();

    await this.previousModalYesButton.click();

    await expect(this.page).toHaveURL(/\//);
  }

  async clickPreviousButtonAndClickCancelThenRemainPage() {
    await this.previousButton.click();

    await expect(this.previousModal).toBeVisible();

    await this.previousModalCancelButton.click();

    await expect(this.page).toHaveURL(/\/metrics/);
  }

  async selectRegularCalendar(calendarType: string) {
    if (calendarType === 'Calendar with Chinese Holiday') {
      await this.chineseCalendar.click();
      await expect(this.chineseCalendar).toBeChecked();
      await expect(this.regularCalendar).not.toBeChecked();
    } else {
      await this.regularCalendar.click();
      await expect(this.regularCalendar).toBeChecked();
      await expect(this.chineseCalendar).not.toBeChecked();
    }
  }

  async selectDateRange(fromDay: Dayjs, toDay: Dayjs) {
    await this.fromDateInput.click();
    await this.fromDateInputButton.click();
    await this.fromDateInputValueSelect(fromDay).click();
    expect(this.page.getByText(covertToDateString(fromDay))).toBeTruthy();

    await this.toDateInputButton.click();
    await this.toDateInputValueSelect(toDay).click();
    expect(this.page.getByText(covertToDateString(toDay))).toBeTruthy();
  }

  async selectVelocityAndClassificationInRequireData() {
    await this.requireDataButton.click();
    await this.velocityCheckbox.check();
    await this.classificationCheckbox.check();
    await this.page.keyboard.press('Escape');

    await expect(this.requireDataButton).toHaveText('Velocity, Classification');

    await this.requireDataButton.click();
    await this.velocityCheckbox.uncheck();
    await this.classificationCheckbox.uncheck();
    await this.page.keyboard.press('Escape');

    expect(this.requiredDataErrorMessage).toBeTruthy();
  }

  async typeInDateRange({ startDate, endDate }: { startDate: string; endDate: string }) {
    await this.fromDateInput.fill(startDate);
    await this.toDateInput.fill(endDate);
  }

  async validateNextButtonNotClickable() {
    await expect(this.nextButton).toBeDisabled();
  }

  async validateNextButtonClickable() {
    await expect(this.nextButton).toBeEnabled();
  }

  async selectAllRequiredMetrics() {
    await this.requiredMetricsLabel.click();
    await this.requiredMetricsAllOption.click();
    await this.page.keyboard.press('Escape');
  }

  async checkBoardFormVisible() {
    await expect(this.boardContainer).toBeVisible();
    await expect(this.boardTypeSelect).toBeVisible();
    await expect(this.boardIdInput).toBeVisible();
    await expect(this.boardEmailInput).toBeVisible();
    await expect(this.boardSiteInput).toBeVisible();
    await expect(this.boardTokenInput).toBeVisible();
  }

  async checkPipelineToolFormVisible() {
    await expect(this.pipelineToolContainer).toBeVisible();
    await expect(this.pipelineToolTypeSelect).toBeVisible();
    await expect(this.pipelineToolTokenInput).toBeVisible();
  }

  async checkSourceControlFormVisible() {
    await expect(this.sourceControlContainer).toBeVisible();
    await expect(this.sourceControlTypeSelect).toBeVisible();
    await expect(this.sourceControlTokenInput).toBeVisible();
  }

  async fillBoardConfigForm({ boardId, email, site, token }: IBoardData) {
    await this.boardIdInput.fill(boardId);
    await this.boardEmailInput.fill(email);
    await this.boardSiteInput.fill(site);
    await this.boardTokenInput.fill(token);
  }

  async fillAndverifyBoardConfig(boardData: IBoardData) {
    await this.fillBoardConfigForm(boardData);

    await expect(this.boardVerifyButton).toBeEnabled();

    await this.boardVerifyButton.click();

    await expect(this.boardVerifiedButton).toBeVisible();
  }

  async resetBoardConfig() {
    await expect(this.boardResetButton).toBeEnabled();

    await this.boardResetButton.click();
  }

  async fillPipelineToolForm({ token }: IPipelineToolData) {
    await this.pipelineToolTokenInput.fill(token);
    await this.pipelineToolTypeSelect.click();
    await this.pipelineToolTypeBuildKiteOption.click();
  }

  async fillAndVerifyPipelineToolForm(pipelineToolData: IPipelineToolData) {
    await this.fillPipelineToolForm(pipelineToolData);

    await expect(this.pipelineToolVerifyButton).toBeEnabled();

    await this.pipelineToolVerifyButton.click();

    await expect(this.pipelineToolVerifiedButton).toBeVisible();
  }

  async fillSourceControlForm({ token }: ISourceControlData) {
    await this.sourceControlTokenInput.fill(token);
  }

  async fillAndVerifySourceControlForm(sourceControlData: ISourceControlData) {
    await this.fillSourceControlForm(sourceControlData);

    await expect(this.sourceControlVerifyButton).toBeEnabled();

    await this.sourceControlVerifyButton.click();

    await expect(this.sourceControlVerifiedButton).toBeHidden();
  }

  async saveConfigStepAsJSONThenVerifyDownloadFile(json: typeof configStepData) {
    return downloadFileAndCheck(this.page, this.saveAsButton, METRICS_STEP_SAVING_FILENAME, async (fileDataString) => {
      const fileData = JSON.parse(fileDataString);
      expect(fileData).toEqual(json);
    });
  }

  async goToMetrics() {
    await this.nextButton.click();
  }

  async goToPreviousStep() {
    await this.previousButton.click();
  }

  async cancelGoToPreviousStep() {
    const cancelButton = this.page.getByRole('button', { name: 'Cancel' });
    await cancelButton.click();
  }

  async confirmGoToPreviousStep() {
    const confirmButton = this.page.getByRole('button', { name: 'Yes' });
    await confirmButton.click();
  }

  async verifyAllConfig() {
    await this.boardVerifyButton.click();
    await this.pipelineToolVerifyButton.click();
    await this.sourceControlVerifyButton.click();
  }

  async verifyBoardConfig() {
    await this.boardVerifyButton.click();
  }
}

function covertToDateString(day: Dayjs): string | RegExp {
  return `${day.month() + 1} / ${day.date()} / ${day.year()}`;
}
