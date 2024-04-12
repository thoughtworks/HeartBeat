import { configWithoutBlockColumn as metricsStepWithoutBlockColumnData } from '../../fixtures/create-new/metrics-step';
import { configWithoutBlockColumn as configWithoutBlockColumnData } from '../../fixtures/create-new/config-step';
import { cycleTimeByStatusFixture } from '../../fixtures/cycle-time-by-status/cycle-time-by-status-fixture';
import { BOARD_METRICS_RESULT, DORA_METRICS_RESULT } from '../../fixtures/create-new/report-result';
import { config as metricsStepData } from '../../fixtures/create-new/metrics-step';
import { config as configStepData } from '../../fixtures/create-new/config-step';
import { ProjectCreationType } from 'e2e/pages/metrics/report-step';
import { test } from '../../fixtures/test-with-extend-fixtures';
import { clearTempDir } from 'e2e/utils/clear-temp-dir';
import { format } from 'e2e/utils/date-time';

test.beforeAll(async () => {
  await clearTempDir();
});

test('Create a new project', async ({ homePage, configStep, metricsStep, reportStep }) => {
  const dateRange = {
    startDate: format(configStepData.dateRange[0].startDate),
    endDate: format(configStepData.dateRange[0].endDate),
  };
  const hbStateData = metricsStepData.cycleTime.jiraColumns.map(
    (jiraToHBSingleMap) => Object.values(jiraToHBSingleMap)[0],
  );
  const hbStateDataEmptyByStatus = cycleTimeByStatusFixture.cycleTime.jiraColumns.map(
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
  await metricsStep.checkCycleTimeSettingIsByColumn();
  await metricsStep.waitForHiddenLoading();
  await metricsStep.selectCrews(metricsStepData.crews);

  await metricsStep.selectCycleTimeSettingsType(metricsStepData.cycleTime.type);
  await metricsStep.checkHeartbeatStateIsSet(hbStateDataEmptyByStatus, true);

  await metricsStep.selectCycleTimeSettingsType(cycleTimeByStatusFixture.cycleTime.type);
  await metricsStep.checkHeartbeatStateIsSet(hbStateDataEmptyByStatus, false);
  await metricsStep.selectHeartbeatState(hbStateData, false);
  await metricsStep.checkHeartbeatStateIsSet(hbStateData, false);

  await metricsStep.selectCycleTimeSettingsType(metricsStepData.cycleTime.type);
  await metricsStep.selectHeartbeatState(hbStateData, true);
  await metricsStep.checkHeartbeatStateIsSet(hbStateData, true);

  await metricsStep.selectClassifications(metricsStepData.classification);
  await metricsStep.selectDefaultGivenPipelineSetting(metricsStepData.deployment);
  await metricsStep.selectGivenPipelineCrews(metricsStepData.pipelineCrews);
  await metricsStep.selectReworkSettings(metricsStepData.reworkTimesSettings);
  await metricsStep.saveConfigStepAsJSONThenVerifyDownloadFile(metricsStepData);
  await metricsStep.goToReportPage();

  await reportStep.confirmGeneratedReport();
  await reportStep.checkBoardMetrics(
    BOARD_METRICS_RESULT.Velocity,
    BOARD_METRICS_RESULT.Throughput,
    BOARD_METRICS_RESULT.AverageCycleTime4SP,
    BOARD_METRICS_RESULT.AverageCycleTime4Card,
    BOARD_METRICS_RESULT.totalReworkTimes,
    BOARD_METRICS_RESULT.totalReworkCards,
    BOARD_METRICS_RESULT.reworkCardsRatio,
    BOARD_METRICS_RESULT.throughput,
  );
  await reportStep.checkBoardMetricsDetails(ProjectCreationType.CREATE_A_NEW_PROJECT, 9);
  await reportStep.checkDoraMetrics(
    DORA_METRICS_RESULT.PrLeadTime,
    DORA_METRICS_RESULT.PipelineLeadTime,
    DORA_METRICS_RESULT.TotalLeadTime,
    DORA_METRICS_RESULT.DeploymentFrequency,
    DORA_METRICS_RESULT.FailureRate,
    DORA_METRICS_RESULT.DevMeanTimeToRecovery,
  );
  await reportStep.checkDoraMetricsDetails(ProjectCreationType.CREATE_A_NEW_PROJECT);
  await reportStep.checkMetricDownloadData();
});

test('Create a new project without block column in boarding mapping', async ({
  homePage,
  configStep,
  metricsStep,
  reportStep,
}) => {
  const dateRange = {
    startDate: format(configWithoutBlockColumnData.dateRange[0].startDate),
    endDate: format(configWithoutBlockColumnData.dateRange[0].endDate),
  };

  await homePage.goto();
  await homePage.createANewProject();
  await configStep.waitForShown();
  await configStep.typeInProjectName(configWithoutBlockColumnData.projectName);
  await configStep.selectRegularCalendar(configWithoutBlockColumnData.calendarType);
  await configStep.typeInDateRange(dateRange);
  await configStep.selectReworkTimesRequiredMetrics();
  await configStep.checkBoardFormVisible();
  await configStep.checkPipelineToolFormInvisible();
  await configStep.checkSourceControlFormInvisible();
  await configStep.fillAndVerifyBoardConfig(configWithoutBlockColumnData.board);
  await configStep.validateNextButtonClickable();
  await configStep.goToMetrics();

  await metricsStep.checkBoardConfigurationVisible();
  await metricsStep.checkPipelineConfigurationInvisible();
  await metricsStep.checkClassificationSettingInvisible();
  await metricsStep.selectCrews(metricsStepWithoutBlockColumnData.crews);
  await metricsStep.selectCycleTimeSettingsType(metricsStepWithoutBlockColumnData.cycleTime.type);
  await metricsStep.checkCycleTimeConsiderCheckboxChecked();
  await metricsStep.selectHeartbeatStateWithoutBlock(
    metricsStepWithoutBlockColumnData.cycleTime.jiraColumns.map(
      (jiraToHBSingleMap) => Object.values(jiraToHBSingleMap)[0],
    ),
  );
  await metricsStep.selectReworkSettings(metricsStepWithoutBlockColumnData.reworkTimesSettings);

  await metricsStep.goToReportPage();
  await reportStep.confirmGeneratedReport();
  await reportStep.checkBoardDownloadDataWithoutBlock('../../fixtures/create-new/board-data-without-block-column.csv');
});
