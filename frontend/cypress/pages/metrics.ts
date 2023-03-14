class Metrics {
  navigate() {
    cy.visit(Cypress.env('url') + '/metrics')
  }
  typeProjectName(projectName: string) {
    cy.contains('Project Name').siblings().type(projectName)
  }

  selectDateRange() {
    cy.contains('From').parent().type('02052023')
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

  verifyJiraBoard() {
    cy.intercept(Cypress.env('url') + '/api/v1/boards/*', (req) => {
      req.url = req.url.replace('/v1/', '/v2/')
    }).as('verifyJira')

    cy.contains('Verify').click()
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
    cy.intercept(Cypress.env('url') + '/api/v1/source-control*', (req) => {
      req.url = req.url.replace('/v1/', '/v2/')
    })

    cy.contains("[data-testid='sourceControlTextField']", 'Token').type(token)
    cy.get('[data-test-id="sourceControlVerifyButton"]').click()
  }

  goMetricsStep() {
    cy.contains('Next').click()
  }

  checkClassification() {
    cy.contains('Distinguished By').siblings().click()

    cy.contains('All').click()
  }
}

const metricsPage = new Metrics()
export default metricsPage
