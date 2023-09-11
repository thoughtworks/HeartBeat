import { GITHUB_TOKEN } from '../fixtures/fixtures'
import homePage from '../pages/home'
import configPage from '../pages/metrics/config'
import metricsPage from '../pages/metrics/metrics'
import reportPage from '../pages/metrics/report'

const cycleTimeData = [
  { label: 'Name', value: 'Value' },
  { label: 'Average cycle time', value: '8.35(days/SP)' },
  { label: '9.55(days/card)' },
  { label: 'Total development time / Total cycle time', value: '0.62' },
  { label: 'Total waiting for testing time / Total cycle time', value: '0.02' },
  { label: 'Total block time / Total cycle time', value: '0.3' },
  { label: 'Total review time / Total cycle time', value: '0.04' },
  { label: 'Total testing time / Total cycle time', value: '0.01' },
  { label: 'Average development time', value: '5.18(days/SP)' },
  { label: '5.92(days/card)' },
  { label: 'Average waiting for testing time', value: '0.20(days/SP)' },
  { label: '0.23(days/card)' },
  { label: 'Average block time', value: '2.53(days/SP)' },
  { label: '2.89(days/card)' },
  { label: 'Average review time', value: '0.32(days/SP)' },
  { label: '0.37(days/card)' },
  { label: 'Average testing time', value: '0.12(days/SP)' },
  { label: '0.14(days/card)' },
]

const velocityData = [
  { label: 'Name', value: 'Value' },
  { label: 'Velocity(Story Point)', value: '16' },
  { label: 'Throughput(Cards Count)', value: '14' },
]

const metricsTextList = [
  'Crews setting',
  'Brian Ong',
  'Harsh Singal',
  'Prashant Agarwal',
  'Sumit Narang',
  'Yu Zhang',
  'Peihang Yu',
  'Mengyang Sun',
  'HanWei Wang',
  'Aaron Camilleri',
  'Qian Zhang',
  'Gerard Ho',
  'Anthony Tse',
  'Yonghee Jeon Jeon',
  'Cycle time settings',
  'Analysis',
  'To do',
  'In Dev',
  'Block',
  'Waiting for testing',
  'Testing',
  'Review',
  'Done',
  'Real done',
  'DONE, CLOSED',
  'Classification setting',
  'Issue Type',
  'Has Dependancies',
  'FS R&D Classification',
  'Parent',
  'Components',
  'Project',
  'Reporter',
  'Parent Link',
  'Fix versions',
  'Priority',
  'Paired Member',
  'Labels',
  'Story Points',
  'Sprint',
  'Epic Link',
  'Assignee',
  'FS Work Categorization',
  'FS Work Type',
  'Epic Name',
  'Acceptance Criteria',
  'Environment',
  'Affects versions',
  'FS Domains',
  'PIR Completed',
  'Team',
  'Incident Priority',
  'Resolution Details',
  'Time to Resolution - Hrs',
  'Time to Detect - Hrs',
  'Cause by - System',
  'Deployment frequency settings',
  'XXXX',
  'fs-platform-payment-selector',
  'RECORD RELEASE TO PROD',
  'Lead time for changes',
  'XXXX',
  'fs-platform-onboarding',
  'RECORD RELEASE TO PROD',
]

const configTextList = [
  'Project name *',
  'Velocity, Cycle time, Classification, Lead time for changes, Deployment frequency, Change failure rate, Mean time to recovery',
  'Classic Jira',
  'BuildKite',
  'GitHub',
]

const textInputValues = [
  { index: 0, value: 'E2E Project' },
  { index: 1, value: '09/01/2022' },
  { index: 2, value: '09/14/2022' },
  { index: 3, value: '1963' },
  { index: 4, value: 'test@test.com' },
  { index: 5, value: 'PLL' },
  { index: 6, value: 'site' },
]

const tokenInputValues = [
  { index: 0, value: 'mockToken' },
  { index: 1, value: 'mock1234'.repeat(5) },
  { index: 2, value: `${GITHUB_TOKEN}` },
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

const checkTimeToRecoveryPipelineCalculation = (testId: string) => {
  cy.get(testId).find('tr').contains('Mean Time To Recovery').should('exist')
}

const checkMeanTimeToRecovery = (testId: string) => {
  reportPage.meanTimeToRecoveryTitle().should('exist')
  checkTimeToRecoveryPipelineCalculation(testId)
}

const checkPipelineCSV = () => {
  cy.wait(2000)
  return cy.task('readDir', 'cypress/downloads').then((files) => {
    expect(files).to.match(new RegExp(/pipeline-data-.*\.csv/))
  })
}

const checkBoardCSV = () => {
  cy.wait(2000)
  return cy.task('readDir', 'cypress/downloads').then((files) => {
    expect(files).to.match(new RegExp(/board-data-.*\.csv/))
  })
}

const checkFieldsExist = (fields: string[]) => {
  fields.forEach((item) => {
    cy.contains(item).should('exist')
  })
}

const checkTextInputValuesExist = (fields: { index: number; value: string }[]) => {
  fields.forEach(({ index, value }) => {
    cy.get('.MuiInputBase-root input[type="text"]').eq(index).should('have.value', value)
  })
}

const checkTokenInputValuesExist = (fields: { index: number; value: string }[]) => {
  fields.forEach(({ index, value }) => {
    cy.get('[type="password"]').eq(index).should('have.value', value)
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

    cy.wait(6000)
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

    cy.wait(20000)

    checkVelocity('[data-test-id="Velocity"]', velocityData)

    checkCycleTime('[data-test-id="Cycle time"]', cycleTimeData)

    checkDeploymentFrequency('[data-test-id="Deployment frequency"]')

    checkMeanTimeToRecovery('[data-test-id="Mean Time To Recovery"]')

    reportPage.exportPipelineDataButton().should('be.enabled')

    reportPage.exportPipelineData()

    checkPipelineCSV()

    reportPage.exportBoardDataButton().should('be.enabled')

    reportPage.exportBoardData()

    checkBoardCSV()
  })

  it('Should have data in metrics page when back from report page', () => {
    homePage.navigate()

    homePage.createANewProject()

    configPage.typeProjectName('E2E Project')

    configPage.goHomePage()

    homePage.createANewProject()

    configPage.typeProjectName('E2E Project')

    configPage.selectDateRange()

    configPage.selectMetricsData()

    configPage.fillBoardInfoAndVerifyWithClassicJira('1963', 'test@test.com', 'PLL', 'site', 'mockToken')

    configPage.fillPipelineToolFieldsInfoAndVerify('mock1234'.repeat(5))

    configPage.fillSourceControlFieldsInfoAndVerify(`${GITHUB_TOKEN}`)

    configPage.goMetricsStep()

    metricsPage.checkCycleTime()

    metricsPage.checkRealDone()

    metricsPage.checkClassification()

    metricsPage.checkDeploymentFrequencySettings()

    metricsPage.checkLeadTimeForChanges()

    checkFieldsExist(metricsTextList)

    metricsPage.goReportStep()

    cy.wait(10000)

    reportPage.backToMetricsStep()

    checkFieldsExist(metricsTextList)
  })

  it('Should have data in config page when back from metrics page', () => {
    homePage.navigate()

    homePage.createANewProject()

    configPage.typeProjectName('E2E Project')

    configPage.goHomePage()

    homePage.createANewProject()

    configPage.typeProjectName('E2E Project')

    configPage.selectDateRange()

    configPage.selectMetricsData()

    configPage.fillBoardInfoAndVerifyWithClassicJira('1963', 'test@test.com', 'PLL', 'site', 'mockToken')

    configPage.fillPipelineToolFieldsInfoAndVerify('mock1234'.repeat(5))

    configPage.fillSourceControlFieldsInfoAndVerify(`${GITHUB_TOKEN}`)

    configPage.goMetricsStep()

    metricsPage.BackToConfigStep()

    checkFieldsExist(configTextList)

    checkTextInputValuesExist(textInputValues)

    checkTokenInputValuesExist(tokenInputValues)
  })
})
