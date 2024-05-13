import {
  DateRangeContainer,
  DateRangeExpandContainer,
  DateRangeFailedIconContainer,
  SingleDateRange,
  StyledArrowForward,
  StyledCalendarToday,
  StyledDateRangeViewerContainer,
  StyledDivider,
  StyledExpandContainer,
  StyledExpandMoreIcon,
} from './style';
import { selectMetricsPageFailedTimeRangeInfos, selectStepNumber } from '@src/context/stepper/StepperSlice';
import React, { useRef, useState, forwardRef, useEffect, useCallback } from 'react';
import { formatDate, formatDateToTimestampString } from '@src/utils/util';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { DateRange } from '@src/context/config/configSlice';
import { useAppSelector } from '@src/hooks';
import { theme } from '@src/theme';

type Props = {
  dateRangeList: DateRange;
  selectedDateRange?: Record<string, string | null | boolean | undefined>;
  changeDateRange?: (dateRange: Record<string, string | null | boolean | undefined>) => void;
  disabledAll?: boolean;
};

const DateRangeViewer = ({ dateRangeList, changeDateRange, selectedDateRange, disabledAll = true }: Props) => {
  const [showMoreDateRange, setShowMoreDateRange] = useState(false);
  const DateRangeExpandRef = useRef<HTMLDivElement>(null);
  const metricsPageFailedTimeRangeInfos = useAppSelector(selectMetricsPageFailedTimeRangeInfos);
  const stepNumber = useAppSelector(selectStepNumber);
  const backgroundColor = stepNumber === 1 ? theme.palette.secondary.dark : theme.palette.common.white;
  const currentDateRangeHasFailed =
    stepNumber === 1
      ? Object.values(metricsPageFailedTimeRangeInfos).some(
          (errorInfo) => errorInfo.pipelineInfoError || errorInfo.boardInfoError || errorInfo.pipelineStepError,
        )
      : false;

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

  const DateRangeExpand = forwardRef((props, ref: React.ForwardedRef<HTMLDivElement>) => {
    return (
      <DateRangeExpandContainer ref={ref} backgroundColor={backgroundColor}>
        {dateRangeList.map((dateRange) => {
          const disabled = dateRange.disabled || disabledAll;
          const currentFailedInfo = metricsPageFailedTimeRangeInfos[formatDateToTimestampString(dateRange.startDate!)];
          const hasMetricsError = currentFailedInfo
            ? currentFailedInfo.pipelineInfoError ||
              currentFailedInfo.boardInfoError ||
              currentFailedInfo.pipelineStepError
            : false;
          return (
            <SingleDateRange
              disabled={disabled}
              backgroundColor={backgroundColor}
              onClick={() => handleClick(dateRange.startDate!)}
              key={dateRange.startDate!}
            >
              <DateRangeFailedIconContainer>
                {hasMetricsError && stepNumber === 1 && <PriorityHighIcon color='error' />}
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
      aria-label='date-range'
    >
      <DateRangeContainer>
        {currentDateRangeHasFailed && <PriorityHighIcon color='error' />}
        {formatDate((selectedDateRange || dateRangeList[0]).startDate as string)}
        <StyledArrowForward />
        {formatDate((selectedDateRange || dateRangeList[0]).endDate as string)}
        <StyledCalendarToday />
      </DateRangeContainer>
      <StyledDivider orientation='vertical' />
      <StyledExpandContainer aria-label='expandMore' onClick={() => setShowMoreDateRange(true)}>
        <StyledExpandMoreIcon />
        {showMoreDateRange && <DateRangeExpand ref={DateRangeExpandRef} />}
      </StyledExpandContainer>
    </StyledDateRangeViewerContainer>
  );
};

export default DateRangeViewer;
