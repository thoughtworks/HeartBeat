class Report {
  get pageIndicator() {
    return cy.contains('Velocity', { timeout: 40000 })
  }
  get velocityTitle() {
    return cy.contains('Velocity')
  }

  get cycleTimeTitle() {
    return cy.contains('Cycle time')
  }

  get deploymentFrequencyTitle() {
    return cy.contains('Deployment frequency')
  }

  get meanTimeToRecoveryTitle() {
    return cy.contains('Mean Time To Recovery')
  }

  get backButton() {
    return cy.contains('Previous')
  }

  get saveButton() {
    return cy.contains('Save')
  }

  get exportMetricDataButton() {
    return cy.contains('Export metric data')
  }

  get exportPipelineDataButton() {
    return cy.contains('Export pipeline data')
  }

  get exportBoardDataButton() {
    return cy.contains('Export board data')
  }

  get firstNotification() {
    return cy.contains('The file needs to be exported within 30 minutes, otherwise it will expire.')
  }

  get headerBar() {
    return cy.get('[data-test-id="Header"]')
  }

  backToMetricsStep() {
    this.backButton.click({ force: true })
  }

  exportMetricData() {
    this.exportMetricDataButton.click()
  }

  exportPipelineData() {
    this.exportPipelineDataButton.click()
  }

  exportBoardData() {
    this.exportBoardDataButton.click()
  }

  exportProjectConfig() {
    this.saveButton.click({ force: true })
  }
}

const reportPage = new Report()
export default reportPage
