import {
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Divider, Title } from './style'

interface realDoneProps {
  options: string[]
  title: string
  label: string
}
export const RealDone = ({ options, title, label }: realDoneProps) => {
  const [isEmptyRealDoneData, setIsEmptyRealDoneData] = useState<boolean>(false)
  const [selectedRealDone, setSelectedRealDone] = useState(options)
  const isAllSelected = options.length > 0 && selectedRealDone.length === options.length

  useEffect(() => {
    setIsEmptyRealDoneData(selectedRealDone.length === 0)
  }, [selectedRealDone])

  const handleRealDoneChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value
    if (value[value.length - 1] === 'All') {
      setSelectedRealDone(selectedRealDone.length === options.length ? [] : options)
      return
    }
    setSelectedRealDone([...value])
  }
  return (
    <>
      <Divider>
        <Title>{title}</Title>
      </Divider>
      <FormControl variant='standard' required error={isEmptyRealDoneData}>
        <InputLabel id='real-done-data-multiple-checkbox-label'>{label}</InputLabel>
        <Select
          labelId='real-done-data-multiple-checkbox-label'
          multiple
          value={selectedRealDone}
          onChange={handleRealDoneChange}
          renderValue={(selectedRealDone: string[]) => selectedRealDone.join(', ')}
        >
          <MenuItem value='All'>
            <Checkbox checked={isAllSelected} />
            <ListItemText primary='All' />
          </MenuItem>
          {options.map((data) => (
            <MenuItem key={data} value={data}>
              <Checkbox checked={selectedRealDone.includes(data)} />
              <ListItemText primary={data} />
            </MenuItem>
          ))}
        </Select>
        {isEmptyRealDoneData && (
          <FormHelperText>
            Must select which you want to <strong>consider as Done</strong>
          </FormHelperText>
        )}
      </FormControl>
    </>
  )
}
