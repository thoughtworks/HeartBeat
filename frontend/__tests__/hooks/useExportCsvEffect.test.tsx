import { useNotificationLayoutEffect } from '@src/hooks/useNotificationLayoutEffect';
import { InternalServerException } from '@src/exceptions/InternalServerException';
import { NotFoundException } from '@src/exceptions/NotFoundException';
import { useExportCsvEffect } from '@src/hooks/useExportCsvEffect';
import { MOCK_EXPORT_CSV_REQUEST_PARAMS } from '../fixtures';
import { csvClient } from '@src/clients/report/CSVClient';
import { act, renderHook } from '@testing-library/react';
import { HttpStatusCode } from 'axios';

describe('use export csv effect', () => {
  const { result: notificationHook } = renderHook(() => useNotificationLayoutEffect());

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call addNotification when export csv response status 500', async () => {
    csvClient.exportCSVData = jest.fn().mockImplementation(() => {
      throw new InternalServerException('error message', HttpStatusCode.InternalServerError);
    });
    notificationHook.current.addNotification = jest.fn();
    const { result } = renderHook(() => useExportCsvEffect(notificationHook.current));

    act(() => {
      result.current.fetchExportData(MOCK_EXPORT_CSV_REQUEST_PARAMS);
    });

    expect(notificationHook.current.addNotification).toBeCalledWith({
      message: 'Failed to export csv.',
      type: 'error',
    });
  });

  it('should set isExpired true when export csv response status 404', async () => {
    csvClient.exportCSVData = jest.fn().mockImplementation(() => {
      throw new NotFoundException('error message', HttpStatusCode.NotFound);
    });
    const { result } = renderHook(() => useExportCsvEffect(notificationHook.current));

    act(() => {
      result.current.fetchExportData(MOCK_EXPORT_CSV_REQUEST_PARAMS);
    });

    expect(result.current.isExpired).toEqual(true);
  });
});
