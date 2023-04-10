import { Checkbox, FormControl, InputLabel, MenuItem, Select, ListItemText, SelectChangeEvent } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { saveTargetFields, selectMetricsContent } from '@src/context/Metrics/metricsSlice'
import MetricsSettingTitle from '@src/components/Common/MetricsSettingTitle'
import { SELECTED_VALUE_SEPARATOR } from '@src/constants'
import { useAppSelector } from '@src/hooks'
import { WaringDone } from '@src/components/Metrics/MetricsStep/CycleTime/style'
import { getArrayIntersection } from '@src/utils/util'

interface classificationProps {
  title: string
  label: string
  options: { name: string; key: string; flag: boolean }[]
}

export const Classification = ({ options, title, label }: classificationProps) => {
  const dispatch = useAppDispatch()
  const importClassification = useAppSelector(selectMetricsContent).classification
  const isProjectCreated = useAppSelector(selectMetricsContent).isProjectCreated
  const optionsName = options.map((e) => e.name)

  const defaultInput = getArrayIntersection(optionsName, importClassification)
  const [selectedTargetField, setSelectedTargetField] = useState(isProjectCreated ? [] : defaultInput)
  const isAllSelected = selectedTargetField.length > 0 && selectedTargetField.length === options.length

  const handleTargetFieldChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value
    const targetFieldNames = options.map((item) => item.name)
    if (value[value.length - 1] === 'All') {
      setSelectedTargetField(isAllSelected ? [] : targetFieldNames)
      return
    }
    setSelectedTargetField([...value])
  }

  useEffect(() => {
    const updatedTargetFields = options.map((option) => ({
      ...option,
      flag: selectedTargetField.includes(option.name),
    }))
    dispatch(saveTargetFields(updatedTargetFields))
  }, [selectedTargetField, dispatch, options])

  return (
    <>
      <MetricsSettingTitle title={title} />
      {!isProjectCreated && (
        <WaringDone>
          <span>Warning: Some classifications in import data might be removed now.</span>
        </WaringDone>
      )}
      <FormControl variant='standard'>
        <InputLabel id='classification-check-box'>{label}</InputLabel>
        <Select
          multiple
          labelId='classification-check-box'
          value={selectedTargetField}
          onChange={handleTargetFieldChange}
          renderValue={(selectedTargetField: string[]) => selectedTargetField.join(SELECTED_VALUE_SEPARATOR)}
        >
          <MenuItem value='All'>
            <Checkbox checked={isAllSelected} />
            <ListItemText primary='All' />
          </MenuItem>
          {options.map((targetField) => (
            <MenuItem key={targetField.key} value={targetField.name}>
              <Checkbox checked={selectedTargetField.includes(targetField.name)} />
              <ListItemText primary={targetField.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}
