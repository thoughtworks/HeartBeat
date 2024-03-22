import {
  BOARD_METRICS,
  BOARD_METRICS_MAPPING,
  CALENDAR,
  METRICS_SUBTITLE,
  METRICS_TITLE,
  REPORT_PAGE,
  REQUIRED_DATA,
  RETRY,
  SHOW_MORE,
} from '@src/constants/resources';
import {
  StyledLoading,
  StyledMetricsSection,
  StyledRetry,
  StyledShowMore,
  StyledTitleWrapper,
} from '@src/containers/ReportStep/BoardMetrics/BoardMetrics';
import {
  filterAndMapCycleTimeSettings,
  formatDuplicatedNameWithSuffix,
  getJiraBoardToken,
  getRealDoneStatus,
} from '@src/utils/util';
import { IBasicReportRequestDTO, ReportRequestDTO } from '@src/clients/report/dto/request';
import { GridContainer } from '@src/containers/ReportStep/BoardMetrics/style';
import { ReportTitle } from '@src/components/Common/ReportGrid/ReportTitle';
import { selectMetricsContent } from '@src/context/Metrics/metricsSlice';
import { ReportResponseDTO } from '@src/clients/report/dto/response';
import { ReportGrid } from '@src/components/Common/ReportGrid';
import { selectConfig } from '@src/context/config/configSlice';
import { Loading } from '@src/components/Loading';
import { Nullable } from '@src/utils/types';
import { useAppSelector } from '@src/hooks';
import React, { useEffect } from 'react';
import dayjs from 'dayjs';

interface BoardMetricsProps {
  startToRequestBoardData: (request: ReportRequestDTO) => void;
  onShowDetail: () => void;
  boardReport?: ReportResponseDTO;
  csvTimeStamp: number;
  startDate: Nullable<string>;
  endDate: Nullable<string>;
  isBackFromDetail: boolean;
  errorMessage: string;
}

const BoardMetrics = ({
  isBackFromDetail,
  startToRequestBoardData,
  onShowDetail,
  boardReport,
  csvTimeStamp,
  startDate,
  endDate,
  errorMessage,
}: BoardMetricsProps) => {
  const configData = useAppSelector(selectConfig);
  const {
    cycleTimeSettingsType,
    cycleTimeSettings,
    treatFlagCardAsBlock,
    users,
    targetFields,
    doneColumn,
    assigneeFilter,
    importedData: { importedAdvancedSettings, reworkTimesSettings },
  } = useAppSelector(selectMetricsContent);

  const { metrics, calendarType } = configData.basic;
  const { board } = configData;
  const { token, type, site, projectKey, boardId, email } = board.config;
  const jiraToken = getJiraBoardToken(token, email);
  const boardMetrics = metrics.filter((metric) => BOARD_METRICS.includes(metric));
  const includeRework = boardMetrics.includes(REQUIRED_DATA.REWORK_TIMES);
  const boardMetricsCompleted = boardMetrics
    .map((metric) => BOARD_METRICS_MAPPING[metric])
    .every((metric) => boardReport?.[metric] ?? false);

  const getBoardReportRequestBody = (): IBasicReportRequestDTO => {
    return {
      metrics: boardMetrics,
      startTime: dayjs(startDate).valueOf().toString(),
      endTime: dayjs(endDate).valueOf().toString(),
      considerHoliday: calendarType === CALENDAR.CHINA,
      jiraBoardSetting: {
        token: jiraToken,
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
        reworkTimesSetting: includeRework
          ? {
              reworkState: reworkTimesSettings.rework2State,
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
      },
      csvTimeStamp: csvTimeStamp,
    };
  };

  const getBoardItems = () => {
    const velocity = boardReport?.velocity;
    const cycleTime = boardReport?.cycleTime;

    const velocityItems = boardMetrics.includes(REQUIRED_DATA.VELOCITY)
      ? [
          {
            title: METRICS_TITLE.VELOCITY,
            items: velocity && [
              {
                value: velocity.velocityForSP,
                subtitle: METRICS_SUBTITLE.VELOCITY,
                isToFixed: false,
              },
              {
                value: velocity.velocityForCards,
                subtitle: METRICS_SUBTITLE.THROUGHPUT,
                isToFixed: false,
              },
            ],
          },
        ]
      : [];

    const cycleTimeItems = boardMetrics.includes(REQUIRED_DATA.CYCLE_TIME)
      ? [
          {
            title: METRICS_TITLE.CYCLE_TIME,
            items: cycleTime && [
              {
                value: cycleTime.averageCycleTimePerSP,
                subtitle: METRICS_SUBTITLE.AVERAGE_CYCLE_TIME_PRE_SP,
              },
              {
                value: cycleTime.averageCycleTimePerCard,
                subtitle: METRICS_SUBTITLE.AVERAGE_CYCLE_TIME_PRE_CARD,
              },
            ],
          },
        ]
      : [];

    return [...velocityItems, ...cycleTimeItems];
  };

  const getReworkBoardItem = () => {
    const rework = boardReport?.rework;

    const reworkItems = boardMetrics.includes(REQUIRED_DATA.REWORK_TIMES)
      ? [
          {
            title: METRICS_TITLE.REWORK,
            items: rework && [
              {
                value: rework.totalReworkTimes,
                subtitle: METRICS_SUBTITLE.TOTAL_REWORK_TIMES,
                isToFixed: false,
              },
              {
                value: rework.totalReworkCards,
                subtitle: METRICS_SUBTITLE.TOTAL_REWORK_CARDS,
                isToFixed: false,
              },
              {
                value: Number(rework.reworkCardsRatio) * 100,
                extraValue: `% (${rework.totalReworkCards}/${rework.throughput})`,
                subtitle: METRICS_SUBTITLE.REWORK_CARDS_RATIO,
              },
            ],
          },
        ]
      : [];
    return [...reworkItems];
  };

  const handleRetry = () => {
    startToRequestBoardData(getBoardReportRequestBody());
  };

  const isShowMoreLoadingDisplay = () =>
    boardMetrics.length === 1 &&
    boardMetrics[0] === REQUIRED_DATA.CLASSIFICATION &&
    !errorMessage &&
    !boardReport?.boardMetricsCompleted;

  useEffect(() => {
    !isBackFromDetail && startToRequestBoardData(getBoardReportRequestBody());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <StyledMetricsSection>
        <StyledTitleWrapper>
          <ReportTitle title={REPORT_PAGE.BOARD.TITLE} />
          {!errorMessage && boardMetricsCompleted && (
            <StyledShowMore onClick={onShowDetail}>{SHOW_MORE}</StyledShowMore>
          )}
          {isShowMoreLoadingDisplay() && (
            <StyledLoading>
              <Loading placement='left' size='0.8rem' backgroundColor='transparent' />
            </StyledLoading>
          )}
          {errorMessage && <StyledRetry onClick={handleRetry}>{RETRY}</StyledRetry>}
        </StyledTitleWrapper>
        <GridContainer>
          <ReportGrid reportDetails={getBoardItems()} errorMessage={errorMessage} lastGrid={true} />
          <ReportGrid reportDetails={getReworkBoardItem()} errorMessage={errorMessage} lastGrid={true} />
        </GridContainer>
      </StyledMetricsSection>
    </>
  );
};

export default BoardMetrics;
