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
import { saveDoneColumn } from '@src/context/Metrics/metricsSlice'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import MetricsSettingTitle from '@src/components/Common/MetricsSettingTitle'
import { DEFAULT_HELPER_TEXT, SELECTED_VALUE_SEPARATOR } from '@src/constants'

interface realDoneProps {
  options: string[]
  title: string
  label: string
}
export const RealDone = ({ options, title, label }: realDoneProps) => {
  const dispatch = useAppDispatch()
  const [isEmptyRealDoneData, setIsEmptyRealDoneData] = useState<boolean>(false)
  const [selectedDoneColumn, setSelectedDoneColumn] = useState(options)
  const isAllSelected = options.length > 0 && selectedDoneColumn.length === options.length

  useEffect(() => {
    setIsEmptyRealDoneData(selectedDoneColumn.length === 0)
  }, [selectedDoneColumn])

  const handleRealDoneChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value
    if (value[value.length - 1] === 'All') {
      setSelectedDoneColumn(selectedDoneColumn.length === options.length ? [] : options)
      return
    }
    setSelectedDoneColumn([...value])
  }

  useEffect(() => {
    dispatch(saveDoneColumn(selectedDoneColumn))
  }, [selectedDoneColumn, dispatch])

  const errorHelperText = () => (
    <>
      Must select which you want to <strong>consider as Done</strong>
    </>
  )
  return (
    <>
      <MetricsSettingTitle title={title} />
      <FormControl variant='standard' required error={isEmptyRealDoneData}>
        <InputLabel id='real-done-data-multiple-checkbox-label'>{label}</InputLabel>
        <Select
          labelId='real-done-data-multiple-checkbox-label'
          multiple
          value={selectedDoneColumn}
          onChange={handleRealDoneChange}
          renderValue={(selectedDoneColumn: string[]) => selectedDoneColumn.join(SELECTED_VALUE_SEPARATOR)}
        >
          <MenuItem value='All'>
            <Checkbox checked={isAllSelected} />
            <ListItemText primary='All' />
          </MenuItem>
          {options.map((data) => (
            <MenuItem key={data} value={data}>
              <Checkbox checked={selectedDoneColumn.includes(data)} />
              <ListItemText primary={data} id={data} />
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{isEmptyRealDoneData ? errorHelperText() : DEFAULT_HELPER_TEXT}</FormHelperText>
      </FormControl>
    </>
  )
}
