import { FormHelperText, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useState } from 'react'
import { FormControlWrapper } from './style'
import { useAppDispatch } from '@src/hooks'
import { updateDeploymentFrequencySettings } from '@src/context/Metrics/metricsSlice'
import { useMetricsStepValidationCheckContext } from '@src/hooks/useMetricsStepValidationCheckContext'
import camelCase from 'lodash.camelcase'

interface Props {
  options: string[]
  label: string
  value: string
  id: number
  errorMessage: string | undefined
  onGetSteps?: (pipelineName: string) => void
}

export const SingleSelection = ({ options, label, value, id, errorMessage, onGetSteps }: Props) => {
  const dispatch = useAppDispatch()
  const [selectedValue, setSelectedValue] = useState(value)
  const { clearErrorMessage } = useMetricsStepValidationCheckContext()
  const labelId = `single-selection-${label.toLowerCase().replace(' ', '-')}`

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value
    if (onGetSteps) onGetSteps(value)
    setSelectedValue(value)
    dispatch(updateDeploymentFrequencySettings({ updateId: id, label, value }))
    !!errorMessage && clearErrorMessage(id, camelCase(label))
  }

  return (
    <>
      <FormControlWrapper variant='standard' required error={!!errorMessage}>
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select labelId={labelId} value={options.length > 0 ? selectedValue : ''} onChange={handleChange}>
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
