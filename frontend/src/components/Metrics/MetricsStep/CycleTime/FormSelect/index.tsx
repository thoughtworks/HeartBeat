import { InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
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
  const handleCycleTimeChange = (event: SelectChangeEvent) => {
    const value = event.target.value.toString()
    saveCycleTimeOptions(label, value)
    setSelectedCycleTime(value)
  }

  return (
    <FormControlSelection variant='standard' required>
      <InputLabel id='cycletime-data-checkbox-label'>{label}</InputLabel>
      <Select labelId='cycletime-data-checkbox-label' value={selectedCycleTime} onChange={handleCycleTimeChange}>
        {CYCLE_TIME_LIST.map((data) => (
          <MenuItem key={data} value={data} data-test-id={data}>
            <ListItemText primary={data} />
          </MenuItem>
        ))}
      </Select>
    </FormControlSelection>
  )
}
