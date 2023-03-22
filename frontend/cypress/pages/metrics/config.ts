class Config {
  navigate() {
    cy.visit(Cypress.env('url') + '/metrics')
  }

  goHomePage() {
    cy.contains('Back').click()
    cy.contains('Yes').click()

    cy.url().should('include', '/home')
  }

  typeProjectName(projectName: string) {
    cy.contains('Project Name *').siblings().first().type(projectName)
  }

  selectDateRange() {
    cy.contains('From').parent().type('02052023')
  }

  selectMetricsData() {
    cy.contains('Required Data').siblings().click()

    cy.contains('Lead time for changes').click()
    cy.contains('Deployment frequency').click()

    cy.get('div.MuiBackdrop-root.MuiBackdrop-invisible.MuiModal-backdrop').click({ force: true })
  }

  fillPipelineToolFieldsInfoAndVerify(token: string) {
    cy.contains("[data-testid='pipelineToolTextField']", 'Token').type(token)

    cy.get('[data-test-id="pipelineVerifyButton"]').click()
  }

  fillSourceControlFieldsInfoAndVerify(token: string) {
    cy.contains("[data-testid='sourceControlTextField']", 'Token').type(token)

    cy.get('[data-test-id="sourceControlVerifyButton"]').click()
  }

  CancelBackToHomePage() {
    cy.contains('Back').click()
    cy.contains('Cancel').click()
  }

  goMetricsStep() {
    cy.contains('Next').click()
  }
}

const configPage = new Config()
export default configPage
