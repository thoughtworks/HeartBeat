import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect';
import { useAppSelector } from '@src/hooks';
import { isSelectBoardMetrics, isSelectDoraMetrics, selectConfig } from '@src/context/config/configSlice';
import { MESSAGE, REPORT_PAGE_TYPE } from '@src/constants/resources';
import { StyledCalendarWrapper, StyledErrorNotification } from '@src/components/Metrics/ReportStep/style';
import { ErrorNotification } from '@src/components/ErrorNotification';
import { useNavigate } from 'react-router-dom';
import { useNotificationLayoutEffectInterface } from '@src/hooks/useNotificationLayoutEffect';
import { ROUTE } from '@src/constants/router';
import { ReportButtonGroup } from '@src/components/Metrics/ReportButtonGroup';
import BoardMetrics from '@src/components/Metrics/ReportStep/BoradMetrics';
import DoraMetrics from '@src/components/Metrics/ReportStep/DoraMetrics';
import { backStep, selectTimeStamp } from '@src/context/stepper/StepperSlice';
import DateRangeViewer from '@src/components/Common/DateRangeViewer';
import { BoardDetail, DoraDetail } from './ReportDetail';
import { ReportResponseDTO } from '@src/clients/report/dto/response';
import { useAppDispatch } from '@src/hooks/useAppDispatch';

export interface ReportStepProps {
  notification: useNotificationLayoutEffectInterface;
  handleSave: () => void;
}

const ReportStep = ({ notification, handleSave }: ReportStepProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    isServerError,
    errorMessage: reportErrorMsg,
    startToRequestBoardData,
    startToRequestDoraData,
    reportData,
    stopPollingReports,
  } = useGenerateReportEffect();

  const [exportValidityTimeMin, setExportValidityTimeMin] = useState<number | undefined | null>(undefined);
  const [pageType, setPageType] = useState<string>(REPORT_PAGE_TYPE.SUMMARY);
  const [isBackFromDetail, setIsBackFromDetail] = useState<boolean>(false);
  const [isAllMetricsReady, setIsAllMetricsReady] = useState<boolean>(false);
  const configData = useAppSelector(selectConfig);
  const csvTimeStamp = useAppSelector(selectTimeStamp);

  const startDate = configData.basic.dateRange.startDate ?? '';
  const endDate = configData.basic.dateRange.endDate ?? '';

  const { updateProps } = notification;
  const [errorMessage, setErrorMessage] = useState<string>();

  const shouldShowBoardMetrics = useAppSelector(isSelectBoardMetrics);
  const shouldShowDoraMetrics = useAppSelector(isSelectDoraMetrics);

  useLayoutEffect(() => {
    exportValidityTimeMin &&
      isAllMetricsReady &&
      updateProps?.({
        open: true,
        title: 'Help Information',
        message: MESSAGE.EXPIRE_INFORMATION(exportValidityTimeMin),
        closeAutomatically: true,
      });
  }, [exportValidityTimeMin, isAllMetricsReady]);

  useLayoutEffect(() => {
    if (exportValidityTimeMin) {
      const startTime = Date.now();
      const timer = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;

        const remainingExpireTime = 5 * 60 * 1000;
        const remainingTime = exportValidityTimeMin * 60 * 1000 - elapsedTime;
        if (remainingTime <= remainingExpireTime) {
          updateProps?.({
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
  }, [exportValidityTimeMin]);

  useEffect(() => {
    setErrorMessage(reportErrorMsg);
  }, [reportErrorMsg]);

  useEffect(() => {
    setExportValidityTimeMin(reportData?.exportValidityTime);
    reportData && setIsAllMetricsReady(reportData.isAllMetricsReady);
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
        />
      )}
    </>
  );
  const showBoardDetail = (data: ReportResponseDTO) => <BoardDetail onBack={() => backToSummaryPage()} data={data} />;
  const showDoraDetail = (data: ReportResponseDTO) => <DoraDetail onBack={() => backToSummaryPage()} data={data} />;

  const handleBack = () => {
    pageType === REPORT_PAGE_TYPE.SUMMARY ? dispatch(backStep()) : backToSummaryPage();
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
            <StyledCalendarWrapper>
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
