import { BOARD_METRICS_RESULT, FLAG_AS_BLOCK_PROJECT_BOARD_METRICS_RESULT } from '../fixtures/createNew/reportResult';
import { importMultipleDoneProjectFromFile } from '../fixtures/importFile/multiple-done-config-file';
import { test } from '../fixtures/testWithExtendFixtures';
import { clearTempDir } from 'e2e/utils/clearTempDir';

test.beforeAll(async () => {
  await clearTempDir();
});

test('Import project from file', async ({ homePage, configStep, metricsStep, reportStep }) => {
  const hbStateData = importMultipleDoneProjectFromFile.cycleTime.jiraColumns.map(
    (jiraToHBSingleMap) => Object.values(jiraToHBSingleMap)[0],
  );

  await homePage.goto();

  await homePage.importMultipleDoneProjectFromFile();
  await configStep.clickPreviousButtonAndClickCancelThenRemainPage();
  await configStep.verifyAllConfig();
  await configStep.goToMetrics();
  await metricsStep.waitForShown();

  // To verify board configuration matches json file data
  await metricsStep.checkCrewsAreChanged(importMultipleDoneProjectFromFile.crews);
  await metricsStep.checkLastAssigneeCrewFilterChecked();
  await metricsStep.checkCycleTimeSettingIsByColumn();
  await metricsStep.checkHeartbeatStateIsSet(hbStateData);
  await metricsStep.checkClassifications(importMultipleDoneProjectFromFile.classification);
  await metricsStep.checkPipelineConfigurationAreChanged(importMultipleDoneProjectFromFile.deployment);

  await metricsStep.goToReportPage();
  await reportStep.confirmGeneratedReport();
  await reportStep.checkBoardMetrics(
    BOARD_METRICS_RESULT.Velocity,
    BOARD_METRICS_RESULT.Throughput,
    BOARD_METRICS_RESULT.AverageCycleTime4SP,
    BOARD_METRICS_RESULT.AverageCycleTime4Card,
  );
  await reportStep.checkBoardMetricsDetails('import-project-from-file-Board-Metrics.png', 9);
  await reportStep.checkDoraMetricsDetails('import-project-from-file-DORA-Metrics.png');
  await reportStep.checkDownloadReports();
});

test('Import project from flag as block', async ({ homePage, configStep, metricsStep, reportStep }) => {
  await homePage.goto();

  await homePage.importFlagAsBlockProjectFromFile();
  await configStep.verifyBoardConfig();
  await configStep.goToMetrics();
  await metricsStep.waitForShown();
  await metricsStep.goToReportPage();

  await reportStep.checkBoardMetrics(
    FLAG_AS_BLOCK_PROJECT_BOARD_METRICS_RESULT.Velocity,
    FLAG_AS_BLOCK_PROJECT_BOARD_METRICS_RESULT.Throughput,
    FLAG_AS_BLOCK_PROJECT_BOARD_METRICS_RESULT.AverageCycleTime4SP,
    FLAG_AS_BLOCK_PROJECT_BOARD_METRICS_RESULT.AverageCycleTime4Card,
  );
});
