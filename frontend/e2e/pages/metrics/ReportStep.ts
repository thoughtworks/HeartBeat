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
  readonly backButton: Locator;

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
    this.backButton = this.page.getByText('Back');
  }

  async checkDoraMetricsDetails(snapshotPath: string) {
    await this.showMoreLinks.nth(1).click();
    // await this.page.screenshot({ path: snapshotPath, fullPage: true });
    await expect(this.page).toHaveScreenshot(snapshotPath);
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

  async checkBoardMetricsDetails(snapshotPath: string) {
    await this.showMoreLinks.first().click();
    // await this.page.screenshot({ path: snapshotPath, fullPage: true });
    await expect(this.page).toHaveScreenshot(snapshotPath);
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
}
