import { FormHelperText, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React from 'react'
import { FormControlWrapper } from './style'
import camelCase from 'lodash.camelcase'

interface Props {
  options: string[]
  label: string
  value: string
  id: number
  errorMessage: string | undefined
  onGetSteps?: (pipelineName: string) => void
  onUpDatePipeline: (id: number, label: string, value: string) => void
  onClearErrorMessage: (id: number, label: string) => void
}

export const SingleSelection = ({
  options,
  label,
  value,
  id,
  errorMessage,
  onGetSteps,
  onUpDatePipeline,
  onClearErrorMessage,
}: Props) => {
  const labelId = `single-selection-${label.toLowerCase().replace(' ', '-')}`

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value
    if (onGetSteps) {
      onGetSteps(value)
      onUpDatePipeline(id, 'Step', '')
    }
    onUpDatePipeline(id, label, value)
    !!errorMessage && onClearErrorMessage(id, camelCase(label))
  }

  return (
    <>
      <FormControlWrapper variant='standard' required error={!!errorMessage}>
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select labelId={labelId} value={value} onChange={handleChange}>
          {options.map((data) => (
            <MenuItem key={data} value={data} data-test-id={labelId}>
              <ListItemText primary={data} />
            </MenuItem>
          ))}
        </Select>
        {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
      </FormControlWrapper>
    </>
  )
}
