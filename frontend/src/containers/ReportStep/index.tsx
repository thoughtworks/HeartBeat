import { isSelectBoardMetrics, isSelectDoraMetrics, selectConfig } from '@src/context/config/configSlice';
import { StyledCalendarWrapper, StyledErrorNotification } from '@src/containers/ReportStep/style';
import { useNotificationLayoutEffectInterface } from '@src/hooks/useNotificationLayoutEffect';
import { MESSAGE, REPORT_PAGE_TYPE, REQUIRED_DATA } from '@src/constants/resources';
import { backStep, selectTimeStamp } from '@src/context/stepper/StepperSlice';
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect';
import { ErrorNotification } from '@src/components/ErrorNotification';
import { ReportButtonGroup } from '@src/containers/ReportButtonGroup';
import DateRangeViewer from '@src/components/Common/DateRangeViewer';
import { ReportResponseDTO } from '@src/clients/report/dto/response';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import BoardMetrics from '@src/containers/ReportStep/BoardMetrics';
import DoraMetrics from '@src/containers/ReportStep/DoraMetrics';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { BoardDetail, DoraDetail } from './ReportDetail';
import { useNavigate } from 'react-router-dom';
import { ROUTE } from '@src/constants/router';
import { useAppSelector } from '@src/hooks';

export interface ReportStepProps {
  notification: useNotificationLayoutEffectInterface;
  handleSave: () => void;
}

const ReportStep = ({ notification, handleSave }: ReportStepProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    isServerError,
    startToRequestBoardData,
    startToRequestDoraData,
    reportData,
    stopPollingReports,
    timeout4Board,
    timeout4Dora,
  } = useGenerateReportEffect();

  const [exportValidityTimeMin, setExportValidityTimeMin] = useState<number | undefined | null>(undefined);
  const [pageType, setPageType] = useState<string>(REPORT_PAGE_TYPE.SUMMARY);
  const [isBackFromDetail, setIsBackFromDetail] = useState<boolean>(false);
  const [allMetricsCompleted, setAllMetricsCompleted] = useState<boolean>(false);
  const configData = useAppSelector(selectConfig);
  const csvTimeStamp = useAppSelector(selectTimeStamp);

  const startDate = configData.basic.dateRange.startDate ?? '';
  const endDate = configData.basic.dateRange.endDate ?? '';
  const metrics = configData.basic.metrics;

  const { updateProps, resetProps } = notification;
  const [errorMessage, setErrorMessage] = useState<string>();

  const shouldShowBoardMetrics = useAppSelector(isSelectBoardMetrics);
  const shouldShowDoraMetrics = useAppSelector(isSelectDoraMetrics);
  const onlySelectClassification = metrics.length === 1 && metrics[0] === REQUIRED_DATA.CLASSIFICATION;

  useEffect(() => {
    setPageType(onlySelectClassification ? REPORT_PAGE_TYPE.BOARD : REPORT_PAGE_TYPE.SUMMARY);
  }, []);

  useLayoutEffect(() => {
    exportValidityTimeMin &&
      allMetricsCompleted &&
      updateProps({
        open: true,
        title: 'Help Information',
        message: MESSAGE.EXPIRE_INFORMATION(exportValidityTimeMin),
        closeAutomatically: true,
      });
  }, [exportValidityTimeMin, allMetricsCompleted, updateProps]);

  useLayoutEffect(() => {
    if (exportValidityTimeMin && allMetricsCompleted) {
      const startTime = Date.now();
      const timer = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;

        const remainingExpireTime = 5 * 60 * 1000;
        const remainingTime = exportValidityTimeMin * 60 * 1000 - elapsedTime;
        if (remainingTime <= remainingExpireTime) {
          updateProps({
            open: true,
            title: 'Help Information',
            message: MESSAGE.EXPIRE_INFORMATION(5),
            closeAutomatically: true,
          });
          clearInterval(timer);
        }
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [exportValidityTimeMin, allMetricsCompleted, updateProps]);

  useLayoutEffect(() => {
    resetProps();
  }, [pageType, resetProps]);

  useEffect(() => {
    setExportValidityTimeMin(reportData?.exportValidityTime);
    reportData && setAllMetricsCompleted(reportData.allMetricsCompleted);
  }, [reportData]);

  useLayoutEffect(() => {
    return () => {
      stopPollingReports();
    };
  }, []);

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
          timeoutError={timeout4Board}
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
          timeoutError={timeout4Dora}
        />
      )}
    </>
  );
  const showBoardDetail = (data: ReportResponseDTO) => <BoardDetail onBack={() => handleBack()} data={data} />;
  const showDoraDetail = (data: ReportResponseDTO) => <DoraDetail onBack={() => backToSummaryPage()} data={data} />;

  const handleBack = () => {
    pageType === REPORT_PAGE_TYPE.SUMMARY || onlySelectClassification ? dispatch(backStep()) : backToSummaryPage();
  };

  const backToSummaryPage = () => {
    setPageType(REPORT_PAGE_TYPE.SUMMARY);
    setIsBackFromDetail(true);
  };

  return (
    <>
      {isServerError ? (
        navigate(ROUTE.ERROR_PAGE)
      ) : (
        <>
          {startDate && endDate && (
            <StyledCalendarWrapper
              data-testid={'calendarWrapper'}
              isSummaryPage={pageType === REPORT_PAGE_TYPE.SUMMARY}
            >
              <DateRangeViewer startDate={startDate} endDate={endDate} />
            </StyledCalendarWrapper>
          )}
          {errorMessage && (
            <StyledErrorNotification>
              <ErrorNotification message={errorMessage} />
            </StyledErrorNotification>
          )}
          {pageType === REPORT_PAGE_TYPE.SUMMARY
            ? showSummary()
            : !!reportData &&
              (pageType === REPORT_PAGE_TYPE.BOARD ? showBoardDetail(reportData) : showDoraDetail(reportData))}
          <ReportButtonGroup
            isShowSave={pageType === REPORT_PAGE_TYPE.SUMMARY}
            isShowExportMetrics={pageType === REPORT_PAGE_TYPE.SUMMARY}
            isShowExportBoardButton={
              pageType === REPORT_PAGE_TYPE.SUMMARY ? shouldShowBoardMetrics : pageType === REPORT_PAGE_TYPE.BOARD
            }
            isShowExportPipelineButton={
              pageType === REPORT_PAGE_TYPE.SUMMARY ? shouldShowDoraMetrics : pageType === REPORT_PAGE_TYPE.DORA
            }
            handleBack={() => handleBack()}
            handleSave={() => handleSave()}
            reportData={reportData}
            startDate={startDate}
            endDate={endDate}
            csvTimeStamp={csvTimeStamp}
            setErrorMessage={(message) => {
              setErrorMessage(message);
            }}
          />
        </>
      )}
    </>
  );
};

export default ReportStep;
