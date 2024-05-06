import {
  GridContainer,
  StyledLoading,
  StyledMetricsSection,
  StyledRetry,
  StyledShowMore,
  StyledTitleWrapper,
} from '@src/containers/ReportStep/BoardMetrics/style';
import {
  BOARD_METRICS,
  BOARD_METRICS_MAPPING,
  METRICS_SUBTITLE,
  METRICS_TITLE,
  REPORT_PAGE,
  REQUIRED_DATA,
  RETRY,
  SHOW_MORE,
} from '@src/constants/resources';
import { ReportTitle } from '@src/components/Common/ReportGrid/ReportTitle';
import { selectMetricsContent } from '@src/context/Metrics/metricsSlice';
import { ReportResponseDTO } from '@src/clients/report/dto/response';
import { ReportGrid } from '@src/components/Common/ReportGrid';
import { selectConfig } from '@src/context/config/configSlice';
import { onlyEmptyAndDoneState } from '@src/utils/util';
import { Loading } from '@src/components/Loading';
import { useAppSelector } from '@src/hooks';
import React from 'react';

interface BoardMetricsProps {
  startToRequestBoardData: () => void;
  onShowDetail: () => void;
  boardReport?: ReportResponseDTO;
  errorMessage: string;
}

const BoardMetrics = ({ startToRequestBoardData, onShowDetail, boardReport, errorMessage }: BoardMetricsProps) => {
  const configData = useAppSelector(selectConfig);
  const { cycleTimeSettings } = useAppSelector(selectMetricsContent);

  const { metrics } = configData.basic;
  const boardMetrics = metrics.filter((metric) => BOARD_METRICS.includes(metric));
  const boardingMappingStates = [...new Set(cycleTimeSettings.map((item) => item.value))];
  const isOnlyEmptyAndDoneState = onlyEmptyAndDoneState(boardingMappingStates);
  const boardMetricsCompleted = (
    isOnlyEmptyAndDoneState ? boardMetrics.filter((metric) => metric !== REQUIRED_DATA.REWORK_TIMES) : boardMetrics
  )
    .map((metric) => BOARD_METRICS_MAPPING[metric])
    .every((metric) => boardReport?.[metric] ?? false);

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
    startToRequestBoardData();
  };

  const isShowMoreLoadingDisplay = () =>
    boardMetrics.length === 1 &&
    boardMetrics[0] === REQUIRED_DATA.CLASSIFICATION &&
    !errorMessage &&
    !boardReport?.boardMetricsCompleted;

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
          {!isOnlyEmptyAndDoneState && (
            <ReportGrid reportDetails={getReworkBoardItem()} errorMessage={errorMessage} lastGrid={true} />
          )}
        </GridContainer>
      </StyledMetricsSection>
    </>
  );
};

export default BoardMetrics;
