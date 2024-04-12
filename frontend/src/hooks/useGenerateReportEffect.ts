import { exportValidityTimeMapper } from '@src/hooks/reportMapper/exportValidityTime';
import { DATA_LOADING_FAILED, DEFAULT_MESSAGE } from '@src/constants/resources';
import { ReportResponseDTO } from '@src/clients/report/dto/response';
import { ReportRequestDTO } from '@src/clients/report/dto/request';
import { reportClient } from '@src/clients/report/ReportClient';
import { TimeoutError } from '@src/errors/TimeoutError';
import { METRIC_TYPES } from '@src/constants/commons';
import { useRef, useState } from 'react';

export interface useGenerateReportEffectInterface {
  startToRequestData: (params: ReportRequestDTO) => void;
  stopPollingReports: () => void;
  timeout4Board: string;
  timeout4Dora: string;
  timeout4Report: string;
  generalError4Board: string;
  generalError4Dora: string;
  generalError4Report: string;
  reportData: ReportResponseDTO | undefined;
}

export const useGenerateReportEffect = (): useGenerateReportEffectInterface => {
  const reportPath = '/reports';
  const [timeout4Board, setTimeout4Board] = useState(DEFAULT_MESSAGE);
  const [timeout4Dora, setTimeout4Dora] = useState(DEFAULT_MESSAGE);
  const [timeout4Report, setTimeout4Report] = useState(DEFAULT_MESSAGE);
  const [generalError4Board, setGeneralError4Board] = useState(DEFAULT_MESSAGE);
  const [generalError4Dora, setGeneralError4Dora] = useState(DEFAULT_MESSAGE);
  const [generalError4Report, setGeneralError4Report] = useState(DEFAULT_MESSAGE);
  const [reportData, setReportData] = useState<ReportResponseDTO | undefined>();
  const timerIdRef = useRef<number>();
  let hasPollingStarted = false;

  const startToRequestData = (params: ReportRequestDTO) => {
    const { metricTypes } = params;
    resetTimeoutMessage(metricTypes);
    reportClient
      .retrieveByUrl(params, reportPath)
      .then((res) => {
        if (hasPollingStarted) return;
        hasPollingStarted = true;
        pollingReport(res.response.callbackUrl, res.response.interval);
      })
      .catch((e) => {
        const source: METRIC_TYPES = metricTypes.length === 2 ? METRIC_TYPES.ALL : metricTypes[0];
        handleError(e, source);
      });
  };

  const resetTimeoutMessage = (metricTypes: string[]) => {
    if (metricTypes.length === 2) {
      setTimeout4Report(DEFAULT_MESSAGE);
    } else if (metricTypes.includes(METRIC_TYPES.BOARD)) {
      setTimeout4Board(DEFAULT_MESSAGE);
    } else {
      setTimeout4Dora(DEFAULT_MESSAGE);
    }
  };

  const handleTimeoutError = {
    [METRIC_TYPES.BOARD]: setTimeout4Board,
    [METRIC_TYPES.DORA]: setTimeout4Dora,
    [METRIC_TYPES.ALL]: setTimeout4Report,
  };

  const handleGeneralError = {
    [METRIC_TYPES.BOARD]: setGeneralError4Board,
    [METRIC_TYPES.DORA]: setGeneralError4Dora,
    [METRIC_TYPES.ALL]: setGeneralError4Report,
  };

  const handleError = (error: Error, source: METRIC_TYPES) => {
    return error instanceof TimeoutError
      ? handleTimeoutError[source](DATA_LOADING_FAILED)
      : handleGeneralError[source](DATA_LOADING_FAILED);
  };

  const pollingReport = (url: string, interval: number) => {
    setTimeout4Report(DEFAULT_MESSAGE);
    reportClient
      .polling(url)
      .then((res: { status: number; response: ReportResponseDTO }) => {
        const response = res.response;
        handleAndUpdateData(response);
        if (response.allMetricsCompleted || !hasPollingStarted) {
          stopPollingReports();
        } else {
          timerIdRef.current = window.setTimeout(() => pollingReport(url, interval), interval * 1000);
        }
      })
      .catch((e) => {
        handleError(e, METRIC_TYPES.ALL);
        stopPollingReports();
      });
  };

  const stopPollingReports = () => {
    window.clearTimeout(timerIdRef.current);
    hasPollingStarted = false;
  };

  const handleAndUpdateData = (response: ReportResponseDTO) => {
    const exportValidityTime = exportValidityTimeMapper(response.exportValidityTime);
    setReportData({ ...response, exportValidityTime: exportValidityTime });
  };

  return {
    startToRequestData,
    stopPollingReports,
    reportData,
    timeout4Board,
    timeout4Dora,
    timeout4Report,
    generalError4Board,
    generalError4Dora,
    generalError4Report,
  };
};
