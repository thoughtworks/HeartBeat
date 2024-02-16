import { config as configStepData } from '../fixtures/configStep';
import { test } from '../fixtures/testWithExtendFixtures';
import { clearTempDir } from 'e2e/utils/clearTempDir';
import { format } from 'e2e/utils/dateTime';

test.beforeAll(async () => {
  await clearTempDir();
});

test('Create a new project', async ({ homePage, configStep, metricsStep, reportStep }) => {
  const dateRange = {
    startDate: format(configStepData.dateRange.startDate),
    endDate: format(configStepData.dateRange.endDate),
  };
  await homePage.goto();
  await homePage.createANewProject();
  await configStep.waitForShown();
  await configStep.typeInProjectName(configStepData.projectName);
  await configStep.clickPreviousButtonThenGoHome();
  await homePage.createANewProject();
  await configStep.typeInProjectName(configStepData.projectName);
  await configStep.typeInDateRange(dateRange);
  await configStep.validateNextButtonNotClickable();
  await configStep.selectAllRequiredMetrics();
  await configStep.checkBoardFormVisible();
  await configStep.checkPipelineToolFormVisible();
  await configStep.checkSourceControlFormVisible();
  await configStep.fillAndVerifyBoardConfig(configStepData.board);
  await configStep.resetBoardConfig();
  await configStep.fillAndVerifyBoardConfig(configStepData.board);
  await configStep.fillAndVerifyPipelineToolForm(configStepData.pipelineTool);
  await configStep.fillAndVerifySourceControlForm(configStepData.sourceControl);
  await configStep.saveConfigStepAsJSONThenVerifyDownloadFile(configStepData);
  await configStep.validateNextButtonClickable();
  await configStep.goToMetrics();

  await metricsStep.waitForShown();
  await metricsStep.validateNextButtonNotClickable();
  await metricsStep.checkBoardConfigurationVisible();
  await metricsStep.checkPipelineConfigurationVisible();
  await metricsStep.checkLastAssigneeCrewFilterChecked();
  await metricsStep.checkCycleTimeConsiderCheckboxChecked();
  await metricsStep.checkCycleTimeSettingIsByColumn();
  await metricsStep.waitForHiddenLoading();
  await metricsStep.selectHeartbeatState(
    'To do',
    'In Dev',
    'Block',
    'Review',
    'Waiting for testing',
    'Testing',
    'Done',
  );
  await metricsStep.selectDistinguishedByOptions();
  await metricsStep.selectPipelineSetting();
  await metricsStep.goToReportPage();

  await reportStep.confirmGeneratedReport();
  await reportStep.checkBoardMetrics('17', '9', '4.92', '9.30');
  await reportStep.checkBoardMetricsDetails('./e2e/snapshot/create-a-new-project-Board-Metrics.png');

  await reportStep.checkDoraMetrics('6.12', '0.50', '6.62', '6.60', '17.50% (7/40)', '1.90');
  await reportStep.checkDoraMetricsDetails('./e2e/snapshot/create-a-new-project-DORA-Metrics.png');
});
