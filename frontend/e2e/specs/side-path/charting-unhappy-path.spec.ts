import { importModifiedCorrectConfig as modifiedCorrectProjectFromFile } from '../../fixtures/import-file/unhappy-path-file';
import { chartStepData } from '../../fixtures/import-file/chart-step-data';
import { test } from '../../fixtures/test-with-extend-fixtures';
import { clearTempDir } from '../../utils/clear-temp-dir';
import { format } from '../../utils/date-time';

test.beforeAll(async () => {
  await clearTempDir();
});

test('Charting unhappy path on config and metri page', async ({ homePage, configStep, metricsStep }) => {
  const rightDateRange = {
    startDate: format(modifiedCorrectProjectFromFile.dateRange.startDate),
    endDate: format(modifiedCorrectProjectFromFile.dateRange.endDate),
  };
  const errorDateRange = {
    startDate: format(chartStepData.errorDateRange[0].startDate),
    endDate: format(chartStepData.errorDateRange[0].endDate),
  };

  const noCardDateRange = {
    startDate: format(chartStepData.noCardDateRange[0].startDate),
    endDate: format(chartStepData.noCardDateRange[0].endDate),
  };
  await homePage.goto();

  await homePage.importProjectFromFile('../fixtures/input-files/charting-unhappy-path-config-file.json');

  await configStep.verifyAllConfig();
  await configStep.addNewTimeRange();
  await configStep.addNewTimeRange();
  await configStep.addNewTimeRange();
  await configStep.addNewTimeRange();
  await configStep.addNewTimeRange();
  await configStep.validateAddNewTimeRangeButtonNotClickable();
  await configStep.validateNextButtonNotClickable();
  await configStep.RemoveLastNewPipeline();
  await configStep.RemoveLastNewPipeline();
  await configStep.RemoveLastNewPipeline();
  await configStep.RemoveLastNewPipeline();
  await configStep.RemoveLastNewPipeline();
  await configStep.validateRemoveTimeRangeButtonIsHidden();
  await configStep.typeInDateRange(errorDateRange);
  await configStep.checkErrorStratTimeMessage();
  await configStep.checkErrorEndTimeMessage();
  await configStep.validateNextButtonNotClickable();
  await configStep.typeInDateRange(noCardDateRange);
  await configStep.goToMetrics();
  await metricsStep.waitForShown();
  await configStep.validateNextButtonNotClickable();
  await metricsStep.goToPreviousStep();
  await configStep.typeInDateRange(rightDateRange);
  await configStep.goToMetrics();
  await metricsStep.waitForShown();
  await metricsStep.deselectBranch(chartStepData.unSelectBranch);
  await metricsStep.addBranch(chartStepData.addNewBranch);
  await metricsStep.checkBranchIsInvalid();
  await configStep.validateNextButtonNotClickable();
});
