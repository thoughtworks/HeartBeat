import {
  filterAndMapCycleTimeSettings,
  formatDateToTimestampString,
  formatDuplicatedNameWithSuffix,
  getJiraBoardToken,
  getRealDoneStatus,
  onlyEmptyAndDoneState,
  sortDateRanges,
} from '@src/utils/util';
import {
  isOnlySelectClassification,
  isSelectBoardMetrics,
  isSelectDoraMetrics,
  selectConfig,
} from '@src/context/config/configSlice';
import {
  BOARD_METRICS,
  CALENDAR,
  DORA_METRICS,
  MESSAGE,
  REPORT_PAGE_TYPE,
  REQUIRED_DATA,
} from '@src/constants/resources';
import { addNotification, closeAllNotifications, Notification } from '@src/context/notification/NotificationSlice';
import { IPipelineConfig, selectMetricsContent } from '@src/context/Metrics/metricsSlice';
import { backStep, selectTimeStamp } from '@src/context/stepper/StepperSlice';
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { StyledCalendarWrapper } from '@src/containers/ReportStep/style';
import { ReportButtonGroup } from '@src/containers/ReportButtonGroup';
import DateRangeViewer from '@src/components/Common/DateRangeViewer';
import { ReportResponseDTO } from '@src/clients/report/dto/response';
import BoardMetrics from '@src/containers/ReportStep/BoardMetrics';
import DoraMetrics from '@src/containers/ReportStep/DoraMetrics';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { BoardDetail, DoraDetail } from './ReportDetail';
import { METRIC_TYPES } from '@src/constants/commons';
import { useAppSelector } from '@src/hooks';

export interface ReportStepProps {
  handleSave: () => void;
}

const ReportStep = ({ handleSave }: ReportStepProps) => {
  const dispatch = useAppDispatch();
  const {
    startToRequestData,
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
  const [isSuccessfulCreateCsvFile, setIsSuccessfulCreateCsvFile] = useState<boolean>(false);
  const [notifications4SummaryPage, setNotifications4SummaryPage] = useState<Omit<Notification, 'id'>[]>([]);

  const configData = useAppSelector(selectConfig);
  const csvTimeStamp = useAppSelector(selectTimeStamp);
  const {
    cycleTimeSettingsType,
    cycleTimeSettings,
    treatFlagCardAsBlock,
    users,
    targetFields,
    doneColumn,
    assigneeFilter,
    importedData: { importedAdvancedSettings, reworkTimesSettings },
    pipelineCrews,
    deploymentFrequencySettings,
    leadTimeForChanges,
  } = useAppSelector(selectMetricsContent);

  const descendingDateRanges = sortDateRanges(configData.basic.dateRange);
  const startDate = configData.basic.dateRange[0]?.startDate ?? '';
  const endDate = configData.basic.dateRange[0]?.endDate ?? '';
  const { metrics, calendarType } = configData.basic;
  const boardingMappingStates = [...new Set(cycleTimeSettings.map((item) => item.value))];
  const isOnlyEmptyAndDoneState = onlyEmptyAndDoneState(boardingMappingStates);
  const includeRework = metrics.includes(REQUIRED_DATA.REWORK_TIMES);
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

  const getJiraBoardSetting = () => {
    const { token, type, site, projectKey, boardId, email } = configData.board.config;

    return {
      token: getJiraBoardToken(token, email),
      type: type.toLowerCase().replace(' ', '-'),
      site,
      projectKey,
      boardId,
      boardColumns: filterAndMapCycleTimeSettings(cycleTimeSettings),
      treatFlagCardAsBlock,
      users,
      assigneeFilter,
      targetFields: formatDuplicatedNameWithSuffix(targetFields),
      doneColumn: getRealDoneStatus(cycleTimeSettings, cycleTimeSettingsType, doneColumn),
      reworkTimesSetting:
        includeRework && !isOnlyEmptyAndDoneState
          ? {
              reworkState: reworkTimesSettings.reworkState,
              excludedStates: reworkTimesSettings.excludeStates,
            }
          : null,
      overrideFields: [
        {
          name: 'Story Points',
          key: importedAdvancedSettings?.storyPoint ?? '',
          flag: true,
        },
        {
          name: 'Flagged',
          key: importedAdvancedSettings?.flag ?? '',
          flag: true,
        },
      ],
    };
  };

  const getDoraSetting = () => {
    const { pipelineTool, sourceControl } = configData;

    return {
      buildKiteSetting: {
        pipelineCrews,
        ...pipelineTool.config,
        deploymentEnvList: getPipelineConfig(deploymentFrequencySettings),
      },
      codebaseSetting: {
        type: sourceControl.config.type,
        token: sourceControl.config.token,
        leadTime: getPipelineConfig(leadTimeForChanges),
      },
    };
  };

  const getPipelineConfig = (pipelineConfigs: IPipelineConfig[]) =>
    pipelineConfigs.flatMap(({ organization, pipelineName, step, branches }) => {
      const pipelineConfigFromPipelineList = configData.pipelineTool.verifiedResponse.pipelineList.find(
        (pipeline) => pipeline.name === pipelineName && pipeline.orgName === organization,
      );
      if (pipelineConfigFromPipelineList) {
        const { orgName, orgId, name, id, repository } = pipelineConfigFromPipelineList;
        return [
          {
            orgId,
            orgName,
            id,
            name,
            step,
            repository,
            branches,
          },
        ];
      }
      return [];
    });

  const basicReportRequestBody = {
    startTime: formatDateToTimestampString(startDate),
    endTime: formatDateToTimestampString(endDate),
    considerHoliday: calendarType === CALENDAR.CHINA,
    csvTimeStamp,
    metrics,
    metricTypes: [
      ...(shouldShowBoardMetrics ? [METRIC_TYPES.BOARD] : []),
      ...(shouldShowDoraMetrics ? [METRIC_TYPES.DORA] : []),
    ],
    jiraBoardSetting: shouldShowBoardMetrics ? getJiraBoardSetting() : undefined,
    ...(shouldShowDoraMetrics ? getDoraSetting() : {}),
  };

  const boardReportRequestBody = {
    ...basicReportRequestBody,
    metrics: metrics.filter((metric) => BOARD_METRICS.includes(metric)),
    metricTypes: [METRIC_TYPES.BOARD],
    buildKiteSetting: undefined,
    codebaseSetting: undefined,
  };

  const doraReportRequestBody = {
    ...basicReportRequestBody,
    metrics: metrics.filter((metric) => DORA_METRICS.includes(metric)),
    metricTypes: [METRIC_TYPES.DORA],
    jiraBoardSetting: undefined,
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
      isSuccessfulCreateCsvFile &&
      dispatch(
        addNotification({
          message: MESSAGE.EXPIRE_INFORMATION(exportValidityTimeMin),
        }),
      );
  }, [dispatch, exportValidityTimeMin, isSuccessfulCreateCsvFile]);

  useLayoutEffect(() => {
    if (exportValidityTimeMin && isSuccessfulCreateCsvFile) {
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
  }, [dispatch, exportValidityTimeMin, isSuccessfulCreateCsvFile]);

  useLayoutEffect(() => {
    dispatch(closeAllNotifications());
  }, [dispatch, pageType]);

  useEffect(() => {
    setExportValidityTimeMin(reportData?.exportValidityTime);
    reportData && setIsSuccessfulCreateCsvFile(reportData.isSuccessfulCreateCsvFile);
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
          message: MESSAGE.FAILED_TO_GET_DATA('GitHub'),
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

  useEffect(() => {
    startToRequestData(basicReportRequestBody);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showSummary = () => (
    <>
      {shouldShowBoardMetrics && (
        <BoardMetrics
          startToRequestBoardData={() => startToRequestData(boardReportRequestBody)}
          onShowDetail={() => setPageType(REPORT_PAGE_TYPE.BOARD)}
          boardReport={reportData}
          errorMessage={getErrorMessage4Board()}
        />
      )}
      {shouldShowDoraMetrics && (
        <DoraMetrics
          startToRequestDoraData={() => startToRequestData(doraReportRequestBody)}
          onShowDetail={() => setPageType(REPORT_PAGE_TYPE.DORA)}
          doraReport={reportData}
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
  };

  return (
    <>
      {startDate && endDate && (
        <StyledCalendarWrapper data-testid={'calendarWrapper'} isSummaryPage={isSummaryPage}>
          <DateRangeViewer dateRanges={descendingDateRanges} />
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
