import { Checkbox, FormControl, InputLabel, MenuItem, Select, ListItemText, SelectChangeEvent } from '@mui/material'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { updateTargetFields } from '@src/context/Metrics/metricsSlice'
import MetricsSettingTitle from '@src/components/Common/MetricsSettingTitle'

interface classificationProps {
  title: string
  label: string
  options: { name: string; key: string; flag: boolean }[]
}

export const Classification = ({ options, title, label }: classificationProps) => {
  const dispatch = useAppDispatch()
  const [selectedTargetField, setSelectedTargetField] = useState<string[]>([])
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
    dispatch(updateTargetFields(updatedTargetFields))
  }, [selectedTargetField, dispatch, options])

  return (
    <>
      <MetricsSettingTitle title={title} />
      <FormControl variant='standard'>
        <InputLabel id='classification-check-box'>{label}</InputLabel>
        <Select
          multiple
          labelId='classification-check-box'
          value={selectedTargetField}
          onChange={handleTargetFieldChange}
          renderValue={(selectedTargetField: string[]) => selectedTargetField.join(',')}
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
