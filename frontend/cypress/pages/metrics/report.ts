class Report {
  get pageIndicator() {
    return cy.get('[data-test-id="report-section"]', { timeout: 60000 });
  }

  get meanTimeToRecoveryTitle() {
    return cy.contains('Mean Time To Recovery');
  }

  get backButton() {
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
    return cy.contains('The file needs to be exported within 30 minutes, otherwise it will expire.');
  }

  get showMoreBoardButton() {
    return cy.contains('Board Metrics').parent().siblings().eq(0);
  }

  get showMoreDoraButton() {
    return cy.contains('DORA Metrics').parent().siblings().eq(0);
  }

  get topBackButton() {
    return cy.contains('Back');
  }

  boardGoToReportPage() {
    this.topBackButton.click();
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
    this.backButton.click({ force: true });
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
}

const reportPage = new Report();
export default reportPage;
