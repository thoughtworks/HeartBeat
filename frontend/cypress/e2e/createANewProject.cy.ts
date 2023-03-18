import homePage from '../pages/home'
import metricsPage from '../pages/metrics'

describe('Create a new project', () => {
  it('Should create a new project manually', () => {
    homePage.navigate()

    homePage.createANewProject()
    cy.url().should('include', '/metrics')

    metricsPage.typeProjectName('E2E Project')

    metricsPage.selectDateRange()

    metricsPage.selectVelocityAndCycleTime()

    cy.get('button:contains("Verify")').should('be.disabled')
    metricsPage.fillBoardFieldsInfo('2', 'test@test.com', 'mockProjectKey', 'mockSite', 'mockToken')

    metricsPage.selectLeadTimeForChangesAndDeploymentFrequency()

    cy.get('button:contains("Verify")').should('be.disabled')
    metricsPage.fillPipelineToolFieldsInfo('mock1234'.repeat(5))
    cy.get('button:contains("Verify")').should('be.enabled')

    cy.get('button:contains("Verify")').should('be.enabled')
    metricsPage.fillSourceControlFieldsInfo(`ghp_${'Abc123'.repeat(6)}`)

    metricsPage.selectClassificationAndCycleTime()

    metricsPage.goMetricsStep()
    cy.contains('Crews Setting').should('exist')
    cy.contains('Real Done').should('exist')

    cy.contains('Cycle Time Settings').should('exist')
    cy.contains('Consider the "Flag" as "Block"').should('exist')

    metricsPage.checkClassification()
    cy.contains('Classification Setting').should('exist')
  })
})
