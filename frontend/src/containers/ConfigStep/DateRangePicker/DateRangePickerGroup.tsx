import { updateShouldGetBoardConfig, updateShouldGetPipelineConfig } from '@src/context/Metrics/metricsSlice';
import { Props, SortedDateRangeType, sortFn } from '@src/containers/ConfigStep/DateRangePicker/types';
import { DateRangePickerGroupContainer } from '@src/containers/ConfigStep/DateRangePicker/style';
import { DateRangePicker } from '@src/containers/ConfigStep/DateRangePicker/DateRangePicker';
import { ADD_TIME_RANGE_BUTTON_TEXT, MAX_TIME_RANGE_AMOUNT } from '@src/constants/resources';
import { BASIC_INFO_ERROR_MESSAGE } from '@src/containers/ConfigStep/Form/literal';
import { selectDateRange, updateDateRange } from '@src/context/config/configSlice';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import { AddButton } from '@src/components/Common/AddButtonOneLine';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateValidationError } from '@mui/x-date-pickers';
import { useFormContext } from 'react-hook-form';
import { Nullable } from '@src/utils/types';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import remove from 'lodash/remove';
import isNull from 'lodash/isNull';
import get from 'lodash/get';

const deriveErrorMessageByDate = (date: Nullable<string>, message: string) => (isNull(date) ? message : null);

const fillDateRangeGroup = (
  item: {
    startDate: string | null;
    endDate: string | null;
  },
  index: number,
) => ({
  ...item,
  startDateError: deriveErrorMessageByDate(item.startDate, BASIC_INFO_ERROR_MESSAGE.dateRange.startDate.required),
  endDateError: deriveErrorMessageByDate(item.endDate, BASIC_INFO_ERROR_MESSAGE.dateRange.endDate.required),
  sortIndex: index,
});

export const DateRangePickerGroup = ({ sortType, onError }: Props) => {
  const dispatch = useAppDispatch();
  const dateRangeGroup = useAppSelector(selectDateRange);
  const isAddButtonDisabled = dateRangeGroup.length === MAX_TIME_RANGE_AMOUNT;
  const [sortedDateRangeList, setSortedDateRangeList] = useState<SortedDateRangeType[]>(
    dateRangeGroup.map(fillDateRangeGroup),
  );
  const { setValue } = useFormContext();

  useEffect(() => {
    const rangeListWithErrors = sortedDateRangeList.filter(
      ({ startDateError, endDateError }) => startDateError || endDateError,
    );
    onError?.(rangeListWithErrors);
  }, [onError, sortedDateRangeList]);

  const handleError = (type: string, error: DateValidationError | string, index: number) => {
    const newList = sortedDateRangeList.map((item) => ({ ...item, [type]: item.sortIndex === index ? error : null }));
    setSortedDateRangeList(newList);
  };

  const dispatchUpdateConfig = () => {
    dispatch(updateShouldGetBoardConfig(true));
    dispatch(updateShouldGetPipelineConfig(true));
  };

  const addRangeHandler = () => {
    const result = [...sortedDateRangeList, { startDate: null, endDate: null }];
    setSortedDateRangeList(result.map(fillDateRangeGroup));
    setValue(
      `dateRange`,
      result.map(({ startDate, endDate }) => ({ startDate, endDate })),
      { shouldValidate: true },
    );
    dispatch(updateDateRange(result.map(({ startDate, endDate }) => ({ startDate, endDate }))));
  };

  const handleChange = (
    { startDate, endDate }: { startDate: string | null; endDate: string | null },
    index: number,
  ) => {
    const result = sortedDateRangeList.map((item) =>
      item.sortIndex === index
        ? {
            ...item,
            startDate,
            endDate,
            startDateError: deriveErrorMessageByDate(startDate, BASIC_INFO_ERROR_MESSAGE.dateRange.startDate.required),
            endDateError: deriveErrorMessageByDate(endDate, BASIC_INFO_ERROR_MESSAGE.dateRange.endDate.required),
          }
        : item,
    );
    setSortedDateRangeList(result);
    dispatchUpdateConfig();
    dispatch(updateDateRange(result.map(({ startDate, endDate }) => ({ startDate, endDate }))));
  };

  const handleRemove = (index: number) => {
    const result = [...sortedDateRangeList];
    remove(result, ({ sortIndex }) => sortIndex === index);
    setValue(
      `dateRange`,
      result.map(({ startDate, endDate }) => ({ startDate, endDate })),
      { shouldValidate: true },
    );
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
