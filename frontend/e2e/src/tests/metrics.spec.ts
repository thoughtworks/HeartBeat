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
