import { FormHelperText, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useState } from 'react'
import { FormControlWrapper } from './style'
import { useAppDispatch } from '@src/hooks'
import { updateDeploymentFrequencySettings } from '@src/context/Metrics/metricsSlice'

interface Props {
  options: string[]
  label: string
  value: string
  id: number
}

export const SingleSelection = ({ options, label, value, id }: Props) => {
  const dispatch = useAppDispatch()
  const [selectedValue, setSelectedValue] = useState(value)
  const errorMessage = `${label} is required`

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value
    setSelectedValue(value)
    dispatch(updateDeploymentFrequencySettings({ updateId: id, label, value }))
  }

  return (
    <>
      <FormControlWrapper variant='standard' required error>
        <InputLabel id='single-selection-label'>{label}</InputLabel>
        <Select labelId='single-selection-label' value={selectedValue} onChange={handleChange}>
          {options.map((data) => (
            <MenuItem key={data} value={data}>
              <ListItemText primary={data} />
            </MenuItem>
          ))}
        </Select>

        {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
      </FormControlWrapper>
    </>
  )
}
