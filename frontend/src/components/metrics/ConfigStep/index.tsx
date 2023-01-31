import { FormControl, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material'
import React, { ChangeEvent, useState } from 'react'
import { CHINA_CALENDAR, REGULAR_CALENDAR } from '@src/constants'

export const ConfigStep = () => {
  const [calendarType, setCalendarType] = useState(REGULAR_CALENDAR)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCalendarType((event.target as HTMLInputElement).value)
  }
  return (
    <FormControl>
      <TextField required id='standard-error-helper-text' label='Project Name' variant='standard' />
      <h3>Collection Date</h3>
      <RadioGroup
        aria-labelledby='demo-controlled-radio-buttons-group'
        name='controlled-radio-buttons-group'
        value={calendarType}
        onChange={handleChange}
      >
        <FormControlLabel value={REGULAR_CALENDAR} control={<Radio />} label={REGULAR_CALENDAR} />
        <FormControlLabel value={CHINA_CALENDAR} control={<Radio />} label={CHINA_CALENDAR} />
      </RadioGroup>
    </FormControl>
  )
}
