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
      'ATATT3xFfGF0unTtNR5KRKX8vphOU-gIQuA58BamZ5kmNiH02PH3bgf3kX6Q3zfhzX1kI550aBikflwEVHRf4WZIhj2ZePpXz0Bs9prL_zHfSHgpc1mqyOZu0L4Cnd3rAv5IAyEKtSkHKDDsIjYyS8ABs2E2kdMT-Cv8kUzecb-SnLixAC6Agy0=13633F73'
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

    cy.wait('@verifyJira').then((currentSubject) => {
      const users = currentSubject.response.body.users.join(', ')
      cy.contains(users).should('exist')
    })

    metricsPage.checkClassification()
    cy.contains('Classification Setting').should('exist')
  })
})
