import { config as metricsStepData } from '../fixtures/metricsStep';
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
  const hbStateData = metricsStepData.cycleTime.jiraColumns.map(
    (jiraToHBSingleMap) => Object.values(jiraToHBSingleMap)[0],
  );

  await homePage.goto();
  await homePage.createANewProject();
  await configStep.waitForShown();
  await configStep.typeInProjectName(configStepData.projectName);
  await configStep.clickPreviousButtonThenGoHome();
  await homePage.createANewProject();
  await configStep.typeInProjectName(configStepData.projectName);
  await configStep.selectRegularCalendar(configStepData.calendarType);
  await configStep.typeInDateRange(dateRange);
  await configStep.selectAllRequiredMetrics();
  await configStep.checkBoardFormVisible();
  await configStep.checkPipelineToolFormVisible();
  await configStep.checkSourceControlFormVisible();
  await configStep.fillAndverifyBoardConfig(configStepData.board);
  await configStep.resetBoardConfig();
  await configStep.fillAndverifyBoardConfig(configStepData.board);
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
  await metricsStep.selectCrews(metricsStepData.crews);
  await metricsStep.selectCycleTimeSettingsType(metricsStepData.cycleTime.type);
  await metricsStep.selectHeartbeatState(hbStateData);
  await metricsStep.selectClassifications(metricsStepData.classification);
  await metricsStep.selectDefaultGivenPipelineSetting(metricsStepData.deployment);
  await metricsStep.selectGivenPipelineCrews(metricsStepData.pipelineCrews);
  // await metricsStep.goToPreviousStep();
  // await configStep.waitForShown();
  // await configStep.goToMetrics();
  // await metricsStep.waitForShown();
  await metricsStep.saveConfigStepAsJSONThenVerifyDownloadFile(metricsStepData);
  await metricsStep.goToReportPage();
  await reportStep.goToPreviousStep();
  await metricsStep.waitForShown();
  await metricsStep.goToReportPage();

  // await reportStep.confirmGeneratedReport();
  // await reportStep.checkBoardMetrics('17', '9', '4.92', '9.30');
  // await reportStep.checkBoardMetricsDetails('create-a-new-project-Board-Metrics.png');
  // await reportStep.checkDoraMetrics('6.12', '0.50', '6.62', '6.60', '17.50% (7/40)', '1.90');
  // await reportStep.checkDoraMetricsDetails('create-a-new-project-DORA-Metrics.png');
});
