import {
  initDeploymentFrequencySettings,
  updateShouldGetBoardConfig,
  updateShouldGetPipelineConfig,
} from '@src/context/Metrics/metricsSlice';
import { DateRangePickerGroupContainer } from '@src/containers/ConfigStep/DateRangePicker/style';
import { DateRangePicker } from '@src/containers/ConfigStep/DateRangePicker/DateRangePicker';
import { ADD_TIME_RANGE_BUTTON_TEXT, MAX_TIME_RANGE_AMOUNT } from '@src/constants/resources';
import { selectDateRange, updateDateRange } from '@src/context/config/configSlice';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import { AddButton } from '@src/components/Common/AddButtonOneLine';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateValidationError } from '@mui/x-date-pickers';
import { useState, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import remove from 'lodash/remove';
import get from 'lodash/get';
import dayjs from 'dayjs';

export enum SortType {
  DESCENDING = 'DESCENDING',
  ASCENDING = 'ASCENDING',
  DEFAULT = 'DEFAULT',
}

export type SortedDateRangeType = {
  startDate: string | null;
  endDate: string | null;
  sortIndex: number;
  startDateError: DateValidationError | null;
  endDateError: DateValidationError | null;
};

const sortFn = {
  DEFAULT: ({ sortIndex }: SortedDateRangeType) => sortIndex,
  DESCENDING: ({ startDate }: SortedDateRangeType) => -dayjs(startDate).unix(),
  ASCENDING: ({ startDate }: SortedDateRangeType) => dayjs(startDate).unix(),
};

type Props = {
  sortType: SortType;
  onChange?: (data: SortedDateRangeType[]) => void;
  onError?: (data: SortedDateRangeType[]) => void;
};

const fillDateRangeGroup = <T,>(item: T, index: number) => ({
  ...item,
  startDateError: null,
  endDateError: null,
  sortIndex: index,
});

export const DateRangePickerGroup = ({ sortType, onError }: Props) => {
  const dispatch = useAppDispatch();
  const dateRangeGroup = useAppSelector(selectDateRange);
  const isAddButtonDisabled = dateRangeGroup.length === MAX_TIME_RANGE_AMOUNT;
  const [sortedDateRangeList, setSortedDateRangeList] = useState<SortedDateRangeType[]>(
    dateRangeGroup.map(fillDateRangeGroup),
  );

  useEffect(() => {
    const errors = sortedDateRangeList.filter(({ startDateError, endDateError }) => startDateError || endDateError);
    onError?.(errors);
  }, [onError, sortedDateRangeList]);

  const handleError = (type: string, error: DateValidationError, index: number) => {
    setSortedDateRangeList(
      sortedDateRangeList.map((item) => ({ ...item, [type]: item.sortIndex === index ? error : null })),
    );
  };

  const dispatchUpdateConfig = () => {
    dispatch(updateShouldGetBoardConfig(true));
    dispatch(updateShouldGetPipelineConfig(true));
    dispatch(initDeploymentFrequencySettings());
  };

  const addRangeHandler = () => {
    const result = [...sortedDateRangeList, { startDate: null, endDate: null }];
    setSortedDateRangeList(result.map(fillDateRangeGroup));
    dispatch(updateDateRange(result.map(({ startDate, endDate }) => ({ startDate, endDate }))));
  };

  const handleChange = (
    { startDate, endDate }: { startDate: string | null; endDate: string | null },
    index: number,
  ) => {
    const result = sortedDateRangeList.map((item) =>
      item.sortIndex === index ? { ...item, startDate, endDate, startDateError: null, endDateError: null } : item,
    );
    setSortedDateRangeList(result);
    dispatchUpdateConfig();
    dispatch(updateDateRange(result.map(({ startDate, endDate }) => ({ startDate, endDate }))));
  };

  const handleRemove = (index: number) => {
    const result = [...sortedDateRangeList];
    remove(result, ({ sortIndex }) => sortIndex === index);
    setSortedDateRangeList(result);
    dispatchUpdateConfig();
    dispatch(updateDateRange(result.map(({ startDate, endDate }) => ({ startDate, endDate }))));
  };

  return (
    <DateRangePickerGroupContainer>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {sortBy(sortedDateRangeList, get(sortFn, sortType)).map(({ startDate, endDate, sortIndex }, index) => (
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            index={sortIndex}
            key={index}
            onChange={handleChange}
            onError={handleError}
            onRemove={handleRemove}
            rangeList={sortedDateRangeList}
          />
        ))}
        <AddButton
          disabled={isAddButtonDisabled}
          aria-label='Button for adding date range'
          onClick={addRangeHandler}
          text={ADD_TIME_RANGE_BUTTON_TEXT}
          sx={{
            mt: '1.5rem',
          }}
        />
      </LocalizationProvider>
    </DateRangePickerGroupContainer>
  );
};
