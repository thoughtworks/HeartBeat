import { InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useState } from 'react'
import { FormControlWrapper } from './style'
import { useAppDispatch } from '@src/hooks'
import { updateDeploymentFrequencySettings } from '@src/context/pipelineMetricsSettings/pipelineMetricsSettingsSlice'

interface Props {
  options: string[]
  label: string
  value: string
  index: number
}

export const SingleSelection = ({ options, label, value, index }: Props) => {
  const dispatch = useAppDispatch()
  const [selectedValue, setSelectedValue] = useState(value)

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value
    setSelectedValue(value)
    dispatch(updateDeploymentFrequencySettings({ updateIndex: index, label, value }))
  }

  return (
    <>
      <FormControlWrapper variant='standard' required>
        <InputLabel id='single-selection-label'>{label}</InputLabel>
        <Select labelId='single-selection-label' value={selectedValue} onChange={handleChange}>
          {options.map((data) => (
            <MenuItem key={data} value={data}>
              <ListItemText primary={data} />
            </MenuItem>
          ))}
        </Select>
      </FormControlWrapper>
    </>
  )
}
