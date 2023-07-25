class Report {
  readonly velocityTitle = () => cy.contains('Velocity')
  readonly cycleTimeTitle = () => cy.contains('Cycle time')
  readonly deploymentFrequencyTitle = () => cy.contains('Deployment frequency')
  readonly meanTimeToRecoveryTitle = () => cy.contains('Mean Time To Recovery')
  readonly backButton = () => cy.contains('Back')
  readonly exportPipelineDataButton = () => cy.contains('Export pipeline data')
  readonly exportBoardDataButton = () => cy.contains('Export board data')

  backToMetricsStep() {
    this.backButton().click()
  }

  exportPipelineData() {
    this.exportPipelineDataButton().click()
  }

  exportBoardData() {
    this.exportBoardDataButton().click()
  }
}

const reportPage = new Report()
export default reportPage
