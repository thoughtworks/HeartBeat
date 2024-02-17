import { test } from '../fixtures/testWithExtendFixtures';
import { clearTempDir } from 'e2e/utils/clearTempDir';

test.beforeAll(async () => {
  await clearTempDir();
});

test('Import project from file', async ({ homePage, configStep, metricsStep, reportStep }) => {
  await homePage.goto();
  await homePage.importProjectFromFile();
  await configStep.verifyAllConfig();
  await configStep.goToMetrics();

  await metricsStep.waitForShown();
  await metricsStep.goToReportPage();

  await reportStep.confirmGeneratedReport();

  await reportStep.checkBoardMetrics('17', '9', '4.86', '9.18');
  await reportStep.checkBoardMetricsDetails('import-project-from-file-Board-Metrics.png');
  await reportStep.checkDoraMetrics('6.12', '0.50', '6.62', '6.60', '17.50% (7/40)', '1.90');
  await reportStep.checkDoraMetricsDetails('import-project-from-file-DORA-Metrics.png');

  await reportStep.checkDownloadReports();
});
