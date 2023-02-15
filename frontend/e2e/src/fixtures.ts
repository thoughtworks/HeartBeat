import { test as baseTest } from '@playwright/test'
import Home from './pages/Home'
import Metrics from './pages/Metrics'

const fixtures = baseTest.extend<{
  homePage: Home
  metricsPage: Metrics
}>({
  homePage: async ({ page }, use) => {
    await use(new Home(page))
  },
  metricsPage: async ({ page }, use) => {
    await use(new Metrics(page))
  },
})
export const test = fixtures
export const expect = fixtures.expect
export const describe = fixtures.describe
export const STEPS = ['Config', 'Metrics', 'Export']
