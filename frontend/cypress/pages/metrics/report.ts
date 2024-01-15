class Report {
  get pageIndicator() {
    return cy.get('[data-test-id="report-section"]', { timeout: 60000 });
  }

  get dateRange() {
    return cy.get('[data-test-id="date-range"]');
  }

  get meanTimeToRecoveryTitle() {
    return cy.contains('Mean Time To Recovery');
  }

  get previousButton() {
    return cy.contains('Previous');
  }

  get saveButton() {
    return cy.contains('Save');
  }

  get exportMetricDataButton() {
    return cy.contains('Export metric data');
  }

  get exportPipelineDataButton() {
    return cy.contains('Export pipeline data');
  }

  get exportBoardDataButton() {
    return cy.contains('Export board data');
  }

  get firstNotification() {
    return cy.contains('The file will expire in 30 minutes, please download it in time.');
  }

  get showMoreBoardButton() {
    return cy.contains('Board Metrics').parent().siblings().eq(0);
  }

  get showMoreDoraButton() {
    return cy.contains('DORA Metrics').parent().siblings().eq(0);
  }

  get backButton() {
    return cy.contains('Back');
  }

  boardGoToReportPage() {
    this.previousButton.click();
  }

  doraGoToReportPage() {
    this.backButton.click();
  }

  goToBoardDetailPage() {
    this.showMoreBoardButton.click();
  }

  goToDoraDetailPage() {
    this.showMoreDoraButton.click();
  }

  backToMetricsStep() {
    this.previousButton.click({ force: true });
  }

  exportMetricData() {
    this.exportMetricDataButton.click();
  }

  exportPipelineData() {
    this.exportPipelineDataButton.click();
  }

  exportBoardData() {
    this.exportBoardDataButton.click();
  }

  exportProjectConfig() {
    this.saveButton.click({ force: true });
  }

  checkDateRange = () => {
    this.dateRange.contains('2022/09/01');
    this.dateRange.contains('2022/09/14');
  };
}

const reportPage = new Report();
export default reportPage;
