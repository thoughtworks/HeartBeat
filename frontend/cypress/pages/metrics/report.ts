class Report {
  readonly velocityTitle = () => cy.contains('Velocity')
  readonly cycleTimeTitle = () => cy.contains('Cycle time')
  readonly deploymentFrequencyTitle = () => cy.contains('Deployment frequency')
  readonly meanTimeToRecoveryTitle = () => cy.contains('Mean Time To Recovery')
  readonly backButton = () => cy.contains('Previous')
  readonly exportMetricDataButton = () => cy.contains('Export metric data')
  readonly exportPipelineDataButton = () => cy.contains('Export pipeline data')
  readonly exportBoardDataButton = () => cy.contains('Export board data')
  readonly firstNotification = () =>
    cy.contains('The file needs to be exported within 30 minutes, otherwise it will expire.')

  private readonly headerBar = () => cy.get('[data-test-id="Header"]')

  private readonly progressBar = () => cy.get('[data-testid="loading-page"]', { timeout: 60000 })

  backToMetricsStep() {
    this.backButton().click()
  }

  exportMetricData() {
    this.exportMetricDataButton().click()
  }

  exportPipelineData() {
    this.exportPipelineDataButton().click()
  }

  exportBoardData() {
    this.exportBoardDataButton().click()
  }

  checkNotification() {
    cy.contains('otherwise it will expire.').should('exist')

    cy.wait(10000)

    cy.contains('otherwise it will expire.').should('not.exist')

    this.headerBar().click()
  }

  waitingForProgressBar() {
    this.progressBar().should('be.visible')
    this.progressBar().should('not.exist')
  }
}

const reportPage = new Report()
export default reportPage
