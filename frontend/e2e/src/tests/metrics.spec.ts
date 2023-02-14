import { test, expect } from '../fixtures'

test('should render metrics page', async ({ homePage }) => {
  await homePage.createNewProject()

  expect(homePage.page.url()).toContain('metrics')

  await homePage.close()
})
test('should show config content when in the config step', async ({ metricsPage }) => {
  await metricsPage.createNewProject()

  await metricsPage.checkSteps()

  await expect(metricsPage.projectNameLabel).toBeVisible()

  await metricsPage.checkProjectName()

  await expect(metricsPage.projectNameErrorMessage).toBeTruthy()

  await expect(metricsPage.collectionDate).toBeVisible()
  await expect(metricsPage.regularCalendar).toBeChecked()
  await expect(metricsPage.chinaCalendar).not.toBeChecked()

  await metricsPage.switchCollectionDate()

  await metricsPage.checkDateRangePicker()

  await metricsPage.checkDatePickerError()

  await metricsPage.checkMultipleRequireData()

  await metricsPage.close()
})
