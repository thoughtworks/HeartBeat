import { MOCK_GENERATE_REPORT_REQUEST_PARAMS, MOCK_REPORT_RESPONSE, MOCK_RETRIEVE_REPORT_RESPONSE } from '../fixtures';
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect';
import { act, renderHook, waitFor } from '@testing-library/react';
import { reportClient } from '@src/clients/report/ReportClient';
import { TimeoutError } from '@src/errors/TimeoutError';
import { UnknownError } from '@src/errors/UnknownError';
import { HttpStatusCode } from 'axios';
import clearAllMocks = jest.clearAllMocks;
import resetAllMocks = jest.resetAllMocks;
import { METRIC_TYPES } from '@src/constants/commons';

const MOCK_GENERATE_REPORT_REQUEST_PARAMS_WITH_BOARD_METRIC_TYPE = {
  ...MOCK_GENERATE_REPORT_REQUEST_PARAMS,
  metricTypes: [METRIC_TYPES.BOARD],
};
const MOCK_GENERATE_REPORT_REQUEST_PARAMS_WITH_DORA_METRIC_TYPE = {
  ...MOCK_GENERATE_REPORT_REQUEST_PARAMS,
  metricTypes: [METRIC_TYPES.DORA],
};

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

  it('should set "Data loading failed" for board metrics when board data retrieval times out', async () => {
    reportClient.retrieveByUrl = jest.fn().mockRejectedValue(new TimeoutError('5xx error', 503));

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestData(MOCK_GENERATE_REPORT_REQUEST_PARAMS_WITH_BOARD_METRIC_TYPE);
      expect(result.current.timeout4Board).toEqual('Data loading failed');
    });
  });

  it('should call polling report and setTimeout when request board data given pollingReport response return 204', async () => {
    reportClient.polling = jest
      .fn()
      .mockImplementation(async () => ({ status: HttpStatusCode.NoContent, response: MOCK_REPORT_RESPONSE }));
    reportClient.retrieveByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }));

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestData(MOCK_GENERATE_REPORT_REQUEST_PARAMS_WITH_BOARD_METRIC_TYPE);
    });

    jest.runOnlyPendingTimers();

    await waitFor(() => {
      expect(reportClient.polling).toHaveBeenCalledTimes(1);
    });
  });

  it('should call polling report more than one time when metrics is loading', async () => {
    reportClient.polling = jest.fn().mockImplementation(async () => ({
      status: HttpStatusCode.NoContent,
      response: { ...MOCK_REPORT_RESPONSE, allMetricsCompleted: false },
    }));
    reportClient.retrieveByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }));

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestData(MOCK_GENERATE_REPORT_REQUEST_PARAMS);
    });
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    await waitFor(() => {
      expect(reportClient.polling).toHaveBeenCalledTimes(2);
    });
  });

  it('should call polling report only once when request board data given dora data retrieval is called before', async () => {
    reportClient.polling = jest
      .fn()
      .mockImplementation(async () => ({ status: HttpStatusCode.NoContent, response: MOCK_REPORT_RESPONSE }));
    reportClient.retrieveByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }));

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestData(MOCK_GENERATE_REPORT_REQUEST_PARAMS_WITH_BOARD_METRIC_TYPE);
      result.current.startToRequestData(MOCK_GENERATE_REPORT_REQUEST_PARAMS_WITH_DORA_METRIC_TYPE);
    });

    jest.runOnlyPendingTimers();

    await waitFor(() => {
      expect(reportClient.polling).toHaveBeenCalledTimes(1);
    });
  });

  it('should set "Data loading failed" for dora metrics when dora data retrieval times out', async () => {
    reportClient.retrieveByUrl = jest.fn().mockRejectedValue(new TimeoutError('5xx error', 503));

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestData(MOCK_GENERATE_REPORT_REQUEST_PARAMS_WITH_DORA_METRIC_TYPE);
      expect(result.current.timeout4Dora).toEqual('Data loading failed');
    });
  });

  it('should set "Data loading failed" for report when polling times out', async () => {
    reportClient.polling = jest.fn().mockImplementation(async () => {
      throw new TimeoutError('5xx error', 503);
    });

    reportClient.retrieveByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }));

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestData(MOCK_GENERATE_REPORT_REQUEST_PARAMS);
      expect(result.current.timeout4Report).toEqual('Data loading failed');
    });
  });

  it('should call polling report and setTimeout when request dora data given pollingReport response return 204', async () => {
    reportClient.polling = jest
      .fn()
      .mockImplementation(async () => ({ status: HttpStatusCode.NoContent, response: MOCK_REPORT_RESPONSE }));

    reportClient.retrieveByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }));

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestData(MOCK_GENERATE_REPORT_REQUEST_PARAMS_WITH_DORA_METRIC_TYPE);
    });

    jest.runOnlyPendingTimers();

    await waitFor(() => {
      expect(reportClient.polling).toHaveBeenCalledTimes(1);
    });
  });

  it('should call polling report only once when request dora data given board data retrieval is called before', async () => {
    reportClient.polling = jest
      .fn()
      .mockImplementation(async () => ({ status: HttpStatusCode.NoContent, response: MOCK_REPORT_RESPONSE }));

    reportClient.retrieveByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }));

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestData(MOCK_GENERATE_REPORT_REQUEST_PARAMS_WITH_DORA_METRIC_TYPE);
      result.current.startToRequestData(MOCK_GENERATE_REPORT_REQUEST_PARAMS_WITH_BOARD_METRIC_TYPE);
    });

    jest.runOnlyPendingTimers();

    await waitFor(() => {
      expect(reportClient.polling).toHaveBeenCalledTimes(1);
    });
  });

  it('should set "Data loading failed" for board metric when request board data given UnknownException', async () => {
    reportClient.retrieveByUrl = jest.fn().mockRejectedValue(new UnknownError());

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestData(MOCK_GENERATE_REPORT_REQUEST_PARAMS_WITH_BOARD_METRIC_TYPE);
      expect(result.current.generalError4Board).toEqual('Data loading failed');
    });
  });

  it('should set "Data loading failed" for dora metric when request dora data given UnknownException', async () => {
    reportClient.retrieveByUrl = jest.fn().mockRejectedValue(new UnknownError());

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestData(MOCK_GENERATE_REPORT_REQUEST_PARAMS_WITH_DORA_METRIC_TYPE);
      expect(result.current.generalError4Dora).toEqual('Data loading failed');
    });
  });

  it('should set "Data loading failed" for report when polling given UnknownException', async () => {
    reportClient.polling = jest.fn().mockRejectedValue(new UnknownError());
    reportClient.retrieveByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }));

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestData(MOCK_GENERATE_REPORT_REQUEST_PARAMS);
      expect(result.current.generalError4Report).toEqual('Data loading failed');
    });
  });

  it('should set "Data loading failed" for report when all data retrieval times out', async () => {
    reportClient.retrieveByUrl = jest.fn().mockRejectedValue(new TimeoutError('5xx error', 503));

    const { result } = renderHook(() => useGenerateReportEffect());

    await waitFor(() => {
      result.current.startToRequestData(MOCK_GENERATE_REPORT_REQUEST_PARAMS);
      expect(result.current.timeout4Report).toEqual('Data loading failed');
    });
  });
});
