import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
import {
  selectDateRange,
  updateBoardVerifyState,
  updateDateRange,
  updatePipelineToolVerifyState,
  updateSourceControlVerifyState,
} from '@src/context/config/configSlice'
import { StyledDateRangePicker } from './style'

export const DateRangePicker = () => {
  const dispatch = useAppDispatch()
  const { startDate, endDate } = useAppSelector(selectDateRange)
  const updateVerifyStates = () => {
    dispatch(updateBoardVerifyState(false))
    dispatch(updatePipelineToolVerifyState(false))
    dispatch(updateSourceControlVerifyState(false))
  }
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
          startDate: value.startOf('date').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          endDate: value.endOf('date').add(13, 'day').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        })
      )
    }
    updateVerifyStates()
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
      dispatch(
        updateDateRange({ startDate: startDate, endDate: value.endOf('date').format('YYYY-MM-DDTHH:mm:ss.SSSZ') })
      )
    }
    updateVerifyStates()
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledDateRangePicker>
        <DatePicker
          label='From *'
          value={startDate ? dayjs(startDate) : null}
          onChange={(newValue) => changeStartDate(newValue)}
        />
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
