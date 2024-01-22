import { useNotificationLayoutEffectInterface } from '@src/hooks/useNotificationLayoutEffect';
import { BoardReportRequestDTO, ReportRequestDTO } from '@src/clients/report/dto/request';
import { exportValidityTimeMapper } from '@src/hooks/reportMapper/exportValidityTime';
import { ReportResponseDTO } from '@src/clients/report/dto/response';
import { TimeoutException } from '@src/exceptions/TimeoutException';
import { MESSAGE, TIMEOUT_PROMPT } from '@src/constants/resources';
import { reportClient } from '@src/clients/report/ReportClient';
import { METRIC_TYPES } from '@src/constants/commons';
import { useRef, useState } from 'react';

export interface useGenerateReportEffectInterface {
  startToRequestBoardData: (boardParams: BoardReportRequestDTO) => void;
  startToRequestDoraData: (doraParams: ReportRequestDTO) => void;
  stopPollingReports: () => void;
  timeout4Board: string;
  timeout4Dora: string;
  timeout4Report: string;
  reportData: ReportResponseDTO | undefined;
}

export const useGenerateReportEffect = ({
  addNotification,
}: useNotificationLayoutEffectInterface): useGenerateReportEffectInterface => {
  const reportPath = '/reports';
  const [timeout4Board, setTimeout4Board] = useState('');
  const [timeout4Dora, setTimeout4Dora] = useState('');
  const [timeout4Report, setTimeout4Report] = useState('');
  const [reportData, setReportData] = useState<ReportResponseDTO | undefined>();
  const timerIdRef = useRef<number>();
  let hasPollingStarted = false;

  const startToRequestBoardData = (boardParams: ReportRequestDTO) => {
    setTimeout4Board('');
    reportClient
      .retrieveByUrl(boardParams, `${reportPath}/${METRIC_TYPES.BOARD}`)
      .then((res) => {
        if (hasPollingStarted) return;
        hasPollingStarted = true;
        pollingReport(res.response.callbackUrl, res.response.interval);
      })
      .catch((e) => {
        handleError(e, 'Board');
        stopPollingReports();
      });
  };

  const handleError = (error: Error, source: string) => {
    if (error instanceof TimeoutException) {
      if (source === 'Board') {
        setTimeout4Board(TIMEOUT_PROMPT);
      } else if (source === 'Dora') {
        setTimeout4Dora(TIMEOUT_PROMPT);
      } else {
        setTimeout4Report(TIMEOUT_PROMPT);
      }
    } else {
      addNotification({
        message: MESSAGE.FAILED_TO_REQUEST,
        type: 'error',
      });
    }
  };

  const startToRequestDoraData = (doraParams: ReportRequestDTO) => {
    setTimeout4Dora('');
    reportClient
      .retrieveByUrl(doraParams, `${reportPath}/${METRIC_TYPES.DORA}`)
      .then((res) => {
        if (hasPollingStarted) return;
        hasPollingStarted = true;
        pollingReport(res.response.callbackUrl, res.response.interval);
      })
      .catch((e) => {
        handleError(e, 'Dora');
        stopPollingReports();
      });
  };

  const pollingReport = (url: string, interval: number) => {
    setTimeout4Report('');
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
        handleError(e, 'All');
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
    startToRequestBoardData,
    startToRequestDoraData,
    stopPollingReports,
    reportData,
    timeout4Board,
    timeout4Dora,
    timeout4Report,
  };
};
