import { test as baseTest } from '@playwright/test'
import Home from './pages/Home'

const fixtures = baseTest.extend<{
  homePage: Home
}>({
  homePage: async ({ page }, use) => {
    await use(new Home(page))
  },
})
export const test = fixtures
export const expect = fixtures.expect
export const describe = fixtures.describe
