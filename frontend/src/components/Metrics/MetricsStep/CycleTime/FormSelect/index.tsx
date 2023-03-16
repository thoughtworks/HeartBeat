import { InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useState } from 'react'
import { FormControlSelection } from '@src/components/Metrics/MetricsStep/CycleTime/FormSelect/style'
import { CYCLETIME_LIST } from '@src/constants'

interface formSelectProps {
  label: string
  defaultSelected: string[]
  saveCycleTimeOptions: (name: string, value: string) => void
}

export const FormSelect = ({ label, defaultSelected, saveCycleTimeOptions }: formSelectProps) => {
  const [selectedCycleTime, setSelectedCycleTime] = useState([...defaultSelected])
  const handleCycleTimeChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value.toString()
    saveCycleTimeOptions(label, value)
    setSelectedCycleTime([...value])
  }
  const selectedValue = selectedCycleTime.toString().replace(/,/g, '')

  return (
    <FormControlSelection variant='standard' required>
      <InputLabel id='cycletime-data-checkbox-label'>{label}</InputLabel>
      <Select labelId='cycletime-data-checkbox-label' value={[selectedValue]} onChange={handleCycleTimeChange}>
        {CYCLETIME_LIST.map((data) => (
          <MenuItem key={data} value={data}>
            <ListItemText primary={data} />
          </MenuItem>
        ))}
      </Select>
    </FormControlSelection>
  )
}
