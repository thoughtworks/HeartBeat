import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { DateRangeBox } from '@src/components/Metrics/ConfigStep/DateRangePicker/style'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
import { selectDateRange, updateBoardVerifyState, updateDateRange } from '@src/context/config/configSlice'

export const DateRangePicker = () => {
  const dispatch = useAppDispatch()
  const { startDate, endDate } = useAppSelector(selectDateRange)

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateRangeBox>
        <DatePicker
          label='From *'
          value={dayjs(startDate)}
          onChange={(newValue) => {
            newValue &&
              dispatch(
                updateDateRange({
                  startDate: newValue.valueOf(),
                  endDate: newValue.add(14, 'day').valueOf(),
                })
              )
            dispatch(updateBoardVerifyState(false))
          }}
        />
        <DatePicker
          label='To *'
          value={dayjs(endDate)}
          minDate={dayjs(startDate)}
          onChange={(newValue) => {
            newValue && dispatch(updateDateRange({ startDate: startDate, endDate: newValue.valueOf() }))
            dispatch(updateBoardVerifyState(false))
          }}
        />
      </DateRangeBox>
    </LocalizationProvider>
  )
}
