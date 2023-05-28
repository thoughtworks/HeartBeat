class Report {
  readonly velocityTitle = () => cy.contains('Velocity')
  readonly cycleTimeTitle = () => cy.contains('Cycle time')
  readonly backButton = () => cy.contains('Back')

  backToMetricsStep() {
    this.backButton().click()
  }
}

const reportPage = new Report()
export default reportPage
