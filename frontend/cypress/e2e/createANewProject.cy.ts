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
      'ATATT3xFfGF0l6-5kYk1njoYNCYUp26y57ItyW3pjyt2UpmD_-CZmCPG2AD1ZpK1yPRceD2wJKXMnTI1J2TLyOceT4qxNu9tB3m49-owSU4Fc8EsmognR5PBHoXRQ9uiMW6e4TOsOjPDzrwNO-UKZ0WZo9vYQp9K8jzTS3gWk8qV1EqtV5dHpA0=F154B9B0'
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
