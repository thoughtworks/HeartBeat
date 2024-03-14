import { IBasicReportRequestDTO, ReportRequestDTO } from '@src/clients/report/dto/request';
import { exportValidityTimeMapper } from '@src/hooks/reportMapper/exportValidityTime';
import { ReportResponseDTO } from '@src/clients/report/dto/response';
import { reportClient } from '@src/clients/report/ReportClient';
import { DATA_LOADING_FAILED } from '@src/constants/resources';
import { TimeoutError } from '@src/errors/TimeoutError';
import { METRIC_TYPES } from '@src/constants/commons';
import { useRef, useState } from 'react';

export interface useGenerateReportEffectInterface {
  startToRequestBoardData: (boardParams: IBasicReportRequestDTO) => void;
  startToRequestDoraData: (doraParams: ReportRequestDTO) => void;
  stopPollingReports: () => void;
  timeout4Board: string;
  timeout4Dora: string;
  timeout4Report: string;
  generalError4Board: string;
  generalError4Dora: string;
  generalError4Report: string;
  reportData: ReportResponseDTO | undefined;
  allDataCompleted: boolean;
}

export const useGenerateReportEffect = (): useGenerateReportEffectInterface => {
  const reportPath = '/reports';
  const [timeout4Board, setTimeout4Board] = useState('');
  const [timeout4Dora, setTimeout4Dora] = useState('');
  const [timeout4Report, setTimeout4Report] = useState('');
  const [generalError4Board, setGeneralError4Board] = useState('');
  const [generalError4Dora, setGeneralError4Dora] = useState('');
  const [generalError4Report, setGeneralError4Report] = useState('');
  const [allDataCompleted, setAllDataCompleted] = useState(false);
  const [reportData, setReportData] = useState<ReportResponseDTO | undefined>();
  const timerIdRef = useRef<number | undefined>();
  let hasPollingStarted = false;
  const doraCalled = useRef<boolean>(false);
  const boardCalled = useRef<boolean>(false);

  const startToRequestBoardData = (boardParams: ReportRequestDTO) => {
    setTimeout4Board('');
    reportClient
      .retrieveByUrl(boardParams, `${reportPath}/${METRIC_TYPES.BOARD}`)
      .then((res) => {
        boardCalled.current = true;
        if (hasPollingStarted) return;
        hasPollingStarted = true;
        pollingReport(res.response.callbackUrl, res.response.interval);
      })
      .catch((e) => {
        handleError(e, 'Board');
      });
  };

  const handleError = (error: Error, source: string) => {
    if (error instanceof TimeoutError) {
      if (source === 'Board') {
        setTimeout4Board(DATA_LOADING_FAILED);
      } else if (source === 'Dora') {
        setTimeout4Dora(DATA_LOADING_FAILED);
      } else {
        setTimeout4Report(DATA_LOADING_FAILED);
      }
    } else {
      if (source === 'Board') {
        setGeneralError4Board(DATA_LOADING_FAILED);
      } else if (source === 'Dora') {
        setGeneralError4Dora(DATA_LOADING_FAILED);
      } else {
        setGeneralError4Report(DATA_LOADING_FAILED);
      }
    }
  };

  const startToRequestDoraData = (doraParams: ReportRequestDTO) => {
    setTimeout4Dora('');
    reportClient
      .retrieveByUrl(doraParams, `${reportPath}/${METRIC_TYPES.DORA}`)
      .then((res) => {
        doraCalled.current = true;
        if (hasPollingStarted) return;
        hasPollingStarted = true;
        pollingReport(res.response.callbackUrl, res.response.interval);
      })
      .catch((e) => {
        handleError(e, 'Dora');
      });
  };

  const setAllMetricsCompleted = (response: ReportResponseDTO) => {
    if (doraCalled.current && boardCalled.current) {
      setAllDataCompleted(response.boardMetricsCompleted && response.doraMetricsCompleted);
    } else if (doraCalled.current && !boardCalled.current) {
      setAllDataCompleted(response.doraMetricsCompleted);
    } else if (!doraCalled.current && boardCalled.current) {
      setAllDataCompleted(response.boardMetricsCompleted);
    }
  };

  const checkAllMetricsCompleted = (boardMetricsCompleted: boolean, doraMetricsCompleted: boolean) => {
    if (doraCalled.current && boardCalled.current) {
      return boardMetricsCompleted && doraMetricsCompleted;
    } else if (doraCalled.current && !boardCalled.current) {
      return doraMetricsCompleted;
    } else if (!doraCalled.current && boardCalled.current) {
      return boardMetricsCompleted;
    }
  };

  const pollingReport = (url: string, interval: number) => {
    setTimeout4Report('');
    reportClient
      .polling(url)
      .then((res: { status: number; response: ReportResponseDTO }) => {
        const response = res.response;
        handleAndUpdateData(response);
        setAllMetricsCompleted(response);
        if (
          checkAllMetricsCompleted(response.boardMetricsCompleted, response.doraMetricsCompleted) ||
          !hasPollingStarted
        ) {
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
    generalError4Board,
    generalError4Dora,
    generalError4Report,
    allDataCompleted,
  };
};
