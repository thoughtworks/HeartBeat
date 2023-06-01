class Report {
  readonly velocityTitle = () => cy.contains('Velocity')
  readonly cycleTimeTitle = () => cy.contains('Cycle time')
  readonly deploymentFrequencyTitle = () => cy.contains('Deployment frequency')
  readonly backButton = () => cy.contains('Back')
  readonly exportPipelineDataButton = () => cy.contains('Export pipeline data')

  backToMetricsStep() {
    this.backButton().click()
  }

  exportPipelineData() {
    this.exportPipelineDataButton().click()
  }
}

const reportPage = new Report()
export default reportPage
