import { checkDownloadReport, downloadFileAndCheck } from 'e2e/utils/download';
import { expect, Locator, Page } from '@playwright/test';

import { E2E_EXPECT_CI_TIMEOUT } from '../../fixtures';
import { parse } from 'csv-parse/sync';
import path from 'path';
import fs from 'fs';

export enum ProjectCreationType {
  IMPORT_PROJECT_FROM_FILE,
  CREATE_A_NEW_PROJECT,
}

export class ReportStep {
  readonly page: Page;
  readonly pageHeader: Locator;
  readonly velocityPart: Locator;
  readonly averageCycleTimeForSP: Locator;
  readonly averageCycleTimeForCard: Locator;
  readonly prLeadTime: Locator;
  readonly pipelineLeadTime: Locator;
  readonly totalLeadTime: Locator;
  readonly deploymentFrequency: Locator;
  readonly failureRate: Locator;
  readonly meanTimeToRecovery: Locator;
  readonly showMoreLinks: Locator;
  readonly previousButton: Locator;
  readonly backButton: Locator;
  readonly exportPipelineDataButton: Locator;
  readonly exportBoardData: Locator;
  readonly exportMetricData: Locator;
  readonly homeIcon: Locator;
  readonly velocityRows: Locator;
  readonly cycleTimeRows: Locator;
  readonly classificationRows: Locator;
  readonly leadTimeForChangesRows: Locator;
  readonly changeFailureRateRows: Locator;
  readonly meanTimeToRecoveryRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeader = this.page.locator('[data-test-id="Header"]');
    this.velocityPart = this.page.locator('[data-test-id="Velocity"] [data-test-id="report-section"]');
    this.averageCycleTimeForSP = this.page.locator('[data-test-id="Cycle Time"] [data-test-id="report-section"]');
    this.averageCycleTimeForCard = this.page.locator('[data-test-id="Cycle Time"] [data-test-id="report-section"]');
    this.prLeadTime = this.page.locator('[data-test-id="Lead Time For Changes"] [data-test-id="report-section"]');
    this.pipelineLeadTime = this.page.locator('[data-test-id="Lead Time For Changes"] [data-test-id="report-section"]');
    this.totalLeadTime = this.page.locator('[data-test-id="Lead Time For Changes"] [data-test-id="report-section"]');
    this.deploymentFrequency = this.page.locator(
      '[data-test-id="Deployment Frequency"] [data-test-id="report-section"]',
    );
    this.failureRate = this.page.locator('[data-test-id="Change Failure Rate"] [data-test-id="report-section"]');
    this.meanTimeToRecovery = this.page.locator(
      '[data-test-id="Mean Time To Recovery"] [data-test-id="report-section"]',
    );
    this.showMoreLinks = this.page.getByText('show more >');
    this.previousButton = page.getByRole('button', { name: 'Previous' });
    this.backButton = this.page.getByText('Back');
    this.exportMetricData = this.page.getByText('Export metric data');
    this.exportBoardData = this.page.getByText('Export board data');
    this.exportPipelineDataButton = this.page.getByText('Export pipeline data');
    this.homeIcon = page.getByLabel('Home');
    this.velocityRows = this.page.getByTestId('Velocity').locator('tbody').getByRole('row');
    this.cycleTimeRows = this.page.getByTestId('Cycle Time').locator('tbody').getByRole('row');
    this.classificationRows = this.page.getByTestId('Classification').locator('tbody').getByRole('row');
    this.leadTimeForChangesRows = this.page.getByTestId('Lead Time For Changes').getByRole('row');
    this.changeFailureRateRows = this.page.getByTestId('Change Failure Rate').getByRole('row');
    this.meanTimeToRecoveryRows = this.page.getByTestId('Mean Time To Recovery').getByRole('row');
  }
  combineStrings(arr: string[]): string {
    return arr.join('');
  }

  async goToPreviousStep() {
    await this.previousButton.click();
  }

  async checkDoraMetricsReportDetails() {
    await expect(this.page.getByTestId('Deployment Frequency').getByRole('row').nth(2)).toContainText(
      this.combineStrings(['Deployment frequency', '6.60']),
    );

    await expect(this.leadTimeForChangesRows.nth(2)).toContainText(this.combineStrings(['PR Lead Time', '6.12']));
    await expect(this.leadTimeForChangesRows.nth(3)).toContainText(this.combineStrings(['Pipeline Lead Time', '0.50']));
    await expect(this.leadTimeForChangesRows.nth(4)).toContainText(this.combineStrings(['Total Lead Time', '6.62']));

    await expect(this.leadTimeForChangesRows.nth(4)).toContainText(this.combineStrings(['Total Lead Time', '6.62']));

    await expect(this.changeFailureRateRows.nth(2)).toContainText(
      this.combineStrings(['Failure rate', '17.50%(7/40)']),
    );

    await expect(this.meanTimeToRecoveryRows.nth(2)).toContainText(
      this.combineStrings(['Mean Time To Recovery', '1.90']),
    );
  }

  async checkDoraMetricsDetails(projectCreationType: ProjectCreationType) {
    await this.showMoreLinks.nth(1).click();
    if (
      projectCreationType === ProjectCreationType.IMPORT_PROJECT_FROM_FILE ||
      projectCreationType === ProjectCreationType.CREATE_A_NEW_PROJECT
    ) {
      await this.checkDoraMetricsReportDetails();
    } else {
      throw Error('The board detail type is not correct, please give a correct one.');
    }
    await downloadFileAndCheck(this.page, this.exportPipelineDataButton, 'pipelineData.csv', async (fileDataString) => {
      const localCsvFile = fs.readFileSync(path.resolve(__dirname, '../../fixtures/createNew/pipelineData.csv'));
      const localCsv = parse(localCsvFile);
      const downloadCsv = parse(fileDataString);

      expect(localCsv).toStrictEqual(downloadCsv);
    });
    await this.backButton.click();
  }

  async confirmGeneratedReport() {
    await expect(this.page.getByRole('alert')).toContainText('Help Information', { timeout: E2E_EXPECT_CI_TIMEOUT });
    await expect(this.page.getByRole('alert')).toContainText(
      'The file will expire in 30 minutes, please download it in time.',
    );
  }

  async checkBoardMetrics(
    velocity: string,
    throughPut: string,
    averageCycleTimeForSP: string,
    averageCycleTimeForCard: string,
  ) {
    await expect(this.velocityPart).toContainText(`${velocity}Velocity(Story Point)`);
    await expect(this.velocityPart).toContainText(`${throughPut}Throughput(Cards Count)`);
    await expect(this.averageCycleTimeForSP).toContainText(`${averageCycleTimeForSP}Average Cycle Time(Days/SP)`);
    await expect(this.averageCycleTimeForCard).toContainText(`${averageCycleTimeForCard}Average Cycle Time(Days/Card)`);
  }

  async checkBoardMetricsReportReportDetail() {
    await expect(this.velocityRows.filter({ hasText: 'Velocity(Story Point)' }).getByRole('cell').nth(1)).toContainText(
      '17',
    );
    await expect(
      this.velocityRows.filter({ hasText: 'Throughput(Cards Count)' }).getByRole('cell').nth(1),
    ).toContainText('9');

    await expect(this.cycleTimeRows.nth(0).getByRole('cell').nth(1)).toContainText('4.86(Days/SP)');
    await expect(this.cycleTimeRows.filter({ hasText: 'Average cycle time' }).getByRole('cell').nth(1)).toContainText(
      '4.86(Days/SP)',
    );
    await expect(this.cycleTimeRows.nth(1).getByRole('cell').nth(0)).toContainText('9.18(Days/Card)');
    await expect(
      this.cycleTimeRows.filter({ hasText: 'Total development time / Total cycle time' }).getByRole('cell').nth(1),
    ).toContainText('37.55%');
    await expect(
      this.cycleTimeRows
        .filter({ hasText: 'Total waiting for testing time / Total cycle time' })
        .getByRole('cell')
        .nth(1),
    ).toContainText('10.92%');
    await expect(
      this.cycleTimeRows.filter({ hasText: 'Total block time / Total cycle time' }).getByRole('cell').nth(1),
    ).toContainText('19.96%');
    await expect(
      this.cycleTimeRows.filter({ hasText: 'Total review time / Total cycle time' }).getByRole('cell').nth(1),
    ).toContainText('22.47%');
    await expect(
      this.cycleTimeRows.filter({ hasText: 'Total testing time / Total cycle time' }).getByRole('cell').nth(1),
    ).toContainText('9.1%');
    await expect(
      this.cycleTimeRows.filter({ hasText: 'Average development time' }).getByRole('cell').nth(1),
    ).toContainText('1.83(Days/SP)');
    await expect(this.cycleTimeRows.nth(8).getByRole('cell').nth(0)).toContainText('3.45(Days/Card)');
    await expect(
      this.cycleTimeRows.filter({ hasText: 'Average waiting for testing time' }).getByRole('cell').nth(1),
    ).toContainText('0.53(Days/SP)');
    await expect(this.cycleTimeRows.nth(10).getByRole('cell').nth(0)).toContainText('1.00(Days/Card)');
    await expect(this.cycleTimeRows.filter({ hasText: 'Average block time' }).getByRole('cell').nth(1)).toContainText(
      '0.97(Days/SP)',
    );
    await expect(this.cycleTimeRows.nth(12).getByRole('cell').nth(0)).toContainText('1.83(Days/Card)');
    await expect(this.cycleTimeRows.filter({ hasText: 'Average review time' }).getByRole('cell').nth(1)).toContainText(
      '1.09(Days/SP)',
    );
    await expect(this.cycleTimeRows.nth(14).getByRole('cell').nth(0)).toContainText('2.06(Days/Card)');
    await expect(this.cycleTimeRows.filter({ hasText: 'Average testing time' }).getByRole('cell').nth(1)).toContainText(
      '0.44(Days/SP)',
    );
    await expect(this.cycleTimeRows.nth(16).getByRole('cell').nth(0)).toContainText('0.84(Days/Card)');

    await expect(this.classificationRows.nth(1)).toContainText(this.combineStrings(['Spike', '11.11%']));
    await expect(this.classificationRows.nth(2)).toContainText(this.combineStrings(['Task', '88.89%']));
    await expect(this.classificationRows.nth(4)).toContainText(this.combineStrings(['ADM-322', '66.67%']));
    await expect(this.classificationRows.nth(5)).toContainText(this.combineStrings(['ADM-279', '22.22%']));
    await expect(this.classificationRows.nth(6)).toContainText(this.combineStrings(['ADM-319', '11.11%']));
    await expect(this.classificationRows.nth(8)).toContainText(this.combineStrings(['None', '100.00%']));
    await expect(this.classificationRows.nth(10)).toContainText(this.combineStrings(['1.0', '88.89%']));
    await expect(this.classificationRows.nth(11)).toContainText(this.combineStrings(['None', '11.11%']));
    await expect(this.classificationRows.nth(13)).toContainText(this.combineStrings(['Sprint 26', '11.11%']));
    await expect(this.classificationRows.nth(14)).toContainText(this.combineStrings(['Sprint 27', '100.00%']));
    await expect(this.classificationRows.nth(15)).toContainText(this.combineStrings(['Sprint 28', '88.89%']));
    await expect(this.classificationRows.nth(17)).toContainText(this.combineStrings(['Auto Dora Metrics', '100.00%']));
    await expect(this.classificationRows.nth(19)).toContainText(this.combineStrings(['None', '100.00%']));
    await expect(this.classificationRows.nth(21)).toContainText(this.combineStrings(['None', '100.00%']));
    await expect(this.classificationRows.nth(23)).toContainText(this.combineStrings(['Medium', '100.00%']));
    await expect(this.classificationRows.nth(25)).toContainText(this.combineStrings(['None', '100.00%']));
    await expect(this.classificationRows.nth(27)).toContainText(this.combineStrings(['Stream1', '44.44%']));
    await expect(this.classificationRows.nth(28)).toContainText(this.combineStrings(['Stream2', '55.56%']));
    await expect(this.classificationRows.nth(30)).toContainText(this.combineStrings(['None', '100.00%']));
    await expect(this.classificationRows.nth(32)).toContainText(this.combineStrings(['1.0', '44.44%']));
    await expect(this.classificationRows.nth(33)).toContainText(this.combineStrings(['2.0', '22.22%']));
    await expect(this.classificationRows.nth(34)).toContainText(this.combineStrings(['3.0', '33.33%']));
    await expect(this.classificationRows.nth(36)).toContainText(this.combineStrings(['Weiran Sun', '11.11%']));
    await expect(this.classificationRows.nth(37)).toContainText(this.combineStrings(['None', '88.89%']));
    await expect(this.classificationRows.nth(39)).toContainText(this.combineStrings(['None', '100.00%']));
    await expect(this.classificationRows.nth(41)).toContainText(this.combineStrings(['heartbeat user', '44.44%']));
    await expect(this.classificationRows.nth(42)).toContainText(this.combineStrings(['Junbo Dai', '11.11%']));
    await expect(this.classificationRows.nth(43)).toContainText(this.combineStrings(['Xinyi Wang', '11.11%']));
    await expect(this.classificationRows.nth(44)).toContainText(this.combineStrings(['Weiran Sun', '11.11%']));
    await expect(this.classificationRows.nth(45)).toContainText(this.combineStrings(['Xuebing Li', '11.11%']));
    await expect(this.classificationRows.nth(46)).toContainText(this.combineStrings(['Yunsong Yang', '11.11%']));
  }

  async checkBoardMetricsDetails(boardDetailType: ProjectCreationType, csvCompareLines: number) {
    await this.showMoreLinks.first().click();
    if (
      boardDetailType === ProjectCreationType.IMPORT_PROJECT_FROM_FILE ||
      boardDetailType === ProjectCreationType.CREATE_A_NEW_PROJECT
    ) {
      await this.checkBoardMetricsReportReportDetail();
    } else {
      throw Error('The board detail type is not correct, please give a correct one.');
    }

    await downloadFileAndCheck(this.page, this.exportBoardData, 'boardData.csv', async (fileDataString) => {
      const localCsvFile = fs.readFileSync(path.resolve(__dirname, '../../fixtures/createNew/boardData.csv'));
      const localCsv = parse(localCsvFile, { to: csvCompareLines });
      const downloadCsv = parse(fileDataString, { to: csvCompareLines });

      expect(localCsv).toStrictEqual(downloadCsv);
    });
    await this.backButton.click();
  }

  async checkDoraMetrics(
    prLeadTime: string,
    pipelineLeadTime: string,
    totalLeadTime: string,
    deploymentFrequency: string,
    failureRate: string,
    meanTimeToRecovery: string,
  ) {
    await expect(this.prLeadTime).toContainText(`${prLeadTime}PR Lead Time(Hours)`);
    await expect(this.pipelineLeadTime).toContainText(`${pipelineLeadTime}Pipeline Lead Time(Hours)`);
    await expect(this.totalLeadTime).toContainText(`${totalLeadTime}Total Lead Time(Hours)`);
    await expect(this.deploymentFrequency).toContainText(`${deploymentFrequency}Deployment Frequency(Deployments/Day)`);
    await expect(this.failureRate).toContainText(`${failureRate}Failure Rate`);
    await expect(this.meanTimeToRecovery).toContainText(`${meanTimeToRecovery}Mean Time To Recovery(Hours)`);
  }

  async checkMetricDownloadData() {
    await downloadFileAndCheck(this.page, this.exportMetricData, 'metricData.csv', async (fileDataString) => {
      const localCsvFile = fs.readFileSync(path.resolve(__dirname, '../../fixtures/createNew/metricData.csv'));
      const localCsv = parse(localCsvFile);
      const downloadCsv = parse(fileDataString);

      expect(localCsv).toStrictEqual(downloadCsv);
    });
  }

  async checkDownloadReports() {
    await checkDownloadReport(this.page, this.exportMetricData, 'metricReport.csv');
    // await checkDownloadReport(this.page, this.exportBoardData, 'boardReport.csv');
    await checkDownloadReport(this.page, this.exportPipelineDataButton, 'pipelineReport.csv');
  }

  async clickHomeIconThenBackToHomepage() {
    await this.homeIcon.click();
    await expect(this.page).toHaveURL(/\//);
  }
}
