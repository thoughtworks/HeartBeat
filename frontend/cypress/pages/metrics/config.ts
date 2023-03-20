class Config {
  navigate() {
    cy.visit(Cypress.env('url') + '/metrics')
  }
  typeProjectName(projectName: string) {
    cy.contains('Project Name *').siblings().first().type(projectName)
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
    cy.contains('Board Id').siblings().first().type(boardId)
    cy.contains('Email').siblings().first().type(email)
    cy.contains('Project Key').siblings().first().type(projectKey)
    cy.contains('Site').siblings().first().type(site)
    cy.contains('Token').siblings().first().type(token)
  }

  selectLeadTimeForChangesAndDeploymentFrequency() {
    cy.contains('Required Data').siblings().first().click()
    cy.get("[type='checkbox']").uncheck()

    cy.contains('Lead time for changes').click()
    cy.contains('Deployment frequency').click()

    cy.get('div.MuiBackdrop-root.MuiBackdrop-invisible.MuiModal-backdrop').click({ force: true })
  }

  fillPipelineToolFieldsInfo(token: string) {
    cy.contains('Token').siblings().first().type(token)
  }

  fillSourceControlFieldsInfo(token: string) {
    cy.contains("[data-testid='sourceControlTextField']", 'Token').type(token)
    cy.get('[data-test-id="sourceControlVerifyButton"]').click()
  }

  selectClassificationAndCycleTime() {
    cy.contains('Required Data').siblings().first().click()
    cy.get("[type='checkbox']").uncheck()

    cy.contains('Classification').click()
    cy.contains('Cycle time').click()

    cy.get('div.MuiBackdrop-root.MuiBackdrop-invisible.MuiModal-backdrop').click({ force: true })
  }

  goMetricsStep() {
    cy.contains('Next').click()
  }
}

const configPage = new Config()
export default configPage
