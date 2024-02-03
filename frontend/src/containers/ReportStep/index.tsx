import {
  isOnlySelectClassification,
  isSelectBoardMetrics,
  isSelectDoraMetrics,
  selectConfig,
} from '@src/context/config/configSlice';
import { addNotification, closeAllNotifications, Notification } from '@src/context/notification/NotificationSlice';
import { backStep, selectTimeStamp } from '@src/context/stepper/StepperSlice';
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { StyledCalendarWrapper } from '@src/containers/ReportStep/style';
import { ReportButtonGroup } from '@src/containers/ReportButtonGroup';
import DateRangeViewer from '@src/components/Common/DateRangeViewer';
import { ReportResponseDTO } from '@src/clients/report/dto/response';
import { MESSAGE, REPORT_PAGE_TYPE } from '@src/constants/resources';
import BoardMetrics from '@src/containers/ReportStep/BoardMetrics';
import DoraMetrics from '@src/containers/ReportStep/DoraMetrics';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { BoardDetail, DoraDetail } from './ReportDetail';
import { useAppSelector } from '@src/hooks';

export interface ReportStepProps {
  handleSave: () => void;
}

const ReportStep = ({ handleSave }: ReportStepProps) => {
  const dispatch = useAppDispatch();
  const {
    startToRequestBoardData,
    startToRequestDoraData,
    reportData,
    stopPollingReports,
    timeout4Board,
    timeout4Dora,
    timeout4Report,
    generalError4Board,
    generalError4Dora,
    generalError4Report,
  } = useGenerateReportEffect();

  const [exportValidityTimeMin, setExportValidityTimeMin] = useState<number | undefined | null>(undefined);
  const [pageType, setPageType] = useState<string>(REPORT_PAGE_TYPE.SUMMARY);
  const [isBackFromDetail, setIsBackFromDetail] = useState<boolean>(false);
  const [allMetricsCompleted, setAllMetricsCompleted] = useState<boolean>(false);
  const [notifications4SummaryPage, setNotifications4SummaryPage] = useState<Omit<Notification, 'id'>[]>([]);

  const configData = useAppSelector(selectConfig);
  const csvTimeStamp = useAppSelector(selectTimeStamp);

  const startDate = configData.basic.dateRange.startDate ?? '';
  const endDate = configData.basic.dateRange.endDate ?? '';

  const shouldShowBoardMetrics = useAppSelector(isSelectBoardMetrics);
  const shouldShowDoraMetrics = useAppSelector(isSelectDoraMetrics);
  const onlySelectClassification = useAppSelector(isOnlySelectClassification);
  const isSummaryPage = useMemo(() => pageType === REPORT_PAGE_TYPE.SUMMARY, [pageType]);

  const getErrorMessage4Board = () => {
    if (reportData?.reportMetricsError.boardMetricsError) {
      return `Failed to get Jira info, status: ${reportData.reportMetricsError.boardMetricsError.status}`;
    }
    return timeout4Board || timeout4Report || generalError4Board || generalError4Report;
  };

  useEffect(() => {
    setPageType(onlySelectClassification ? REPORT_PAGE_TYPE.BOARD : REPORT_PAGE_TYPE.SUMMARY);
    return () => {
      stopPollingReports();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    exportValidityTimeMin &&
      allMetricsCompleted &&
      dispatch(
        addNotification({
          message: MESSAGE.EXPIRE_INFORMATION(exportValidityTimeMin),
        }),
      );
  }, [dispatch, exportValidityTimeMin, allMetricsCompleted]);

  useLayoutEffect(() => {
    if (exportValidityTimeMin && allMetricsCompleted) {
      const startTime = Date.now();
      const timer = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;

        const remainingExpireTime = 5 * 60 * 1000;
        const remainingTime = exportValidityTimeMin * 60 * 1000 - elapsedTime;
        if (remainingTime <= remainingExpireTime) {
          dispatch(
            addNotification({
              message: MESSAGE.EXPIRE_INFORMATION(5),
            }),
          );
          clearInterval(timer);
        }
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [dispatch, exportValidityTimeMin, allMetricsCompleted]);

  useLayoutEffect(() => {
    dispatch(closeAllNotifications());
  }, [dispatch, pageType]);

  useEffect(() => {
    setExportValidityTimeMin(reportData?.exportValidityTime);
    reportData && setAllMetricsCompleted(reportData.allMetricsCompleted);
  }, [dispatch, reportData]);

  useEffect(() => {
    if (isSummaryPage && notifications4SummaryPage.length > 0) {
      const notification = notifications4SummaryPage[0];
      notification && dispatch(addNotification(notification));
      setNotifications4SummaryPage(notifications4SummaryPage.slice(1));
    }
  }, [dispatch, notifications4SummaryPage, isSummaryPage]);

  useEffect(() => {
    if (reportData?.reportMetricsError.boardMetricsError) {
      setNotifications4SummaryPage((prevState) => [
        ...prevState,
        {
          message: MESSAGE.FAILED_TO_GET_DATA('Board Metrics'),
          type: 'error',
        },
      ]);
    }
  }, [reportData?.reportMetricsError.boardMetricsError]);

  useEffect(() => {
    if (reportData?.reportMetricsError.pipelineMetricsError) {
      setNotifications4SummaryPage((prevState) => [
        ...prevState,
        {
          message: MESSAGE.FAILED_TO_GET_DATA('Buildkite'),
          type: 'error',
        },
      ]);
    }
  }, [reportData?.reportMetricsError.pipelineMetricsError]);

  useEffect(() => {
    if (reportData?.reportMetricsError.sourceControlMetricsError) {
      setNotifications4SummaryPage((prevState) => [
        ...prevState,
        {
          message: MESSAGE.FAILED_TO_GET_DATA('Github'),
          type: 'error',
        },
      ]);
    }
  }, [reportData?.reportMetricsError.sourceControlMetricsError]);

  useEffect(() => {
    timeout4Report &&
      setNotifications4SummaryPage((prevState) => [
        ...prevState,
        {
          message: MESSAGE.LOADING_TIMEOUT('Report'),
          type: 'error',
        },
      ]);
  }, [timeout4Report]);

  useEffect(() => {
    timeout4Board &&
      setNotifications4SummaryPage((prevState) => [
        ...prevState,
        {
          message: MESSAGE.LOADING_TIMEOUT('Board metrics'),
          type: 'error',
        },
      ]);
  }, [timeout4Board]);

  useEffect(() => {
    timeout4Dora &&
      setNotifications4SummaryPage((prevState) => [
        ...prevState,
        {
          message: MESSAGE.LOADING_TIMEOUT('DORA metrics'),
          type: 'error',
        },
      ]);
  }, [timeout4Dora]);

  useEffect(() => {
    generalError4Board &&
      setNotifications4SummaryPage((prevState) => [
        ...prevState,
        {
          message: MESSAGE.FAILED_TO_REQUEST,
          type: 'error',
        },
      ]);
  }, [generalError4Board]);

  useEffect(() => {
    generalError4Dora &&
      setNotifications4SummaryPage((prevState) => [
        ...prevState,
        {
          message: MESSAGE.FAILED_TO_REQUEST,
          type: 'error',
        },
      ]);
  }, [generalError4Dora]);

  useEffect(() => {
    generalError4Report &&
      setNotifications4SummaryPage((prevState) => [
        ...prevState,
        {
          message: MESSAGE.FAILED_TO_REQUEST,
          type: 'error',
        },
      ]);
  }, [generalError4Report]);

  const showSummary = () => (
    <>
      {shouldShowBoardMetrics && (
        <BoardMetrics
          isBackFromDetail={isBackFromDetail}
          startDate={startDate}
          endDate={endDate}
          startToRequestBoardData={startToRequestBoardData}
          onShowDetail={() => setPageType(REPORT_PAGE_TYPE.BOARD)}
          boardReport={reportData}
          csvTimeStamp={csvTimeStamp}
          errorMessage={getErrorMessage4Board()}
        />
      )}
      {shouldShowDoraMetrics && (
        <DoraMetrics
          isBackFromDetail={isBackFromDetail}
          startDate={startDate}
          endDate={endDate}
          startToRequestDoraData={startToRequestDoraData}
          onShowDetail={() => setPageType(REPORT_PAGE_TYPE.DORA)}
          doraReport={reportData}
          csvTimeStamp={csvTimeStamp}
          errorMessage={timeout4Dora || timeout4Report || generalError4Dora || generalError4Report}
        />
      )}
    </>
  );
  const showBoardDetail = (data?: ReportResponseDTO) => (
    <BoardDetail onBack={() => handleBack()} data={data} errorMessage={getErrorMessage4Board()} />
  );
  const showDoraDetail = (data: ReportResponseDTO) => <DoraDetail onBack={() => backToSummaryPage()} data={data} />;

  const handleBack = () => {
    isSummaryPage || onlySelectClassification ? dispatch(backStep()) : backToSummaryPage();
  };

  const backToSummaryPage = () => {
    setPageType(REPORT_PAGE_TYPE.SUMMARY);
    setIsBackFromDetail(true);
  };

  return (
    <>
      {startDate && endDate && (
        <StyledCalendarWrapper data-testid={'calendarWrapper'} isSummaryPage={isSummaryPage}>
          <DateRangeViewer startDate={startDate} endDate={endDate} />
        </StyledCalendarWrapper>
      )}
      {isSummaryPage
        ? showSummary()
        : pageType === REPORT_PAGE_TYPE.BOARD
          ? showBoardDetail(reportData)
          : !!reportData && showDoraDetail(reportData)}
      <ReportButtonGroup
        isShowSave={isSummaryPage}
        isShowExportMetrics={isSummaryPage}
        isShowExportBoardButton={isSummaryPage ? shouldShowBoardMetrics : pageType === REPORT_PAGE_TYPE.BOARD}
        isShowExportPipelineButton={isSummaryPage ? shouldShowDoraMetrics : pageType === REPORT_PAGE_TYPE.DORA}
        handleBack={() => handleBack()}
        handleSave={() => handleSave()}
        reportData={reportData}
        startDate={startDate}
        endDate={endDate}
        csvTimeStamp={csvTimeStamp}
      />
    </>
  );
};

export default ReportStep;
