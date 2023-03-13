import homePage from '../pages/home'
import metricsPage from '../pages/metrics'

describe('Create a new project', () => {
  it('Should create a new project manually', () => {
    homePage.navigate()

    homePage.createANewProject()
    cy.url().should('include', '/metrics')

    metricsPage.typeProjectName('E2E Project')

    const today = new Date()
    const day = today.getDate()
    metricsPage.selectDateRange(`${day}`, `${day + 1}`)

    metricsPage.selectVelocityAndCycleTime()

    cy.get('button:contains("Verify")').should('be.disabled')
    metricsPage.fillBoardFieldsInfo('2', 'mockEmail@qq.com', 'mockKey', '1', 'mockToken')
    cy.get('button:contains("Verify")').should('be.enabled')

    metricsPage.selectLeadTimeForChangesAndDeploymentFrequency()

    cy.get('button:contains("Verify")').should('be.disabled')
    metricsPage.fillPipelineToolFieldsInfo('mockTokenMockTokenMockTokenMockToken1234')
    cy.get('button:contains("Verify")').should('be.enabled')

    cy.get('button:contains("Verify")').should('be.enabled')
    metricsPage.fillSourceControlFieldsInfo('ghpghoghughsghr_1A2b1A2b1A2b1A2b1A2b1A2b1A2b1A2b1A2b')

    metricsPage.goMetricsStep()
    cy.contains('Crews Setting').should('exist')

    metricsPage.checkClassification()
    cy.contains('Classification Setting').should('exist')
  })
})
