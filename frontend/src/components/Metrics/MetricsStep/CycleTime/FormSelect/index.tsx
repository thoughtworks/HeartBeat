import { Autocomplete, TextField } from '@mui/material'
import React, { useState } from 'react'
import { FormControlSelection } from '@src/components/Metrics/MetricsStep/CycleTime/FormSelect/style'
import { CYCLE_TIME_LIST } from '@src/constants'

interface formSelectProps {
  label: string
  defaultSelected: string
  saveCycleTimeOptions: (name: string, value: string) => void
}

export const FormSelect = ({ label, defaultSelected, saveCycleTimeOptions }: formSelectProps) => {
  const [selectedCycleTime, setSelectedCycleTime] = useState(defaultSelected)
  const [inputValue, setInputValue] = useState<string>('')

  const handleSelectedCycleTimeChange = (value: string) => {
    saveCycleTimeOptions(label, value)
    setSelectedCycleTime(value)
  }

  return (
    <FormControlSelection variant='standard' required>
      <Autocomplete
        id='cycletime-data-combo-box'
        data-test-id='cycle-time-data-combo-box'
        disableClearable
        options={CYCLE_TIME_LIST}
        value={selectedCycleTime}
        onChange={(event, newValue: string) => {
          handleSelectedCycleTimeChange(newValue)
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue)
        }}
        renderInput={(params) => <TextField required {...params} label={label} variant='standard' />}
      />
    </FormControlSelection>
  )
}
