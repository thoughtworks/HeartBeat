import {
  DateRangeContainer,
  DateRangeExpandContainer,
  DateRangeFailedIconContainer,
  SingleDateRange,
  StyledArrowForward,
  StyledCalendarToday,
  StyledDateRangeViewerContainer,
  StyledChip,
  StyledDivider,
  StyledExpandContainer,
  StyledExpandMoreIcon,
} from './style';
import {
  selectMetricsPageFailedTimeRangeInfos,
  selectReportPageFailedTimeRangeInfos,
  selectStepNumber,
} from '@src/context/stepper/StepperSlice';
import React, { useRef, useState, forwardRef, useEffect, useCallback } from 'react';
import { DateRange, DateRangeList } from '@src/context/config/configSlice';
import { formatDate, formatDateToTimestampString } from '@src/utils/util';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { useAppSelector } from '@src/hooks';
import { theme } from '@src/theme';

type Props = {
  dateRangeList: DateRangeList;
  selectedDateRange?: DateRange;
  changeDateRange?: (dateRange: DateRange) => void;
  isShowingChart?: boolean;
  disabledAll?: boolean;
};

const DateRangeViewer = ({
  dateRangeList,
  changeDateRange,
  selectedDateRange,
  disabledAll = true,
  isShowingChart = false,
}: Props) => {
  const [showMoreDateRange, setShowMoreDateRange] = useState(false);
  const DateRangeExpandRef = useRef<HTMLDivElement>(null);
  const metricsPageFailedTimeRangeInfos = useAppSelector(selectMetricsPageFailedTimeRangeInfos);
  const reportPageFailedTimeRangeInfos = useAppSelector(selectReportPageFailedTimeRangeInfos);
  const stepNumber = useAppSelector(selectStepNumber);
  const currentDateRange: DateRange = selectedDateRange || dateRangeList[0];
  const isMetricsPage = stepNumber === 1;
  const isReportPage = stepNumber === 2;

  const backgroundColor =
    stepNumber === 1
      ? theme.palette.secondary.dark
      : isShowingChart
        ? theme.palette.secondary.dark
        : theme.palette.common.white;
  const currentDateRangeHasFailed = getCurrentDateRangeHasFailed(
    formatDateToTimestampString(currentDateRange.startDate!),
  );

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (DateRangeExpandRef.current && !DateRangeExpandRef.current?.contains(event.target as Node)) {
      setShowMoreDateRange(false);
    }
  }, []);

  const handleClick = (key: string) => {
    changeDateRange && changeDateRange(dateRangeList.find((dateRange) => dateRange.startDate === key)!);
    setShowMoreDateRange(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  function getCurrentDateRangeHasFailed(startDate: string) {
    if (isMetricsPage) {
      const errorInfo = metricsPageFailedTimeRangeInfos[startDate];
      return !!(errorInfo?.isPipelineInfoError || errorInfo?.isBoardInfoError || errorInfo?.isPipelineStepError);
    } else {
      const errorInfo = reportPageFailedTimeRangeInfos[startDate];
      return !!(errorInfo?.isPollingError || errorInfo?.isGainPollingUrlError);
    }
  }

  const DateRangeExpand = forwardRef((props, ref: React.ForwardedRef<HTMLDivElement>) => {
    return (
      <DateRangeExpandContainer ref={ref} backgroundColor={backgroundColor}>
        {dateRangeList.map((dateRange) => {
          const disabled = dateRange.disabled || disabledAll;
          const hasError = getCurrentDateRangeHasFailed(formatDateToTimestampString(dateRange.startDate!));
          return (
            <SingleDateRange
              disabled={disabled}
              backgroundColor={backgroundColor}
              onClick={() => handleClick(dateRange.startDate!)}
              key={dateRange.startDate!}
            >
              <DateRangeFailedIconContainer>
                {hasError && <PriorityHighIcon color='error' />}
              </DateRangeFailedIconContainer>
              {formatDate(dateRange.startDate as string)}
              <StyledArrowForward />
              {formatDate(dateRange.endDate as string)}
            </SingleDateRange>
          );
        })}
      </DateRangeExpandContainer>
    );
  });

  return (
    <StyledDateRangeViewerContainer
      color={disabledAll ? theme.palette.text.disabled : theme.palette.text.primary}
      backgroundColor={backgroundColor}
      aria-label='date range'
    >
      <DateRangeContainer>
        <DateRangeFailedIconContainer>
          {currentDateRangeHasFailed && <PriorityHighIcon color='error' />}
        </DateRangeFailedIconContainer>
        {formatDate(currentDateRange.startDate!)}
        <StyledArrowForward />
        {formatDate(currentDateRange.endDate!)}
        <StyledCalendarToday />
      </DateRangeContainer>
      {disabledAll && isReportPage ? (
        <StyledChip aria-label='date-count-chip' label={dateRangeList.length} variant='outlined' size='small' />
      ) : (
        <>
          <StyledDivider orientation='vertical' />
          <StyledExpandContainer aria-label='expandMore' onClick={() => setShowMoreDateRange(true)}>
            <StyledExpandMoreIcon />
            {showMoreDateRange && <DateRangeExpand ref={DateRangeExpandRef} />}
          </StyledExpandContainer>
        </>
      )}
    </StyledDateRangeViewerContainer>
  );
};

export default DateRangeViewer;
