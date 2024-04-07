import { BOARD_METRICS_RESULT } from '../fixtures/cycleTimeByStatus/cycleTimeByStatusReportResult';
import { cycleTimeByStatusFixture } from '../fixtures/cycleTimeByStatus/cycleTimeByStatusFixture';
import { cycleTimeByColumnFixture } from '../fixtures/cycleTimeByStatus/cycleTimeByColumnFixture';
import { test } from '../fixtures/testWithExtendFixtures';
import { format } from '../utils/dateTime';

test('Create a new project with cycle time by status', async ({ homePage, configStep, metricsStep, reportStep }) => {
  const dateRange = {
    startDate: format(cycleTimeByStatusFixture.dateRange.startDate),
    endDate: format(cycleTimeByStatusFixture.dateRange.endDate),
  };
  const hbStateDataByStatus = cycleTimeByColumnFixture.cycleTime.jiraColumns.map(
    (jiraToHBSingleMap) => Object.values(jiraToHBSingleMap)[0],
  );

  await homePage.goto();
  await homePage.createANewProject();
  await configStep.typeInProjectName(cycleTimeByStatusFixture.projectName);
  await configStep.selectRegularCalendar(cycleTimeByStatusFixture.calendarType);
  await configStep.typeInDateRange(dateRange);
  await configStep.selectBoardMetricsOnly();
  await configStep.checkBoardFormVisible();
  await configStep.fillAndVerifyBoardConfig(cycleTimeByStatusFixture.board);
  await configStep.validateNextButtonClickable();
  await configStep.goToMetrics();

  await metricsStep.waitForShown();
  await metricsStep.validateNextButtonNotClickable();
  await metricsStep.checkLastAssigneeCrewFilterChecked();
  await metricsStep.checkCycleTimeConsiderCheckboxChecked();
  await metricsStep.checkCycleTimeSettingIsByColumn();
  await metricsStep.waitForHiddenLoading();
  await metricsStep.selectCrews(cycleTimeByStatusFixture.crews);

  await metricsStep.selectCycleTimeSettingsType(cycleTimeByStatusFixture.cycleTime.type);
  await metricsStep.checkCycleTimeSettingIsByStatus();
  await metricsStep.selectHeartbeatStateByStatus(hbStateDataByStatus, false);

  await metricsStep.selectClassifications(cycleTimeByStatusFixture.classification);

  await metricsStep.goToReportPage();

  await reportStep.confirmGeneratedReport();
  await reportStep.checkBoardMetricsWithoutRework(
    BOARD_METRICS_RESULT.Velocity,
    BOARD_METRICS_RESULT.Throughput,
    BOARD_METRICS_RESULT.AverageCycleTime4SP,
    BOARD_METRICS_RESULT.AverageCycleTime4Card,
  );

  await reportStep.checkMetricDownloadDataByStatus();

  // Test in the by column flow
  await homePage.goto();
  await homePage.createANewProject();
  await configStep.typeInProjectName(cycleTimeByColumnFixture.projectName);
  await configStep.selectRegularCalendar(cycleTimeByColumnFixture.calendarType);
  await configStep.typeInDateRange(dateRange);
  await configStep.selectBoardMetricsOnly();
  await configStep.checkBoardFormVisible();
  await configStep.fillAndVerifyBoardConfig(cycleTimeByColumnFixture.board);
  await configStep.validateNextButtonClickable();
  await configStep.goToMetrics();

  await metricsStep.waitForShown();
  await metricsStep.validateNextButtonNotClickable();
  await metricsStep.checkLastAssigneeCrewFilterChecked();
  await metricsStep.checkCycleTimeConsiderCheckboxChecked();
  await metricsStep.checkCycleTimeSettingIsByColumn();
  await metricsStep.waitForHiddenLoading();
  await metricsStep.selectCrews(cycleTimeByColumnFixture.crews);

  await metricsStep.selectCycleTimeSettingsType(cycleTimeByColumnFixture.cycleTime.type);
  await metricsStep.checkCycleTimeSettingIsByColumn();
  await metricsStep.selectHeartbeatStateByStatus(hbStateDataByStatus, true);

  await metricsStep.selectClassifications(cycleTimeByColumnFixture.classification);
  await metricsStep.goToReportPage();

  await reportStep.confirmGeneratedReport();
  await reportStep.checkBoardMetricsWithoutRework(
    BOARD_METRICS_RESULT.Velocity,
    BOARD_METRICS_RESULT.Throughput,
    BOARD_METRICS_RESULT.AverageCycleTime4SP,
    BOARD_METRICS_RESULT.AverageCycleTime4Card,
  );

  await reportStep.checkMetricDownloadDataByStatus();
  await reportStep.checkDownloadReportsCycleTimeByStatus();
});

test('Import project from file with cycle time by status', async ({
  homePage,
  configStep,
  metricsStep,
  reportStep,
}) => {
  const hbStateDataByStatus = cycleTimeByColumnFixture.cycleTime.jiraColumns.map(
    (jiraToHBSingleMap) => Object.values(jiraToHBSingleMap)[0],
  );
  await homePage.goto();

  await homePage.importProjectFromFile('../fixtures/input-files/cycle-time-by-status-config-file.json');
  await configStep.verifyBoardConfig();
  await configStep.goToMetrics();
  await metricsStep.waitForShown();

  await metricsStep.checkCrewsAreChanged(cycleTimeByStatusFixture.crews);
  await metricsStep.checkLastAssigneeCrewFilterChecked();
  await metricsStep.checkCycleTimeSettingIsByColumn();

  await metricsStep.selectCycleTimeSettingsType(cycleTimeByStatusFixture.cycleTime.type);
  await metricsStep.checkCycleTimeSettingIsByStatus();
  await metricsStep.selectHeartbeatStateByStatus(hbStateDataByStatus, false);

  await metricsStep.checkClassifications(cycleTimeByStatusFixture.classification);

  await metricsStep.goToReportPage();
  await reportStep.confirmGeneratedReport();
  await reportStep.checkBoardMetricsWithoutRework(
    BOARD_METRICS_RESULT.Velocity,
    BOARD_METRICS_RESULT.Throughput,
    BOARD_METRICS_RESULT.AverageCycleTime4SP,
    BOARD_METRICS_RESULT.AverageCycleTime4Card,
  );
  await reportStep.checkDownloadReportsCycleTimeByStatus();

  // Test in by column flow
  await homePage.goto();

  await homePage.importProjectFromFile('../fixtures/input-files/cycle-time-by-status-config-file.json');
  await configStep.verifyBoardConfig();
  await configStep.goToMetrics();
  await metricsStep.waitForShown();

  await metricsStep.checkCrewsAreChanged(cycleTimeByColumnFixture.crews);
  await metricsStep.checkLastAssigneeCrewFilterChecked();
  await metricsStep.checkCycleTimeSettingIsByColumn();

  await metricsStep.selectCycleTimeSettingsType(cycleTimeByColumnFixture.cycleTime.type);
  await metricsStep.checkCycleTimeSettingIsByColumn();
  await metricsStep.selectHeartbeatStateByStatus(hbStateDataByStatus, true);

  await metricsStep.checkClassifications(cycleTimeByColumnFixture.classification);

  await metricsStep.goToReportPage();
  await reportStep.confirmGeneratedReport();
  await reportStep.checkBoardMetricsWithoutRework(
    BOARD_METRICS_RESULT.Velocity,
    BOARD_METRICS_RESULT.Throughput,
    BOARD_METRICS_RESULT.AverageCycleTime4SP,
    BOARD_METRICS_RESULT.AverageCycleTime4Card,
  );
  await reportStep.checkDownloadReportsCycleTimeByStatus();
});
