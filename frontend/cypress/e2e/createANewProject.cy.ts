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
      'fengxin.hou@thoughtworks.com',
      'ADM',
      'dorametrics',
      'gBEhWpvsCTcs5gtIC8T4A299'
    )

    metricsPage.verifyJiraBoard()
    // cy.contains('Verified').should('exist')
    // cy.contains('Reset').should('exist')

    metricsPage.selectLeadTimeForChangesAndDeploymentFrequency()

    cy.get('button:contains("Verify")').should('be.disabled')
    metricsPage.fillPipelineToolFieldsInfo('mockTokenMockTokenMockTokenMockToken1234')
    cy.get('button:contains("Verify")').should('be.enabled')

    cy.get('button:contains("Verify")').should('be.enabled')
    metricsPage.fillSourceControlFieldsInfo('ghp_TSCfmn4H187rDN7JGgp5RAe7mM6YPp0xz987')

    metricsPage.goMetricsStep()
    cy.contains('Crews Setting').should('exist')

    cy.wait('@verifyJira').then((currentSubject) => {
      const users = currentSubject.response.body.users.join(', ')
      cy.contains(users).should('exist')
    })

    metricsPage.checkClassification()
    cy.contains('Classification Setting').should('exist')
  })
})
