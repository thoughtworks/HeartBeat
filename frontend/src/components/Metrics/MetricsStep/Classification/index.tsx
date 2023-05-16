import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useState } from 'react'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { saveTargetFields, selectMetricsContent, updateClassification } from '@src/context/Metrics/metricsSlice'
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle'
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
  const isProjectCreated = useAppSelector(selectMetricsContent).isProjectCreated
  const importClassification = useAppSelector(selectMetricsContent).classification
  const targetFieldNames = options.map((e) => e.name)
  const [selectedClassification, setSelectedClassification] = useState(
    getArrayIntersection(targetFieldNames, importClassification)
  )
  const isAllSelected = selectedClassification.length > 0 && selectedClassification.length === options.length

  const handleTargetFieldChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value
    const classificationSettings =
      value[value.length - 1] === 'All' ? (isAllSelected ? [] : targetFieldNames) : [...value]
    const updatedTargetFields = options.map((option) => ({
      ...option,
      flag: selectedClassification.includes(option.name),
    }))
    setSelectedClassification(classificationSettings)
    dispatch(updateClassification(classificationSettings))
    dispatch(saveTargetFields(updatedTargetFields))
  }

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
          value={selectedClassification}
          onChange={handleTargetFieldChange}
          renderValue={(selectedTargetField: string[]) => selectedTargetField.join(SELECTED_VALUE_SEPARATOR)}
        >
          <MenuItem value='All'>
            <Checkbox checked={isAllSelected} />
            <ListItemText primary='All' />
          </MenuItem>
          {options.map((targetField) => (
            <MenuItem key={targetField.key} value={targetField.name}>
              <Checkbox checked={selectedClassification.includes(targetField.name)} />
              <ListItemText primary={targetField.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}
