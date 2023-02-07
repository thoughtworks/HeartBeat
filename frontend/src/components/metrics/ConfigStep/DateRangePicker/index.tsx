import React, { useState } from 'react'
import { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { TextField } from '@mui/material'
import { DateRangeBox } from '@src/components/metrics/ConfigStep/DateRangePicker/style'
import { END_DATE, SELECT_OR_WRITE_DATE, START_DATE } from '@src/constants'

export const DateRangePicker = () => {
  const [dateRange, setDateRange] = useState<{
    startDate: Dayjs | null
    endDate: Dayjs | null
  }>({ startDate: null, endDate: null })

  const [dateRangeValueError, setDateRangeValueError] = useState({
    startDate: false,
    endDate: false,
  })

  const checkDateformat = (value: Dayjs | null, dateType: string) => {
    if (dateType === START_DATE) {
      if (value === null || !value?.isValid())
        setDateRangeValueError({
          ...dateRangeValueError,
          startDate: true,
        })
      else
        setDateRangeValueError({
          ...dateRangeValueError,
          startDate: false,
        })
    }
    if (dateType === END_DATE) {
      if (value === null || !value?.isValid())
        setDateRangeValueError({
          ...dateRangeValueError,
          endDate: true,
        })
      else
        setDateRangeValueError({
          ...dateRangeValueError,
          endDate: false,
        })
    }
  }

  const checkDateRangeValid = (startDate: Dayjs | null, endDate: Dayjs | null) => {
    setDateRange({ startDate, endDate })
    if (startDate?.isAfter(endDate!)) {
      setDateRange({ startDate, endDate: null })
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateRangeBox>
        <DatePicker
          label='From'
          value={dateRange.startDate}
          disablePast={true}
          onChange={(newValue) => {
            checkDateformat(newValue, START_DATE)
            checkDateRangeValid(newValue, dateRange.endDate)
          }}
          renderInput={(params) => {
            params.inputProps!.placeholder = SELECT_OR_WRITE_DATE
            return <TextField {...params} variant='standard' required error={dateRangeValueError.startDate} />
          }}
        />
        <DatePicker
          label='To'
          value={dateRange.endDate}
          disablePast={true}
          minDate={dateRange.startDate}
          onChange={(newValue) => {
            checkDateformat(newValue, END_DATE)
            checkDateRangeValid(dateRange.startDate, newValue)
          }}
          renderInput={(params) => {
            params.inputProps!.placeholder = SELECT_OR_WRITE_DATE
            return <TextField {...params} variant='standard' required error={dateRangeValueError.endDate} />
          }}
        />
      </DateRangeBox>
    </LocalizationProvider>
  )
}
