import { test } from '../fixtures/testWithExtendFixtures';
import { E2E_PROJECT_NAME } from 'e2e/fixtures/fixtures';

test('Create a new project', async ({ homePage, configStep }) => {
  await homePage.goto();
  await homePage.createANewProject();

  await configStep.waitForShown();
  await configStep.typeProjectName(E2E_PROJECT_NAME);

  await configStep.checkProjectName(E2E_PROJECT_NAME);
});
