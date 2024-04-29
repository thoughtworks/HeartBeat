import { E2E_EXPECT_LOCAL_TIMEOUT, E2E_EXPECT_CI_TIMEOUT, E2E_OVERALL_TIMEOUT, VIEWPORT_DEFAULT } from 'e2e/fixtures';
import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */

if (process.env.CI) {
  console.log('Start to run E2E testing on CI');
}

if (!process.env.APP_ORIGIN) {
  throw new Error('Failed to start E2E testing, please configure the env var APP_ORIGIN');
}

export default defineConfig({
  timeout: process.env.CI ? E2E_OVERALL_TIMEOUT * 4 : E2E_OVERALL_TIMEOUT * 5,
  testDir: './e2e',
  expect: {
    timeout: process.env.CI ? E2E_EXPECT_CI_TIMEOUT : E2E_EXPECT_LOCAL_TIMEOUT,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? '80%' : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  outputDir: './e2e/test-results',
  reporter: [['html', { open: process.env.CI ? 'never' : 'on-failure', outputFolder: './e2e/reports/html' }], ['list']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.APP_ORIGIN,
    viewport: VIEWPORT_DEFAULT,
    timezoneId: 'Asia/Shanghai',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    /* Test against Tablet viewports. */
    // {
    //   name: 'Tablet',
    //   use: devices['iPad landscape'],
    // },

    /* Test against branded browsers. */
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
