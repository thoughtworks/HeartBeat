import { MetricsStep } from '../pages/metrics/MetricsStep';
import { ConfigStep } from '../pages/metrics/ConfigStep';
import { ReportStep } from '../pages/metrics/ReportStep';
import { test as base } from '@playwright/test';
import { HomePage } from '../pages/Home';

interface ExtendedFixtures {
  homePage: HomePage;
  configStep: ConfigStep;
  metricsStep: MetricsStep;
  reportStep: ReportStep;
}

export const test = base.extend<ExtendedFixtures>({
  homePage: async ({ page }, use) => {
    const newPage = new HomePage(page);
    await use(newPage);
  },
  configStep: async ({ page }, use) => {
    const newPage = new ConfigStep(page);
    await use(newPage);
  },
  metricsStep: async ({ page }, use) => {
    const newPage = new MetricsStep(page);
    await use(newPage);
  },
  reportStep: async ({ page }, use) => {
    const newPage = new ReportStep(page);
    await use(newPage);
  },
});
