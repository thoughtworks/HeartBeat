import { BOARD_PROJECT_KEY, BOARD_TOKEN, MOCK_EMAIL, WEB_SITE } from '../fixtures/fixtures'
import homePage from '../pages/home'
import configPage from '../pages/metrics/config'
import metricsPage from '../pages/metrics/metrics'

describe('Create a new project', () => {
  it('Should create a new project manually', () => {
    homePage.navigate()

    homePage.createANewProject()
    cy.url().should('include', '/metrics')

    configPage.typeProjectName('E2E Project')

    configPage.selectDateRange()

    configPage.selectVelocityAndCycleTime()

    const verifyButton = () => cy.get('button:contains("Verify")')
    verifyButton().should('be.disabled')
    configPage.fillBoardFieldsInfo('2', MOCK_EMAIL, BOARD_PROJECT_KEY, WEB_SITE, BOARD_TOKEN)

    configPage.selectLeadTimeForChangesAndDeploymentFrequency()

    verifyButton().should('be.disabled')
    configPage.fillPipelineToolFieldsInfo('mock1234'.repeat(5))
    verifyButton().should('be.enabled')

    verifyButton().should('be.enabled')
    configPage.fillSourceControlFieldsInfo(`ghp_${'Abc123'.repeat(6)}`)

    configPage.selectClassificationAndCycleTime()

    configPage.goMetricsStep()
    cy.contains('Crews Setting').should('exist')
    cy.contains('Real Done').should('exist')

    cy.contains('Cycle Time Settings').should('exist')
    cy.contains('Consider the "Flag" as "Block"').should('exist')

    metricsPage.checkClassification()
    cy.contains('Classification Setting').should('exist')
  })
})
