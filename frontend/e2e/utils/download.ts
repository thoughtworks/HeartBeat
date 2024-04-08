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
    let localCsvFile = fs.readFileSync(path.resolve(__dirname, '../fixtures/import-file/metric-data.csv'));
    switch (savedFileName) {
      case 'metricReport.csv':
        localCsvFile = fs.readFileSync(path.resolve(__dirname, '../fixtures/import-file/metric-data.csv'));
        break;
      case 'boardReport.csv':
        localCsvFile = fs.readFileSync(path.resolve(__dirname, '../fixtures/import-file/board-data.csv'));
        break;
      case 'pipelineReport.csv':
        localCsvFile = fs.readFileSync(path.resolve(__dirname, '../fixtures/import-file/pipeline-data.csv'));
        break;
    }
    const localCsv = parse(localCsvFile);
    const downloadCsv = parse(fileDataString);
    expect(localCsv).toStrictEqual(downloadCsv);
  });
};

export const checkDownloadReportCycleTimeByStatus = async (
  page: Page,
  downloadButton: Locator,
  savedFileName: string,
) => {
  await downloadFileAndCheck(page, downloadButton, savedFileName, async (fileDataString) => {
    expect(fileDataString.length).toBeGreaterThan(0);
    let localCsvFile = fs.readFileSync(
      path.resolve(__dirname, '../fixtures/cycle-time-by-status/metric-data-by-status.csv'),
    );
    switch (savedFileName) {
      case 'metricReport.csv':
        localCsvFile = fs.readFileSync(
          path.resolve(__dirname, '../fixtures/cycle-time-by-status/metric-data-by-status.csv'),
        );
        break;
      case 'boardReport.csv':
        localCsvFile = fs.readFileSync(
          path.resolve(__dirname, '../fixtures/cycle-time-by-status/board-data-by-status.csv'),
        );
        break;
      case 'pipelineReport.csv':
        localCsvFile = fs.readFileSync(
          path.resolve(__dirname, '../fixtures/cycleTimeByStatus/pipeline-data-by-status.csv'),
        );
        break;
    }
    const localCsv = parse(localCsvFile);
    const downloadCsv = parse(fileDataString);
    expect(localCsv).toStrictEqual(downloadCsv);
  });
};
