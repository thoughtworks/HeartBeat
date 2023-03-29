import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
import { selectDateRange, updateBoardVerifyState, updateDateRange } from '@src/context/config/configSlice'
import { StyledDateRangePicker } from './style'

export const DateRangePicker = () => {
  const dispatch = useAppDispatch()
  const { startDate, endDate } = useAppSelector(selectDateRange)
  const changeStartDate = (value: dayjs.Dayjs | null) => {
    if (value === null) {
      dispatch(
        updateDateRange({
          startDate: null,
          endDate: null,
        })
      )
    } else {
      dispatch(
        updateDateRange({
          startDate: value.valueOf(),
          endDate: value.add(14, 'day').valueOf(),
        })
      )
    }
    dispatch(updateBoardVerifyState(false))
  }

  const changeEndDate = (value: dayjs.Dayjs | null) => {
    if (value === null) {
      dispatch(
        updateDateRange({
          startDate: startDate,
          endDate: null,
        })
      )
    } else {
      dispatch(updateDateRange({ startDate: startDate, endDate: value.valueOf() }))
    }
    dispatch(updateBoardVerifyState(false))
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledDateRangePicker>
        <DatePicker label='From *' value={dayjs(startDate)} onChange={(newValue) => changeStartDate(newValue)} />
        <DatePicker
          label='To *'
          value={endDate ? dayjs(endDate) : null}
          minDate={dayjs(startDate)}
          onChange={(newValue) => changeEndDate(newValue)}
        />
      </StyledDateRangePicker>
    </LocalizationProvider>
  )
}
