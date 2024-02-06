import { expect, Locator, Page } from '@playwright/test';
import { Dayjs } from 'dayjs';
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
  readonly nextButton: Locator;

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
    this.nextButton = page.getByRole('button', { name: 'Next' });
  }

  async waitForShown() {
    await expect(this.stepTitle).toHaveClass(/Mui-active/);
  }

  async typeProjectName(projectName: string) {
    await this.projectNameInput.fill(projectName);
  }

  async checkProjectName(projectName: string) {
    await expect(this.projectNameInput).toHaveValue(projectName);
  }

  async selectRegularCalendar() {
    await this.regularCalendar.click();

    await expect(this.chineseCalendar).not.toBeChecked();
    await expect(this.regularCalendar).toBeChecked();
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
}
function covertToDateString(day: Dayjs): string | RegExp {
  return `${day.month() + 1} / ${day.date()} / ${day.year()}`;
}
