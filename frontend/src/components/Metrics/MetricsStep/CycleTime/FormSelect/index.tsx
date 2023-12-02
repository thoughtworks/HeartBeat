import { Autocomplete, TextField, Tooltip } from '@mui/material'
import React, { useState } from 'react'
import { FormControlSelection } from '@src/components/Metrics/MetricsStep/CycleTime/FormSelect/style'
import { CYCLE_TIME_LIST, Z_INDEX } from '@src/constants'

interface formSelectProps {
  label: string
  name: string
  defaultSelected: string
  saveCycleTimeOptions: (name: string, value: string) => void
}

export const FormSelect = ({ label, name, defaultSelected, saveCycleTimeOptions }: formSelectProps) => {
  const [selectedCycleTime, setSelectedCycleTime] = useState(defaultSelected)
  const [inputValue, setInputValue] = useState<string>('')

  const handleSelectedCycleTimeChange = (value: string) => {
    saveCycleTimeOptions(name, value)
    setSelectedCycleTime(value)
  }
  const renderInputLabel = () => {
    if (label.length > 25) {
      return (
        <Tooltip title={label} placement={'right'}>
          <span>{label}</span>
        </Tooltip>
      )
    }
    return label
  }

  return (
    <FormControlSelection variant='standard' required>
      <Autocomplete
        id='cycletime-data-combo-box'
        data-test-id={label}
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
        renderInput={(params) => <TextField required {...params} label={renderInputLabel()} variant='standard' />}
        slotProps={{
          popper: {
            sx: {
              zIndex: Z_INDEX.DROPDOWN,
            },
          },
        }}
      />
    </FormControlSelection>
  )
}
