import { test } from '../fixtures/testWithExtendFixtures';
import { expect } from '@playwright/test';

test('Create a new project', async ({ homePage, configStep }) => {
  await homePage.goto();
  await homePage.createANewProject();

  await configStep.waitForShown();
  await configStep.typeProjectName(process.env.E2E_TOKEN_JIRA || '');

  await expect(configStep.projectNameInput).toHaveValue('mockToken');
});
