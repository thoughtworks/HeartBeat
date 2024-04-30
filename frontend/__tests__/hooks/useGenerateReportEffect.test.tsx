import {
  GeneralErrorKey,
  IReportError,
  IReportInfo,
  useGenerateReportEffect,
  IUseGenerateReportEffect,
  TimeoutErrorKey,
} from '@src/hooks/useGenerateReportEffect';
import {
  MOCK_GENERATE_REPORT_REQUEST_PARAMS,
  MOCK_REPORT_RESPONSE,
  MOCK_RETRIEVE_REPORT_RESPONSE,
  MockedDateRanges,
} from '../fixtures';
import { AXIOS_REQUEST_ERROR_CODE } from '@src/constants/resources';
import { updateDateRange } from '@src/context/config/configSlice';
import { act, renderHook, waitFor } from '@testing-library/react';
import { reportClient } from '@src/clients/report/ReportClient';
import { setupStore } from '@test/utils/setupStoreUtil';
import { TimeoutError } from '@src/errors/TimeoutError';
import { UnknownError } from '@src/errors/UnknownError';
import { METRIC_TYPES } from '@src/constants/commons';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { HttpStatusCode } from 'axios';
import clearAllMocks = jest.clearAllMocks;
import resetAllMocks = jest.resetAllMocks;

const MOCK_GENERATE_REPORT_REQUEST_PARAMS_WITH_BOARD_METRIC_TYPE = {
  ...MOCK_GENERATE_REPORT_REQUEST_PARAMS,
  metricTypes: [METRIC_TYPES.BOARD],
};
const MOCK_GENERATE_REPORT_REQUEST_PARAMS_WITH_DORA_METRIC_TYPE = {
  ...MOCK_GENERATE_REPORT_REQUEST_PARAMS,
  metricTypes: [METRIC_TYPES.DORA],
};

let store = setupStore();

const Wrapper = ({ children }: { children: ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

const setup = () =>
  renderHook(() => useGenerateReportEffect(), {
    wrapper: Wrapper,
  });

describe('use generate report effect', () => {
  afterAll(() => {
    clearAllMocks();
  });
  beforeEach(() => {
    store = setupStore();
    store.dispatch(updateDateRange(MockedDateRanges));
    jest.useFakeTimers();
  });
  afterEach(() => {
    resetAllMocks();
    jest.useRealTimers();
  });

  it('should set "Data loading failed" for all board metrics when board data retrieval times out', async () => {
    reportClient.retrieveByUrl = jest
      .fn()
      .mockRejectedValue(new TimeoutError('timeout error', AXIOS_REQUEST_ERROR_CODE.TIMEOUT));
    reportClient.polling = jest.fn();

    const { result } = setup();

    await act(async () => {
      await result.current.startToRequestData(MOCK_GENERATE_REPORT_REQUEST_PARAMS_WITH_BOARD_METRIC_TYPE);
    });

    expect(result.current.reportInfos.length).toEqual(2);
    expect(result.current.reportInfos[0].timeout4Board.message).toEqual('Data loading failed');
    expect(result.current.reportInfos[0].timeout4Board.shouldShow).toEqual(true);
    expect(result.current.reportInfos[0].reportData).toEqual(undefined);
    expect(result.current.reportInfos[1].timeout4Board.message).toEqual('Data loading failed');
    expect(result.current.reportInfos[1].timeout4Board.shouldShow).toEqual(true);
    expect(result.current.reportInfos[1].reportData).toEqual(undefined);
    expect(reportClient.polling).toHaveBeenCalledTimes(0);
  });

  it('should set "Data loading failed" for dora metrics when dora data retrieval times out', async () => {
    reportClient.retrieveByUrl = jest
      .fn()
      .mockRejectedValueOnce(new TimeoutError('timeout error', AXIOS_REQUEST_ERROR_CODE.TIMEOUT))
      .mockResolvedValueOnce(async () => MOCK_RETRIEVE_REPORT_RESPONSE);

    reportClient.polling = jest
      .fn()
      .mockImplementation(async () => ({ status: HttpStatusCode.Ok, response: MOCK_REPORT_RESPONSE }));
    const { result } = setup();

    await act(async () => {
      await result.current.startToRequestData(MOCK_GENERATE_REPORT_REQUEST_PARAMS_WITH_DORA_METRIC_TYPE);
    });

    expect(result.current.reportInfos[0].timeout4Dora.message).toEqual('Data loading failed');
    expect(result.current.reportInfos[0].timeout4Dora.shouldShow).toEqual(true);
    expect(result.current.reportInfos[0].reportData).toEqual(undefined);
    expect(result.current.reportInfos[1].timeout4Dora.message).toEqual('');
    expect(result.current.reportInfos[1].reportData).toBeTruthy();
  });

  it('should call polling report and setTimeout when request board data given pollingReport response return 200', async () => {
    reportClient.polling = jest
      .fn()
      .mockImplementation(async () => ({ status: HttpStatusCode.Ok, response: MOCK_REPORT_RESPONSE }));
    reportClient.retrieveByUrl = jest.fn().mockImplementation(async () => MOCK_RETRIEVE_REPORT_RESPONSE);

    const { result } = setup();

    await waitFor(() => {
      result.current.startToRequestData(MOCK_GENERATE_REPORT_REQUEST_PARAMS_WITH_BOARD_METRIC_TYPE);
    });

    jest.runOnlyPendingTimers();

    await waitFor(() => {
      expect(reportClient.polling).toHaveBeenCalledTimes(2);
    });
  });

  it('should call polling report more than one time when metrics is loading', async () => {
    reportClient.polling = jest
      .fn()
      .mockReturnValueOnce({
        status: HttpStatusCode.Ok,
        response: { ...MOCK_REPORT_RESPONSE, allMetricsCompleted: false },
      })
      .mockRejectedValue(new TimeoutError('timeout error', AXIOS_REQUEST_ERROR_CODE.TIMEOUT))
      .mockReturnValueOnce({
        status: HttpStatusCode.Ok,
        response: { ...MOCK_REPORT_RESPONSE, allMetricsCompleted: true },
      });
    reportClient.retrieveByUrl = jest
      .fn()
      .mockReturnValueOnce(MOCK_RETRIEVE_REPORT_RESPONSE)
      .mockReturnValueOnce({ ...MOCK_RETRIEVE_REPORT_RESPONSE, callbackUrl: '/url/1234' });

    const { result } = setup();

    await act(async () => {
      await result.current.startToRequestData(MOCK_GENERATE_REPORT_REQUEST_PARAMS);
      jest.advanceTimersByTime(10000);
    });

    expect(reportClient.polling).toHaveBeenCalledTimes(3);
    expect(result.current.reportInfos[0][TimeoutErrorKey[METRIC_TYPES.ALL] as keyof IReportError].message).toEqual(
      'Data loading failed',
    );
    expect(result.current.reportInfos[0][TimeoutErrorKey[METRIC_TYPES.ALL] as keyof IReportError].shouldShow).toEqual(
      true,
    );
  });

  it('should call polling report only once when request board data given dora data retrieval is called before', async () => {
    reportClient.polling = jest
      .fn()
      .mockImplementation(async () => ({ status: HttpStatusCode.Ok, response: MOCK_REPORT_RESPONSE }));
    reportClient.retrieveByUrl = jest.fn().mockImplementation(async () => MOCK_RETRIEVE_REPORT_RESPONSE);

    const { result } = setup();

    await waitFor(async () => {
      await result.current.startToRequestData(MOCK_GENERATE_REPORT_REQUEST_PARAMS_WITH_BOARD_METRIC_TYPE);
      await result.current.startToRequestData(MOCK_GENERATE_REPORT_REQUEST_PARAMS_WITH_DORA_METRIC_TYPE);
    });

    jest.runOnlyPendingTimers();

    expect(reportClient.polling).toHaveBeenCalledTimes(2);
  });

  it.each([
    {
      params: MOCK_GENERATE_REPORT_REQUEST_PARAMS_WITH_BOARD_METRIC_TYPE,
      errorKey: GeneralErrorKey[METRIC_TYPES.BOARD],
    },
    {
      params: MOCK_GENERATE_REPORT_REQUEST_PARAMS_WITH_DORA_METRIC_TYPE,
      errorKey: GeneralErrorKey[METRIC_TYPES.DORA],
    },
    {
      params: MOCK_GENERATE_REPORT_REQUEST_PARAMS,
      errorKey: GeneralErrorKey[METRIC_TYPES.ALL],
    },
  ])('should set "Data loading failed" for board metric when request given UnknownException', async (_) => {
    reportClient.retrieveByUrl = jest.fn().mockRejectedValue(new UnknownError());

    const { result } = setup();

    await act(async () => {
      await result.current.startToRequestData(_.params);
    });
    const errorKey = _.errorKey as keyof IReportError;

    expect(result.current.reportInfos[0][errorKey].message).toEqual('Data loading failed');
    expect(result.current.reportInfos[0][errorKey].shouldShow).toEqual(true);
    expect(result.current.reportInfos[1][errorKey].message).toEqual('Data loading failed');
    expect(result.current.reportInfos[1][errorKey].shouldShow).toEqual(true);
  });

  it.each([
    {
      errorKey: 'boardMetricsError',
      stateKey: 'shouldShowBoardMetricsError',
      updateMethod: 'closeBoardMetricsError',
    },
    {
      errorKey: 'pipelineMetricsError',
      stateKey: 'shouldShowPipelineMetricsError',
      updateMethod: 'closePipelineMetricsError',
    },
    {
      errorKey: 'sourceControlMetricsError',
      stateKey: 'shouldShowSourceControlMetricsError',
      updateMethod: 'closeSourceControlMetricsError',
    },
  ])('should update the report error status when call the update method', async (_) => {
    reportClient.polling = jest.fn().mockImplementation(async () => ({
      status: HttpStatusCode.Ok,
      response: {
        ...MOCK_REPORT_RESPONSE,
        reportMetricsError: {
          [_.errorKey]: {
            status: 400,
            message: 'error',
          },
        },
      },
    }));
    reportClient.retrieveByUrl = jest.fn().mockImplementation(async () => MOCK_RETRIEVE_REPORT_RESPONSE);
    const { result } = setup();

    await act(async () => {
      await result.current.startToRequestData(MOCK_GENERATE_REPORT_REQUEST_PARAMS_WITH_BOARD_METRIC_TYPE);
    });

    expect(result.current.reportInfos[0][_.stateKey as keyof IReportInfo]).toEqual(true);
    expect(result.current.reportInfos[1][_.stateKey as keyof IReportInfo]).toEqual(true);

    await act(async () => {
      const updateMethod = result.current[_.updateMethod as keyof IUseGenerateReportEffect] as (id: string) => void;
      updateMethod(MockedDateRanges[0].startDate);
    });

    expect(result.current.reportInfos[0][_.stateKey as keyof IReportInfo]).toEqual(false);
    expect(result.current.reportInfos[1][_.stateKey as keyof IReportInfo]).toEqual(true);
  });

  it('should update the network error status when call the update method', async () => {
    reportClient.retrieveByUrl = jest.fn().mockImplementation(async () => MOCK_RETRIEVE_REPORT_RESPONSE);
    reportClient.polling = jest
      .fn()
      .mockRejectedValue(new TimeoutError('timeout error', AXIOS_REQUEST_ERROR_CODE.TIMEOUT));
    const { result } = setup();
    await act(async () => {
      await result.current.startToRequestData(MOCK_GENERATE_REPORT_REQUEST_PARAMS_WITH_BOARD_METRIC_TYPE);
    });
    expect(result.current.reportInfos[0].timeout4Dora.shouldShow).toEqual(true);
    expect(result.current.reportInfos[1].timeout4Dora.shouldShow).toEqual(true);
    await act(async () => {
      await result.current.closeReportInfosErrorStatus(
        MockedDateRanges[0].startDate,
        TimeoutErrorKey[METRIC_TYPES.DORA],
      );
    });
    expect(result.current.reportInfos[0].timeout4Dora.shouldShow).toEqual(false);
    expect(result.current.reportInfos[1].timeout4Dora.shouldShow).toEqual(true);
  });
});
