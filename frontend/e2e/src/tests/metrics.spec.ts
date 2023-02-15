import { test, expect } from '../fixtures'

test('should render metrics page', async ({ homePage }) => {
  await homePage.createNewProject()

  expect(homePage.page.url()).toContain('metrics')

  homePage.close()
})

test('happy path to fill metrics config', async ({ metricsPage }) => {
  await metricsPage.checkSteps()

  await expect(metricsPage.projectNameInput).toBeTruthy()

  await metricsPage.typeProjectName('test Project Name')

  await expect(metricsPage.collectionDate).toBeVisible()
  await expect(metricsPage.regularCalendar).toBeChecked()
  await expect(metricsPage.chinaCalendar).not.toBeChecked()

  await metricsPage.selectRegularCalendar()

  await metricsPage.selectDateRange()

  await metricsPage.selectVelocityAndClassificationInRequireData()

  metricsPage.close()
})
