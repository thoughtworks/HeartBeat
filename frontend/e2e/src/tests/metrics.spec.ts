import { test, expect } from '../fixtures'

test('should render metrics page', async ({ homePage }) => {
  await homePage.createNewProject()

  expect(homePage.page.url()).toContain('metrics')

  await homePage.close()
})
test('should show three steps when render metrics page', async ({ metricsPage }) => {
  await metricsPage.createNewProject()

  await metricsPage.checkSteps()

  await metricsPage.close()
})

test('should show project name when input some letters', async ({ metricsPage }) => {
  await metricsPage.createNewProject()

  await expect(metricsPage.projectNameLabel).toBeVisible()

  await metricsPage.close()
})
test('should show error message when project name is Empty', async ({ metricsPage }) => {
  await metricsPage.createNewProject()

  await metricsPage.checkProjectName()

  await expect(metricsPage.projectNameErrorMessage).toBeTruthy()

  await metricsPage.close()
})
test('should select Regular calendar by default when rendering the collection date', async ({ metricsPage }) => {
  await metricsPage.createNewProject()

  await expect(metricsPage.collectionDate).toBeVisible()
  await expect(metricsPage.regularCalendar).toBeChecked()
  await expect(metricsPage.chinaCalendar).not.toBeChecked()

  await metricsPage.close()
})
test('should switch the radio when any collection date is selected', async ({ metricsPage }) => {
  await metricsPage.createNewProject()

  await metricsPage.switchCollectionDate()

  await metricsPage.close()
})
test('should show right start date when input a valid date given init start date is null', async ({ metricsPage }) => {
  await metricsPage.createNewProject()

  await metricsPage.checkDateRangePicker()

  await metricsPage.close()
})
test('should show error message when input a illegal date', async ({ metricsPage }) => {
  await metricsPage.createNewProject()

  await metricsPage.checkDatePickerError()

  await metricsPage.close()
})
test('should show multiple selections when multiple options are selected', async ({ metricsPage }) => {
  await metricsPage.createNewProject()

  await metricsPage.checkMultipleRequireData()

  await metricsPage.close()
})
test('should show error message when require data is null', async ({ metricsPage }) => {
  await metricsPage.createNewProject()

  await metricsPage.checkNullRequireData()

  await metricsPage.close()
})
