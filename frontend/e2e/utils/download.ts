import { expect, Locator, Page } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import path from 'path';
import fs from 'fs';

export const downloadFileAndCheck = async (
  page: Page,
  downloadButton: Locator,
  savedFileName: string,
  validator: (fileDataString: string) => Promise<void>,
) => {
  const downloadPromise = page.waitForEvent('download');

  await expect(downloadButton).toBeEnabled();
  await downloadButton.click();
  const download = await downloadPromise;
  const savePath = path.resolve(__dirname, '../', './temp', `./${savedFileName}`);
  await download.saveAs(savePath);

  const downloadPath = await download.path();
  const fileDataString = fs.readFileSync(downloadPath, 'utf8');

  await validator(fileDataString);
  await download.delete();
};

export const checkDownloadReport = async (page: Page, downloadButton: Locator, savedFileName: string) => {
  await downloadFileAndCheck(page, downloadButton, savedFileName, async (fileDataString) => {
    expect(fileDataString.length).toBeGreaterThan(0);
    let localCsvFile = fs.readFileSync(path.resolve(__dirname, '../fixtures/importFile/metricData.csv'));
    switch (savedFileName) {
      case 'metricReport.csv':
        localCsvFile = fs.readFileSync(path.resolve(__dirname, '../fixtures/importFile/metricData.csv'));
        break;
      case 'boardReport.csv':
        localCsvFile = fs.readFileSync(path.resolve(__dirname, '../fixtures/importFile/boardData.csv'));
        break;
      case 'pipelineReport.csv':
        localCsvFile = fs.readFileSync(path.resolve(__dirname, '../fixtures/importFile/pipelineData.csv'));
        break;
    }
    const localCsv = parse(localCsvFile);
    const downloadCsv = parse(fileDataString);
    expect(localCsv).toStrictEqual(downloadCsv);
  });
};
