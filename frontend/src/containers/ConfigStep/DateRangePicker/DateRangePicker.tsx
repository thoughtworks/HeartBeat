import {
  StyledFeaturedRangePickerContainer,
  StyledDateRangePickerContainer,
  StyledDateRangePicker,
  RemoveButton,
} from '@src/containers/ConfigStep/DateRangePicker/style';
import { DEFAULT_SPRINT_INTERVAL_OFFSET_DAYS, REMOVE_BUTTON_TEXT, DATE_RANGE_FORMAT } from '@src/constants/resources';
import { isDateDisabled, calculateLastAvailableDate } from '@src/containers/ConfigStep/DateRangePicker/validation';
import { BASIC_INFO_ERROR_MESSAGE, AGGREGATED_DATE_ERROR_REASON } from '@src/containers/ConfigStep/Form/literal';
import { IRangePickerProps } from '@src/containers/ConfigStep/DateRangePicker/types';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { DateValidationError } from '@mui/x-date-pickers';
import { TextField, TextFieldProps } from '@mui/material';
import { Z_INDEX } from '@src/constants/commons';
import { useFormContext } from 'react-hook-form';
import { Nullable } from '@src/utils/types';
import dayjs, { Dayjs } from 'dayjs';
import isNull from 'lodash/isNull';

const HelperTextForStartDate = (props: TextFieldProps) => {
  const isBlank = props.value === null || props.value === '';
  const isError = props.error || isBlank;
  const helperText = isBlank
    ? BASIC_INFO_ERROR_MESSAGE.dateRange.startDate.required
    : BASIC_INFO_ERROR_MESSAGE.dateRange.startDate.invalid;
  return <TextField {...props} variant='standard' required={true} error={isError} helperText={isError && helperText} />;
};

const HelperTextForEndDate = (props: TextFieldProps) => {
  const isBlank = props.value === null || props.value === '';
  const isError = props.error || isBlank;
  const helperText = isBlank
    ? BASIC_INFO_ERROR_MESSAGE.dateRange.endDate.required
    : BASIC_INFO_ERROR_MESSAGE.dateRange.endDate.invalid;
  return <TextField {...props} variant='standard' required={true} error={isError} helperText={isError && helperText} />;
};

export const DateRangePicker = ({
  startDate,
  endDate,
  index,
  onError,
  onChange,
  onRemove,
  rangeList,
}: IRangePickerProps) => {
  const isShowRemoveButton = rangeList && rangeList.length > 1;
  const dateRangeGroupExcludeSelf = rangeList!.filter(({ sortIndex }: { sortIndex: number }) => sortIndex !== index);
  const shouldStartDateDisableDate = isDateDisabled.bind(null, dateRangeGroupExcludeSelf);
  const shouldEndDateDisableDate = isDateDisabled.bind(null, dateRangeGroupExcludeSelf);
  const startDateFieldName = `dateRange[${index}].startDate`;
  const endDateFieldName = `dateRange[${index}].endDate`;
  const { setValue } = useFormContext();

  const changeStartDate = (value: Nullable<Dayjs>, { validationError }: { validationError: DateValidationError }) => {
    let daysAddToEndDate = DEFAULT_SPRINT_INTERVAL_OFFSET_DAYS;
    if (value) {
      const valueDate = dayjs(value).startOf('day').format(DATE_RANGE_FORMAT);
      const lastAvailableDate = calculateLastAvailableDate(value, dateRangeGroupExcludeSelf);
      const draftDaysAddition = lastAvailableDate.diff(valueDate, 'days');
      daysAddToEndDate =
        draftDaysAddition >= DEFAULT_SPRINT_INTERVAL_OFFSET_DAYS
          ? DEFAULT_SPRINT_INTERVAL_OFFSET_DAYS
          : draftDaysAddition;
    }

    const result = isNull(value)
      ? {
          startDate: null,
          endDate: null,
        }
      : {
          startDate: value.startOf('date').format(DATE_RANGE_FORMAT),
          endDate: value.endOf('date').add(daysAddToEndDate, 'day').format(DATE_RANGE_FORMAT),
        };

    if (isNull(validationError)) {
      if (isNull(value)) {
        onError?.('startDateError', BASIC_INFO_ERROR_MESSAGE.dateRange.startDate.required, index);
      }
      setValue(startDateFieldName, result.startDate, { shouldValidate: true });
      setValue(endDateFieldName, result.endDate, { shouldValidate: true });
      onChange?.(result, index);
    } else {
      setValue(startDateFieldName, AGGREGATED_DATE_ERROR_REASON, { shouldValidate: true });
      onError?.('startDateError', validationError, index);
    }
  };

  const changeEndDate = (value: Nullable<Dayjs>, { validationError }: { validationError: DateValidationError }) => {
    const result = isNull(value)
      ? {
          startDate,
          endDate: null,
        }
      : {
          startDate,
          endDate: value.endOf('date').format(DATE_RANGE_FORMAT),
        };

    if (isNull(validationError)) {
      if (isNull(value)) {
        onError?.('endDateError', BASIC_INFO_ERROR_MESSAGE.dateRange.endDate.required, index);
      }
      setValue(startDateFieldName, result.startDate, { shouldValidate: true });
      setValue(endDateFieldName, result.endDate, { shouldValidate: true });
      onChange?.(result, index);
    } else {
      setValue(endDateFieldName, AGGREGATED_DATE_ERROR_REASON, { shouldValidate: true });
      onError?.('endDateError', validationError, index);
    }
  };

  const removeSelfHandler = () => {
    onRemove?.(index);
  };

  return (
    <StyledFeaturedRangePickerContainer>
      <StyledDateRangePickerContainer className='range-picker-row' aria-label='Range picker row'>
        <StyledDateRangePicker
          disableFuture
          shouldDisableDate={shouldStartDateDisableDate}
          label='From'
          value={startDate ? dayjs(startDate) : null}
          onChange={changeStartDate}
          slots={{
            openPickerIcon: CalendarTodayIcon,
            textField: HelperTextForStartDate,
          }}
          slotProps={{
            textField: { required: true },
            popper: {
              sx: { zIndex: Z_INDEX.DROPDOWN },
            },
          }}
        />
        <StyledDateRangePicker
          disableFuture
          label='To'
          shouldDisableDate={shouldEndDateDisableDate}
          value={endDate ? dayjs(endDate) : null}
          maxDate={dayjs(startDate).add(30, 'day')}
          minDate={dayjs(startDate)}
          onChange={changeEndDate}
          slots={{
            openPickerIcon: CalendarTodayIcon,
            textField: HelperTextForEndDate,
          }}
          slotProps={{
            textField: { required: true },
            popper: {
              sx: { zIndex: Z_INDEX.DROPDOWN },
            },
          }}
        />
        {isShowRemoveButton && <RemoveButton onClick={removeSelfHandler}>{REMOVE_BUTTON_TEXT}</RemoveButton>}
      </StyledDateRangePickerContainer>
    </StyledFeaturedRangePickerContainer>
  );
};
