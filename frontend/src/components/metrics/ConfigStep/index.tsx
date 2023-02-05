import { FormControl, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material'
import React from 'react'
import { CHINA_CALENDAR, REGULAR_CALENDAR } from '@src/constants'

export const ConfigStep = () => {
  return (
    <FormControl>
      <TextField required id='standard-error-helper-text' label='Project Name' variant='standard' />
      <h3>Collection Date</h3>
      <RadioGroup
        data-testid='radio-test'
        aria-labelledby='demo-controlled-radio-buttons-group'
        name='controlled-radio-buttons-group'
        defaultValue={REGULAR_CALENDAR}
      >
        <FormControlLabel value={REGULAR_CALENDAR} control={<Radio />} label={REGULAR_CALENDAR} />
        <FormControlLabel value={CHINA_CALENDAR} control={<Radio />} label={CHINA_CALENDAR} />
      </RadioGroup>
    </FormControl>
  )
}
