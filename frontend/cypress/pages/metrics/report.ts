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

  readonly notificationButton = () => cy.get('[data-testid="NotificationIcon"]')

  private readonly headerBar = () => cy.get('[data-test-id="Header"]')

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
    this.notificationButton().click()
    cy.contains('otherwise it will expire.').should('exist')

    cy.get('[data-test-id="Header"]').click()
    cy.contains('otherwise it will expire.').should('not.exist')

    this.notificationButton().click()
    cy.contains('otherwise it will expire.').should('exist')

    this.notificationButton().click()
    cy.contains('otherwise it will expire.').should('not.exist')

    this.headerBar().click()
  }
}

const reportPage = new Report()
export default reportPage
