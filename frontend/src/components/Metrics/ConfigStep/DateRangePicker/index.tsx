import React, { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { TextField } from '@mui/material'
import { datePickerPropsStyles, DateRangeBox } from '@src/components/Metrics/ConfigStep/DateRangePicker/style'
import { DATE_RANGE, SELECT_OR_WRITE_DATE } from '@src/constants'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
import { changeBoardVerifyState } from '@src/features/board/boardSlice'
import { selectDateRange, updateDateRange } from '@src/features/config/configSlice'

export const DateRangePicker = () => {
  const dispatch = useAppDispatch()
  const { startDate, endDate } = useAppSelector(selectDateRange)

  const [dateRangeValueError, setDateRangeValueError] = useState([false, false])

  const checkDateformat = (value: Dayjs | null, dateType: number) => {
    const newDateRangeValueError = [...dateRangeValueError]
    if (value === null || !value.isValid()) newDateRangeValueError.splice(dateType, 1, true)
    else newDateRangeValueError.splice(dateType, 1, false)
    setDateRangeValueError(newDateRangeValueError)
  }

  const checkDateRangeValid = (startDate: Dayjs | null, endDate: Dayjs | null) => {
    if (startDate && endDate && startDate.isAfter(endDate)) {
      setDateRangeValueError([dateRangeValueError[0], true])
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateRangeBox>
        <DatePicker
          PaperProps={datePickerPropsStyles}
          label='From'
          value={dayjs(startDate)}
          onChange={(newValue) => {
            checkDateformat(newValue, DATE_RANGE.START_DATE)
            checkDateRangeValid(newValue, newValue && newValue.add(14, 'day'))
            newValue &&
              dispatch(
                updateDateRange({
                  startDate: newValue.valueOf(),
                  endDate: newValue.add(14, 'day').valueOf(),
                })
              )
            dispatch(changeBoardVerifyState(false))
          }}
          renderInput={(params) => {
            if (params.inputProps) params.inputProps.placeholder = SELECT_OR_WRITE_DATE
            return (
              <TextField {...params} variant='standard' required error={dateRangeValueError[DATE_RANGE.START_DATE]} />
            )
          }}
        />
        <DatePicker
          PaperProps={datePickerPropsStyles}
          label='To'
          value={dayjs(endDate)}
          minDate={dayjs(startDate)}
          onChange={(newValue) => {
            checkDateformat(newValue, DATE_RANGE.END_DATE)
            checkDateRangeValid(dayjs(startDate), newValue)
            newValue && dispatch(updateDateRange({ startDate: startDate, endDate: newValue.valueOf() }))
            dispatch(changeBoardVerifyState(false))
          }}
          renderInput={(params) => {
            if (params.inputProps) params.inputProps.placeholder = SELECT_OR_WRITE_DATE
            return (
              <TextField {...params} variant='standard' required error={dateRangeValueError[DATE_RANGE.END_DATE]} />
            )
          }}
        />
      </DateRangeBox>
    </LocalizationProvider>
  )
}
