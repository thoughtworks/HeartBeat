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
import { saveDoneColumn, selectBoardColumns } from '@src/context/Metrics/metricsSlice'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import MetricsSettingTitle from '@src/components/Common/MetricsSettingTitle'
import { DEFAULT_HELPER_TEXT, METRICS_CONSTANTS, SELECTED_VALUE_SEPARATOR } from '@src/constants'
import { useAppSelector } from '@src/hooks'

interface realDoneProps {
  columns: { key: string; value: { name: string; statuses: string[] } }[]
  title: string
  label: string
}

function getSelectedDoneColumns(selectedBoardColumns: { name: string; value: string }[]) {
  const selectedDoneColumns = selectedBoardColumns
    .filter(({ value }) => value === METRICS_CONSTANTS.doneValue)
    .map(({ name }) => name)
  return selectedDoneColumns
}

function getFilteredStatuses(
  columns: { key: string; value: { name: string; statuses: string[] } }[],
  selectedDoneColumns: string[]
) {
  const filteredStatuses = columns
    .filter(({ value }) => selectedDoneColumns.includes(value.name))
    .flatMap(({ value }) => value.statuses)
  return filteredStatuses
}

function getDoneStatuses(columns: { key: string; value: { name: string; statuses: string[] } }[]) {
  const doneStatuses =
    columns.find((column) => column.key === METRICS_CONSTANTS.doneKeyFromBackend)?.value.statuses ?? []
  return doneStatuses
}

export const RealDone = ({ columns, title, label }: realDoneProps) => {
  const dispatch = useAppDispatch()
  const selectedBoardColumns = useAppSelector(selectBoardColumns)
  const doneStatuses = getDoneStatuses(columns)
  const selectedDoneColumns = getSelectedDoneColumns(selectedBoardColumns)
  const filteredStatuses = getFilteredStatuses(columns, selectedDoneColumns)
  const statuses = selectedDoneColumns.length < 1 ? doneStatuses : filteredStatuses
  const [selectedDoneStatuses, setSelectedDoneStatuses] = useState([] as string[])
  const isAllSelected = selectedDoneStatuses.length === statuses.length

  useEffect(() => {
    setSelectedDoneStatuses([])
  }, [selectedBoardColumns])

  const handleRealDoneChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value
    if (value[value.length - 1] === 'All') {
      setSelectedDoneStatuses(selectedDoneStatuses.length === statuses.length ? [] : statuses)
      dispatch(saveDoneColumn(selectedDoneStatuses.length === statuses.length ? [] : statuses))
      return
    }
    setSelectedDoneStatuses([...value])
    dispatch(saveDoneColumn([...value]))
  }

  return (
    <>
      <MetricsSettingTitle title={title} />
      <FormControl variant='standard' required error={!selectedDoneStatuses.length}>
        <InputLabel id='real-done-data-multiple-checkbox-label'>{label}</InputLabel>
        <Select
          labelId='real-done-data-multiple-checkbox-label'
          multiple
          value={selectedDoneStatuses}
          onChange={handleRealDoneChange}
          renderValue={(selectedDoneColumn: string[]) => selectedDoneColumn.join(SELECTED_VALUE_SEPARATOR)}
        >
          <MenuItem value='All'>
            <Checkbox checked={isAllSelected} />
            <ListItemText primary='All' />
          </MenuItem>
          {statuses.map((column) => {
            const isChecked = selectedDoneStatuses.includes(column)
            return (
              <MenuItem key={column} value={column}>
                <Checkbox checked={isChecked} />
                <ListItemText primary={column} />
              </MenuItem>
            )
          })}
        </Select>
        {!selectedDoneStatuses.length ? (
          <FormHelperText>
            Must select which you want to <strong>consider as Done</strong>
          </FormHelperText>
        ) : (
          DEFAULT_HELPER_TEXT
        )}
      </FormControl>
    </>
  )
}
