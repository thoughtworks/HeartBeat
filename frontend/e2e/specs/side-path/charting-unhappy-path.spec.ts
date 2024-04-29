import { chartStepData } from '../../fixtures/import-file/chart-step-data';
import { test } from '../../fixtures/test-with-extend-fixtures';
import { clearTempDir } from '../../utils/clear-temp-dir';
import { format } from '../../utils/date-time';

test.beforeAll(async () => {
  await clearTempDir();
});

test('Charting unhappy path on config and metri page', async ({ homePage, configStep, metricsStep }) => {
  const rightDateRange_frist = {
    startDate: format(chartStepData.rightDateRange[0].startDate),
    endDate: format(chartStepData.rightDateRange[0].endDate),
    number: 0,
  };
  const rightDateRange_second = {
    startDate: format(chartStepData.rightDateRange[1].startDate),
    endDate: format(chartStepData.rightDateRange[1].endDate),
    number: 1,
  };
  const errorDateRange = {
    startDate: format(chartStepData.errorDateRange[0].startDate),
    endDate: format(chartStepData.errorDateRange[0].endDate),
  };

  const noCardDateRange_frist = {
    startDate: format(chartStepData.noCardDateRange[0].startDate),
    endDate: format(chartStepData.noCardDateRange[0].endDate),
    number: 0,
  };

  const noCardDateRange_second = {
    startDate: format(chartStepData.noCardDateRange[1].startDate),
    endDate: format(chartStepData.noCardDateRange[1].endDate),
    number: 1,
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

  await configStep.typeInDateRange(noCardDateRange_frist);
  await configStep.addNewTimeRange();
  await configStep.typeInDateRange(noCardDateRange_second);
  await configStep.selectAllRequiredMetrics();
  await configStep.selectBoardMetricsOnly();
  await configStep.goToMetrics();
  await metricsStep.checkBoardNoCard();
  await metricsStep.validateNextButtonNotClickable();
  await metricsStep.goToPreviousStep();

  await configStep.typeInDateRange(rightDateRange_frist);
  await configStep.typeInDateRange(rightDateRange_second);
  await configStep.selectAllRequiredMetrics();
  await configStep.goToMetrics();
  await metricsStep.deselectBranch(chartStepData.unSelectBranch);
  await metricsStep.addBranch(chartStepData.addNewBranch);
  await metricsStep.checkBranchIsInvalid();
  await metricsStep.validateNextButtonNotClickable();
});
