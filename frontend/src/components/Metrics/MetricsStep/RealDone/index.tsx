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
import { METRICS_CONSTANTS, SELECTED_VALUE_SEPARATOR } from '@src/constants'

interface realDoneProps {
  columns: { key: string; value: { name: string; statuses: string[] } }[]
  title: string
  label: string
}

export const RealDone = ({ columns, title, label }: realDoneProps) => {
  const dispatch = useAppDispatch()
  const [isEmptyRealDoneData, setIsEmptyRealDoneData] = useState<boolean>(false)
  const doneColumns =
    columns.find((column) => column.key === METRICS_CONSTANTS.doneKeyFromBackend)?.value.statuses ?? []
  const [selectedDoneColumn, setSelectedDoneColumn] = useState(doneColumns)
  const isAllSelected = doneColumns.length > 0 && selectedDoneColumn.length === doneColumns.length

  useEffect(() => {
    dispatch(saveDoneColumn(selectedDoneColumn))
    setIsEmptyRealDoneData(!selectedDoneColumn.length)
  }, [selectedDoneColumn, dispatch])

  const handleRealDoneChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target

    if (value.includes('All')) {
      setSelectedDoneColumn(selectedDoneColumn.length === doneColumns.length ? [] : doneColumns)
    } else {
      setSelectedDoneColumn([...value])
    }
  }

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
          {doneColumns.map((column) => {
            const isChecked = selectedDoneColumn.includes(column)
            return (
              <MenuItem key={column} value={column}>
                <Checkbox checked={isChecked} />
                <ListItemText primary={column} />
              </MenuItem>
            )
          })}
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
