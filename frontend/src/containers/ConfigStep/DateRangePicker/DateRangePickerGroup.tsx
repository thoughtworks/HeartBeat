import {
  IRangeOnChangeData,
  SortedDateRangeType,
  sortFn,
  TProps,
} from '@src/containers/ConfigStep/DateRangePicker/types';
import { updateShouldGetBoardConfig, updateShouldGetPipelineConfig } from '@src/context/Metrics/metricsSlice';
import { selectDateRange, selectDateRangeSortType, updateDateRange } from '@src/context/config/configSlice';
import { DateRangePickerGroupContainer } from '@src/containers/ConfigStep/DateRangePicker/style';
import { DateRangePicker } from '@src/containers/ConfigStep/DateRangePicker/DateRangePicker';
import { ADD_TIME_RANGE_BUTTON_TEXT, MAX_TIME_RANGE_AMOUNT } from '@src/constants/resources';
import { BASIC_INFO_ERROR_MESSAGE } from '@src/containers/ConfigStep/Form/literal';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { updateShouldMetricsLoad } from '@src/context/stepper/StepperSlice';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import { AddButton } from '@src/components/Common/AddButtonOneLine';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useFormContext } from 'react-hook-form';
import { Nullable } from '@src/utils/types';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import isNull from 'lodash/isNull';
import get from 'lodash/get';

const deriveErrorMessageByDate = (date: Nullable<string>, message: string) => (isNull(date) ? message : null);
const enhanceRangeWithMeta = (
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

export const DateRangePickerGroup = ({ onError }: TProps) => {
  const dispatch = useAppDispatch();
  const dateRangeGroup = useAppSelector(selectDateRange);
  const sortType = useAppSelector(selectDateRangeSortType);
  const isAddButtonDisabled = dateRangeGroup.length === MAX_TIME_RANGE_AMOUNT;
  const [rangeListWithMeta, setRangeListWithMeta] = useState<SortedDateRangeType[]>(
    dateRangeGroup.map(enhanceRangeWithMeta),
  );
  const { setValue } = useFormContext();

  useEffect(() => {
    const rangeListWithErrors = rangeListWithMeta.filter(
      ({ startDateError, endDateError }) => startDateError || endDateError,
    );
    onError?.(rangeListWithErrors);
  }, [onError, rangeListWithMeta]);

  const dispatchUpdateConfig = () => {
    dispatch(updateShouldGetBoardConfig(true));
    dispatch(updateShouldGetPipelineConfig(true));
    dispatch(updateShouldMetricsLoad(true));
  };

  const addRangeHandler = () => {
    const result = [...rangeListWithMeta, { startDate: null, endDate: null }];
    setRangeListWithMeta(result.map(enhanceRangeWithMeta));
    setValue(
      `dateRange`,
      result.map(({ startDate, endDate }) => ({ startDate, endDate })),
      { shouldValidate: true },
    );
    dispatch(updateDateRange(result.map(({ startDate, endDate }) => ({ startDate, endDate }))));
  };

  const handleChange = ({ startDate, endDate, startDateError, endDateError }: IRangeOnChangeData, index: number) => {
    const result = rangeListWithMeta.map((item) =>
      item.sortIndex === index
        ? {
            ...item,
            startDate,
            endDate,
            startDateError,
            endDateError,
          }
        : { ...item },
    );
    setRangeListWithMeta(result);
    dispatchUpdateConfig();
    dispatch(updateDateRange(result.map(({ startDate, endDate }) => ({ startDate, endDate }))));
  };

  const handleRemove = (index: number) => {
    const result = [...rangeListWithMeta]
      .filter(({ sortIndex }) => sortIndex !== index)
      .map((item, index) => ({ ...item, sortIndex: index }));
    setValue(
      `dateRange`,
      result.map(({ startDate, endDate }) => ({ startDate, endDate })),
      { shouldValidate: true },
    );
    setRangeListWithMeta(result);
    dispatchUpdateConfig();
    dispatch(updateDateRange(result.map(({ startDate, endDate }) => ({ startDate, endDate }))));
  };

  return (
    <DateRangePickerGroupContainer>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {sortBy(rangeListWithMeta, get(sortFn, sortType)).map(({ startDate, endDate, sortIndex }, index) => (
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            index={sortIndex}
            key={index}
            onChange={handleChange}
            onRemove={handleRemove}
            rangeList={rangeListWithMeta}
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
