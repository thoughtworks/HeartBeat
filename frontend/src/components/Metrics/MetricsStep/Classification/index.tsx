import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useState } from 'react'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { saveTargetFields, selectClassificationWarningMessage } from '@src/context/Metrics/metricsSlice'
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle'
import { SELECTED_VALUE_SEPARATOR } from '@src/constants'
import { useAppSelector } from '@src/hooks'
import { WarningNotification } from '@src/components/Common/WarningNotification'

interface classificationProps {
  title: string
  label: string
  targetFields: { name: string; key: string; flag: boolean }[]
}

export const Classification = ({ targetFields, title, label }: classificationProps) => {
  const dispatch = useAppDispatch()
  const classificationWarningMessage = useAppSelector(selectClassificationWarningMessage)
  const classificationSettings = targetFields
    .filter((targetField) => targetField.flag)
    .map((targetField) => targetField.name)
  const [selectedClassification, setSelectedClassification] = useState(classificationSettings)
  const isAllSelected = selectedClassification.length > 0 && selectedClassification.length === targetFields.length

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value
    const newClassificationSettings =
      value[value.length - 1] === 'All'
        ? isAllSelected
          ? []
          : targetFields.map((targetField) => targetField.name)
        : [...value]
    const updatedTargetFields = targetFields.map((targetField) => ({
      ...targetField,
      flag: newClassificationSettings.includes(targetField.name),
    }))
    setSelectedClassification(newClassificationSettings)
    dispatch(saveTargetFields(updatedTargetFields))
  }

  return (
    <>
      <MetricsSettingTitle title={title} />
      {classificationWarningMessage && <WarningNotification message={classificationWarningMessage} />}
      <FormControl variant='standard'>
        <InputLabel id='classification-check-box'>{label}</InputLabel>
        <Select
          multiple
          labelId='classification-check-box'
          value={selectedClassification}
          onChange={handleChange}
          renderValue={(selectedClassification: string[]) => selectedClassification.join(SELECTED_VALUE_SEPARATOR)}
        >
          <MenuItem value='All'>
            <Checkbox checked={isAllSelected} />
            <ListItemText primary='All' />
          </MenuItem>
          {targetFields.map((targetField) => (
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
