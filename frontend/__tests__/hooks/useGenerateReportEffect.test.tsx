import { MOCK_GENERATE_REPORT_REQUEST_PARAMS, MOCK_REPORT_RESPONSE, MOCK_RETRIEVE_REPORT_RESPONSE } from '../fixtures';
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect';
import { act, renderHook, waitFor } from '@testing-library/react';
import { reportClient } from '@src/clients/report/ReportClient';
import { TimeoutError } from '@src/errors/TimeoutError';
import { UnknownError } from '@src/errors/UnknownError';
import { HttpStatusCode } from 'axios';
import clearAllMocks = jest.clearAllMocks;
import resetAllMocks = jest.resetAllMocks;

describe('use generate report effect', () => {
  afterAll(() => {
    clearAllMocks();
  });
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    resetAllMocks();
    jest.useRealTimers();
  });

  it('should set timeout4Board is "Data loading failed" when timeout', async () => {
    reportClient.retrieveByUrl = jest.fn().mockRejectedValue(new TimeoutError('5xx error', 503));

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestBoardData(MOCK_GENERATE_REPORT_REQUEST_PARAMS);
      expect(result.current.timeout4Board).toEqual('Data loading failed');
    });
  });

  it('should call polling report and setTimeout when calling startToRequestBoardData given pollingReport response return 204 ', async () => {
    reportClient.polling = jest
      .fn()
      .mockImplementation(async () => ({ status: HttpStatusCode.NoContent, response: MOCK_REPORT_RESPONSE }));
    reportClient.retrieveByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }));

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestBoardData(MOCK_GENERATE_REPORT_REQUEST_PARAMS);
    });

    jest.runOnlyPendingTimers();

    await waitFor(() => {
      expect(reportClient.polling).toHaveBeenCalledTimes(1);
    });
  });

  it('should call polling report more than one time when boardMetricsCompleted field in response is false given call boardData ', async () => {
    reportClient.polling = jest.fn().mockImplementation(async () => ({
      status: HttpStatusCode.NoContent,
      response: { ...MOCK_REPORT_RESPONSE, boardMetricsCompleted: false },
    }));
    reportClient.retrieveByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }));

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestBoardData(MOCK_GENERATE_REPORT_REQUEST_PARAMS);
    });
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    await waitFor(() => {
      expect(reportClient.polling).toHaveBeenCalledTimes(2);
    });
  });

  it('should call polling report more than one time when doraMetricsCompleted field in response is false given call doraData ', async () => {
    reportClient.polling = jest.fn().mockImplementation(async () => ({
      status: HttpStatusCode.NoContent,
      response: { ...MOCK_REPORT_RESPONSE, doraMetricsCompleted: false },
    }));
    reportClient.retrieveByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }));

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestDoraData(MOCK_GENERATE_REPORT_REQUEST_PARAMS);
    });
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    await waitFor(() => {
      expect(reportClient.polling).toHaveBeenCalledTimes(2);
    });
  });

  it('should call polling report only once when calling startToRequestBoardData but startToRequestDoraData called before', async () => {
    reportClient.polling = jest
      .fn()
      .mockImplementation(async () => ({ status: HttpStatusCode.NoContent, response: MOCK_REPORT_RESPONSE }));
    reportClient.retrieveByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }));

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestDoraData(MOCK_GENERATE_REPORT_REQUEST_PARAMS);
      result.current.startToRequestBoardData(MOCK_GENERATE_REPORT_REQUEST_PARAMS);
    });

    jest.runOnlyPendingTimers();

    await waitFor(() => {
      expect(reportClient.polling).toHaveBeenCalledTimes(1);
    });
  });

  it('should set timeout4Dora is "Data loading failed" when startToRequestDoraData timeout', async () => {
    reportClient.retrieveByUrl = jest.fn().mockRejectedValue(new TimeoutError('5xx error', 503));

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestDoraData(MOCK_GENERATE_REPORT_REQUEST_PARAMS);
      expect(result.current.timeout4Dora).toEqual('Data loading failed');
    });
  });

  it('should set timeout4Report is "Data loading failed" when polling timeout', async () => {
    reportClient.polling = jest.fn().mockImplementation(async () => {
      throw new TimeoutError('5xx error', 503);
    });

    reportClient.retrieveByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }));

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestDoraData(MOCK_GENERATE_REPORT_REQUEST_PARAMS);
      expect(result.current.timeout4Report).toEqual('Data loading failed');
    });
  });

  it('should call polling report and setTimeout when calling startToRequestDoraData given pollingReport response return 204 ', async () => {
    reportClient.polling = jest
      .fn()
      .mockImplementation(async () => ({ status: HttpStatusCode.NoContent, response: MOCK_REPORT_RESPONSE }));

    reportClient.retrieveByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }));

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestDoraData(MOCK_GENERATE_REPORT_REQUEST_PARAMS);
    });

    jest.runOnlyPendingTimers();

    await waitFor(() => {
      expect(reportClient.polling).toHaveBeenCalledTimes(1);
    });
  });

  it('should call polling report only once when calling startToRequestDoraData but startToRequestBoardData called before', async () => {
    reportClient.polling = jest
      .fn()
      .mockImplementation(async () => ({ status: HttpStatusCode.NoContent, response: MOCK_REPORT_RESPONSE }));

    reportClient.retrieveByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }));

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestBoardData(MOCK_GENERATE_REPORT_REQUEST_PARAMS);
      result.current.startToRequestDoraData(MOCK_GENERATE_REPORT_REQUEST_PARAMS);
    });

    jest.runOnlyPendingTimers();

    await waitFor(() => {
      expect(reportClient.polling).toHaveBeenCalledTimes(1);
    });
  });

  it('should set generalError4Board is "Data loading failed" when startToRequestBoardData given UnknownException', async () => {
    reportClient.retrieveByUrl = jest.fn().mockRejectedValue(new UnknownError());

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestBoardData(MOCK_GENERATE_REPORT_REQUEST_PARAMS);
      expect(result.current.generalError4Board).toEqual('Data loading failed');
    });
  });

  it('should set generalError4Dora is "Data loading failed" when startToRequestDoraData given UnknownException', async () => {
    reportClient.retrieveByUrl = jest.fn().mockRejectedValue(new UnknownError());

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestDoraData(MOCK_GENERATE_REPORT_REQUEST_PARAMS);
      expect(result.current.generalError4Dora).toEqual('Data loading failed');
    });
  });

  it('should set generalError4Report is "Data loading failed" when polling given UnknownException', async () => {
    reportClient.polling = jest.fn().mockRejectedValue(new UnknownError());
    reportClient.retrieveByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }));

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestDoraData(MOCK_GENERATE_REPORT_REQUEST_PARAMS);
      expect(result.current.generalError4Report).toEqual('Data loading failed');
    });
  });
});
