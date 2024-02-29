import { checkDownloadReport, downloadFileAndCheck } from 'e2e/utils/download';
import { expect, Locator, Page } from '@playwright/test';

import { E2E_EXPECT_TIMEOUT } from '../../fixtures';
import { parse } from 'csv-parse/sync';
import path from 'path';
import fs from 'fs';

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
  }

  async goToPreviousStep() {
    await this.previousButton.click();
  }

  async checkDoraMetricsDetails(snapshotPath: string) {
    await this.showMoreLinks.nth(1).click();
    await expect(this.page).toHaveScreenshot(snapshotPath, {
      fullPage: true,
      mask: [this.pageHeader],
    });
    await downloadFileAndCheck(this.page, this.exportPipelineDataButton, 'pipelineData.csv', async (fileDataString) => {
      const localCsvFile = fs.readFileSync(path.resolve(__dirname, '../../fixtures/createNew/pipelineData.csv'));
      const localCsv = parse(localCsvFile);
      const downloadCsv = parse(fileDataString);

      expect(localCsv).toStrictEqual(downloadCsv);
    });
    await this.backButton.click();
  }

  async confirmGeneratedReport() {
    await expect(this.page.getByRole('alert')).toContainText('Help Information', { timeout: E2E_EXPECT_TIMEOUT * 3 });
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

  async checkBoardMetricsDetails(snapshotPath: string, csvCompareLines: number) {
    await this.showMoreLinks.first().click();
    await expect(this.page).toHaveScreenshot(snapshotPath, {
      fullPage: true,
      mask: [this.pageHeader],
    });
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
