class Metrics {
  navigate() {
    cy.visit(Cypress.env('url') + '/metrics')
  }
  typeProjectName(projectName: string) {
    cy.contains('Project Name').siblings().type(projectName)
  }

  selectDateRange(from: string, to: string) {
    cy.contains('From').parent().find('button').click()
    cy.get('.MuiPickersPopper-root').find('button').contains(from).click()

    cy.contains('To').parent().find('button').click()
    cy.get('.MuiPickersPopper-root').find('button').contains(to).click()
  }

  selectVelocityAndCycleTime() {
    cy.contains('Required Data').siblings().click()

    cy.contains('Velocity').click()
    cy.contains('Cycle time').click()

    cy.get('div.MuiBackdrop-root.MuiBackdrop-invisible.MuiModal-backdrop').click({ force: true })
  }

  fillBoardFieldsInfo(boardId: string, email: string, projectKey: string, site: string, token: string) {
    cy.contains('Board Id').siblings().type(boardId)
    cy.contains('Email').siblings().type(email)
    cy.contains('Project Key').siblings().type(projectKey)
    cy.contains('Site').siblings().type(site)
    cy.contains('Token').siblings().type(token)
  }

  selectLeadTimeForChangesAndDeploymentFrequency() {
    cy.contains('Required Data').siblings().click()
    cy.get("[type='checkbox']").uncheck()

    cy.contains('Lead time for changes').click()
    cy.contains('Deployment frequency').click()

    cy.get('div.MuiBackdrop-root.MuiBackdrop-invisible.MuiModal-backdrop').click({ force: true })
  }

  fillPipelineToolFieldsInfo(token: string) {
    cy.contains('Token').siblings().type(token)
  }

  fillSourceControlFieldsInfo(token: string) {
    cy.get('[data-test-id="sourceControlVerifyButton"]').should('be.disabled')

    cy.contains("[data-testid='sourceControlTextField']", 'Token').type(token)
  }

  goMetricsStep() {
    cy.contains('Next').click()
  }
}

const metricsPage = new Metrics()
export default metricsPage
