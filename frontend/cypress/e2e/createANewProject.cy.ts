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
      'ATATT3xFfGF0nGqjCtadnxemCi2iYSertctaJCUH_ABcvChLFTRTCYKJKueXmOgcsRiemkigwCxbS25ueamOB7k36bt-ogNKvb4avXlteOoggQDVAj52FUPq7adbsbQLR5Jv3OnG2fOkzukWJtbCHxjTFFNhuQNRyqP5cZtHLy4UM9-WoPtMQ1E=93739245'
    )

    metricsPage.verifyJiraBoard()

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

    metricsPage.selectCrewSetting()
  })
})
