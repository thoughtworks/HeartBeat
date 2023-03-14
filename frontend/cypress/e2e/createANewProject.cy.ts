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
    metricsPage.fillBoardFieldsInfo(
      '2',
      'yichen.wang@thoughtworks.com',
      'ADM',
      'dorametrics',
      'ATATT3xFfGF03OlHSTc8WWEjk6T0NapBqrdUHBgHj9Vo2Ph93i4iUWvtdyG5XN_SHFBxvk9L6RFkTTsQOtUiFWSy_Cs_Z42W4AiV-3X6mrmPmoGlUw9Fn7e59f2xDABePfRPBu0fMdr6V2EUe3WEmbWa30ycrekrx_qPcu__shUyjMZa7qyWKE8=A3605AD8'
    )

    metricsPage.verifyJiraBoard()
    cy.contains('Verified').should('exist')
    cy.contains('Reset').should('exist')

    metricsPage.selectLeadTimeForChangesAndDeploymentFrequency()

    cy.get('button:contains("Verify")').should('be.disabled')
    metricsPage.fillPipelineToolFieldsInfo('mockTokenMockTokenMockTokenMockToken1234')
    cy.get('button:contains("Verify")').should('be.enabled')

    cy.get('button:contains("Verify")').should('be.enabled')
    metricsPage.fillSourceControlFieldsInfo('ghp_TSCfmn4H187rDN7JGgp5RAe7mM6YPp0xz987')

    metricsPage.goMetricsStep()
    cy.contains('Crews Setting').should('exist')

    metricsPage.checkClassification()
    cy.contains('Classification Setting').should('exist')
  })
})
