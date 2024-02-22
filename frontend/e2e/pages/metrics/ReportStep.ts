import { checkDownloadReport } from 'e2e/utils/download';
import { expect, Locator, Page } from '@playwright/test';

export class ReportStep {
  readonly page: Page;
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

  constructor(page: Page) {
    this.page = page;
    this.velocityPart = page.locator('[data-test-id="Velocity"] [data-test-id="report-section"]');
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
  }

  async goToPreviousStep() {
    await this.previousButton.click();
  }

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  async checkDoraMetricsDetails(snapshotPath: string) {
    await this.showMoreLinks.nth(1).click();
    //FIXME fix snapshot issue
    // await expect(this.page).toHaveScreenshot([snapshotPath]);
    await this.backButton.click();
  }

  async confirmGeneratedReport() {
    await expect(this.page.getByRole('alert')).toContainText('Help Information');
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

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  async checkBoardMetricsDetails(snapshotPath: string) {
    await this.showMoreLinks.first().click();
    //FIXME fix snapshot issue
    // await expect(this.page).toHaveScreenshot([snapshotPath]);
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

  async checkDownloadReports() {
    await checkDownloadReport(this.page, this.exportMetricData, 'metricReport.csv');
    await checkDownloadReport(this.page, this.exportBoardData, 'boardReport.csv');
    await checkDownloadReport(this.page, this.exportPipelineDataButton, 'pipelineReport.csv');
  }
}
