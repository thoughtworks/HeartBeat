import {
  DateRangeContainer,
  DateRangeExpandContainer,
  DateRangeFailedIconContainer,
  SingleDateRange,
  StyledArrowForward,
  StyledCalendarToday,
  StyledDivider,
  StyledExpandMoreIcon,
} from './style';
import { selectFailedTimeRange, selectStepNumber } from '@src/context/stepper/StepperSlice';
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
  const failedTimeRangeList = useAppSelector(selectFailedTimeRange);
  const stepNumber = useAppSelector(selectStepNumber);

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
      <DateRangeExpandContainer ref={ref}>
        {dateRangeList.map((dateRange) => {
          const disabled = dateRange.disabled || disabledAll;
          const hasMetricsError = failedTimeRangeList.includes(
            formatDateToTimestampString(dateRange.startDate as string),
          );
          return (
            <SingleDateRange
              disabled={disabled}
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
    <DateRangeContainer
      data-test-id={'date-range'}
      color={disabledAll ? theme.palette.text.disabled : theme.palette.text.primary}
    >
      {formatDate((selectedDateRange || dateRangeList[0]).startDate as string)}
      <StyledArrowForward />
      {formatDate((selectedDateRange || dateRangeList[0]).endDate as string)}
      <StyledCalendarToday />
      <StyledDivider orientation='vertical' />
      <StyledExpandMoreIcon aria-label='expandMore' onClick={() => setShowMoreDateRange(true)} />
      {showMoreDateRange && <DateRangeExpand ref={DateRangeExpandRef} />}
    </DateRangeContainer>
  );
};

export default DateRangeViewer;
