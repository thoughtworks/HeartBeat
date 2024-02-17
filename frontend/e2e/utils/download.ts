import { expect, Locator, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';

export const checkDownloadReport = async (page: Page, downloadButton: Locator, savedFileName: string) => {
  const downloadPromise = page.waitForEvent('download');

  await expect(downloadButton).toBeEnabled();
  await downloadButton.click();
  const download = await downloadPromise;
  const savePath = path.resolve(__dirname, '../', './temp', `./${savedFileName}`);
  await download.saveAs(savePath);

  const downloadPath = await download.path();
  const fileDataString = fs.readFileSync(downloadPath, 'utf8');

  expect(fileDataString.length).toBeGreaterThan(0);
  await download.delete();
};
