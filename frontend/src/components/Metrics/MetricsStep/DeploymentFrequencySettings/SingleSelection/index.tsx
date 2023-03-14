import { InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useState } from 'react'
import { FormControlWrapper } from './style'

interface Props {
  options: string[]
  label: string
  value: string
}

export const SingleSelection = ({ options, label, value }: Props) => {
  const [selectedValue, setSelectedValue] = useState(value)

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value
    setSelectedValue(value)
  }
  return (
    <>
      <FormControlWrapper variant='standard' required>
        <InputLabel id='crew-data-multiple-checkbox-label'>{label}</InputLabel>
        <Select labelId='crew-data-multiple-checkbox-label' value={selectedValue} onChange={handleChange}>
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
