import { Divider, Title } from '../Crews/style'
import { Checkbox, FormControl, InputLabel, MenuItem, Select, ListItemText, SelectChangeEvent } from '@mui/material'
import { useState } from 'react'

interface classificationProps {
  title: string
  label: string
  options: { name: string; key: string; flag: boolean }[]
}

export const Classification = ({ options, title, label }: classificationProps) => {
  const [selectedTargetField, setSelectedTargetField] = useState<string[]>([])
  const isAllSelected = selectedTargetField.length === options.length
  const handleTargetFieldChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value
    const targetFieldNames = options.map((item) => item.name)
    if (value[value.length - 1] === 'All') {
      setSelectedTargetField(isAllSelected ? [] : targetFieldNames)
      return
    }
    setSelectedTargetField([...value])
  }

  return (
    <>
      <Divider>
        <Title>{title}</Title>
      </Divider>
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
