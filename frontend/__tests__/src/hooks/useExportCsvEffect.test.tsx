import { ERROR_MESSAGE_TIME_DURATION, MOCK_EXPORT_CSV_REQUEST_PARAMS } from '../fixtures';
import { InternalServerException } from '@src/exceptions/InternalServerException';
import { NotFoundException } from '@src/exceptions/NotFoundException';
import { useExportCsvEffect } from '@src/hooks/useExportCsvEffect';
import { csvClient } from '@src/clients/report/CSVClient';
import { act, renderHook } from '@testing-library/react';
import { HttpStatusCode } from 'axios';

describe('use export csv effect', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should set error message empty when export csv throw error and last for 4 seconds', async () => {
    jest.useFakeTimers();
    csvClient.exportCSVData = jest.fn().mockImplementation(() => {
      throw new Error('error');
    });
    const { result } = renderHook(() => useExportCsvEffect());

    act(() => {
      result.current.fetchExportData(MOCK_EXPORT_CSV_REQUEST_PARAMS);
      jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION);
    });

    expect(result.current.errorMessage).toEqual('');
  });

  it('should set error message when export csv response status 500', async () => {
    csvClient.exportCSVData = jest.fn().mockImplementation(() => {
      throw new InternalServerException('error message', HttpStatusCode.InternalServerError);
    });
    const { result } = renderHook(() => useExportCsvEffect());

    act(() => {
      result.current.fetchExportData(MOCK_EXPORT_CSV_REQUEST_PARAMS);
    });

    expect(result.current.errorMessage).toEqual('failed to export csv: error message');
  });

  it('should set error message when export csv response status 404', async () => {
    csvClient.exportCSVData = jest.fn().mockImplementation(() => {
      throw new NotFoundException('error message', HttpStatusCode.NotFound);
    });
    const { result } = renderHook(() => useExportCsvEffect());

    act(() => {
      result.current.fetchExportData(MOCK_EXPORT_CSV_REQUEST_PARAMS);
    });

    expect(result.current.isExpired).toEqual(true);
  });
});
