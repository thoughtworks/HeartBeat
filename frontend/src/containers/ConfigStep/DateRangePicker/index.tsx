import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import {
  selectDateRange,
  updateBoardVerifyState,
  updateDateRange,
  updateSourceControlVerifyState,
} from '@src/context/config/configSlice';
import { StyledDateRangePicker, StyledDateRangePickerContainer } from './style';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Z_INDEX } from '@src/constants/commons';
import { Nullable } from '@src/utils/types';

export const DateRangePicker = () => {
  const dispatch = useAppDispatch();
  const { startDate, endDate } = useAppSelector(selectDateRange);
  const updateVerifyStates = () => {
    dispatch(updateBoardVerifyState(false));
    dispatch(updateSourceControlVerifyState(false));
  };
  const changeStartDate = (value: Nullable<Dayjs>) => {
    if (value === null) {
      dispatch(
        updateDateRange({
          startDate: null,
          endDate: null,
        })
      );
    } else {
      dispatch(
        updateDateRange({
          startDate: value.startOf('date').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          endDate: value.endOf('date').add(13, 'day').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        })
      );
    }
    updateVerifyStates();
  };

  const changeEndDate = (value: Dayjs) => {
    if (value === null) {
      dispatch(
        updateDateRange({
          startDate: startDate,
          endDate: null,
        })
      );
    } else {
      dispatch(
        updateDateRange({ startDate: startDate, endDate: value.endOf('date').format('YYYY-MM-DDTHH:mm:ss.SSSZ') })
      );
    }
    updateVerifyStates();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledDateRangePickerContainer>
        <StyledDateRangePicker
          label='From *'
          value={startDate ? dayjs(startDate) : null}
          onChange={(newValue) => changeStartDate(newValue as unknown as Dayjs)}
          slots={{
            openPickerIcon: CalendarTodayIcon,
          }}
          slotProps={{
            textField: {
              variant: 'standard',
            },
            popper: {
              sx: { zIndex: Z_INDEX.DROPDOWN },
            },
          }}
        />
        <StyledDateRangePicker
          label='To *'
          value={endDate ? dayjs(endDate) : null}
          minDate={dayjs(startDate)}
          onChange={(newValue) => changeEndDate(newValue as unknown as Dayjs)}
          slots={{
            openPickerIcon: CalendarTodayIcon,
          }}
          slotProps={{
            textField: {
              variant: 'standard',
            },
            popper: {
              sx: { zIndex: Z_INDEX.DROPDOWN },
            },
          }}
        />
      </StyledDateRangePickerContainer>
    </LocalizationProvider>
  );
};
