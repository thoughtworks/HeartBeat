import { GITHUB_TOKEN, PIPELINE_CSV_HEADERS } from '../fixtures/fixtures'
import homePage from '../pages/home'
import configPage from '../pages/metrics/config'
import metricsPage from '../pages/metrics/metrics'
import reportPage from '../pages/metrics/report'

const cycleTimeData = [
  { label: 'Name', value: 'Value' },
  { label: 'Average cycle time', value: '6.71(days/SP)' },
  { label: '8.39(days/card)' },
  { label: 'Total development time / Total cycle time', value: '0.64' },
  { label: 'Total waiting for testing time / Total cycle time', value: '0.02' },
  { label: 'Total block time / Total cycle time', value: '0.28' },
  { label: 'Total review time / Total cycle time', value: '0.04' },
  { label: 'Total testing time / Total cycle time', value: '0.01' },
  { label: 'Average development time', value: '4.32(days/SP)' },
  { label: '5.4(days/card)' },
  { label: 'Average waiting for testing time', value: '0.16(days/SP)' },
  { label: '0.2(days/card)' },
  { label: 'Average block time', value: '1.88(days/SP)' },
  { label: '2.35(days/card)' },
  { label: 'Average review time', value: '0.26(days/SP)' },
  { label: '0.32(days/card)' },
  { label: 'Average testing time', value: '0.1(days/SP)' },
  { label: '0.12(days/card)' },
]
const velocityData = [
  { label: 'Name', value: 'Value' },
  { label: 'Velocity(Story Point)', value: '20' },
  { label: 'Throughput(Cards Count)', value: '16' },
]

interface BoardDataItem {
  label: string
  value?: string
}

const checkBoardCalculation = (testId: string, boardData: BoardDataItem[]) => {
  cy.get(testId)
    .find('tr')
    .each((row, index) => {
      cy.wrap(row).within(() => {
        cy.contains(boardData[index].label).should('exist')
        if (boardData[index].value) {
          cy.contains(boardData[index].value).should('exist')
        }
      })
    })
}

const checkPipelineCalculation = (testId: string) => {
  cy.get(testId).find('tr').contains('Deployment frequency(deployments/day)').should('exist')
}

const checkDeploymentFrequency = (testId: string) => {
  reportPage.deploymentFrequencyTitle().should('exist')
  checkPipelineCalculation(testId)
}

const checkVelocity = (testId: string, velocityData: BoardDataItem[]) => {
  reportPage.velocityTitle().should('exist')
  checkBoardCalculation(testId, velocityData)
}

const checkCycleTime = (testId: string, cycleTimeData: BoardDataItem[]) => {
  reportPage.cycleTimeTitle().should('exist')
  checkBoardCalculation(testId, cycleTimeData)
}

const getCurrentPipelineCSVs = () => {
  return new Cypress.Promise((resolve) => {
    cy.exec('ls ./cypress/downloads').then((result) => {
      const fileList = result.stdout.trim().split('\n')
      const csvList = fileList.filter((file) => file.startsWith('pipeline-data-') && file.endsWith('.csv'))
      resolve(csvList)
    })
  })
}

const checkPipelineCSV = (previousPipelineCSV, currentPipelineCSV) => {
  Promise.all([previousPipelineCSV, currentPipelineCSV]).then(([previous, current]) => {
    expect(previous.length + 1).equals(current.length)
    const latestFile = current[current.length - 1]
    cy.readFile(`./cypress/downloads/${latestFile}`).then((fileContent) => {
      expect(fileContent).to.include(PIPELINE_CSV_HEADERS)
    })
  })
}

describe('Create a new project', () => {
  it('Should create a new project manually', () => {
    homePage.navigate()

    homePage.createANewProject()
    cy.url().should('include', '/metrics')

    configPage.typeProjectName('E2E Project')

    configPage.goHomePage()

    homePage.createANewProject()
    cy.contains('Project name *').should('have.value', '')

    configPage.typeProjectName('E2E Project')

    configPage.selectDateRange()

    const nextButton = () => cy.get('button:contains("Next")')
    nextButton().should('be.disabled')

    configPage.selectMetricsData()

    configPage.fillBoardInfoAndVerifyWithClassicJira('1963', 'test@test.com', 'PLL', 'site', 'mockToken')

    cy.contains('Verified').should('exist')
    cy.contains('Reset').should('exist')

    configPage.fillPipelineToolFieldsInfoAndVerify('mock1234'.repeat(5))

    configPage.fillSourceControlFieldsInfoAndVerify(`${GITHUB_TOKEN}`)

    nextButton().should('be.enabled')

    configPage.CancelBackToHomePage()

    configPage.goMetricsStep()

    nextButton().should('be.disabled')

    cy.contains('Crews setting').should('exist')

    cy.contains('Cycle time settings').should('exist')

    metricsPage.checkCycleTime()

    cy.contains('Real done').should('exist')

    metricsPage.checkRealDone()

    metricsPage.checkClassification()

    metricsPage.checkDeploymentFrequencySettings()

    metricsPage.checkLeadTimeForChanges()

    nextButton().should('be.enabled')

    metricsPage.goReportStep()

    cy.wait(10000)

    checkVelocity('[data-test-id="Velocity"]', velocityData)

    checkCycleTime('[data-test-id="Cycle time"]', cycleTimeData)

    checkDeploymentFrequency('[data-test-id="Deployment frequency"]')

    reportPage.exportPipelineDataButton().should('be.enabled')

    const previousPipelineCSV = getCurrentPipelineCSVs()

    reportPage.exportPipelineData()

    const currentPipelineCSV = getCurrentPipelineCSVs()

    checkPipelineCSV(previousPipelineCSV, currentPipelineCSV)
  })
})
