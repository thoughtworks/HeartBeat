import { Checkbox, FormHelperText, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { saveDoneColumn, selectBoardColumns, selectMetricsContent } from '@src/context/Metrics/metricsSlice'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle'
import { DEFAULT_HELPER_TEXT, METRICS_CONSTANTS, SELECTED_VALUE_SEPARATOR } from '@src/constants'
import { useAppSelector } from '@src/hooks'
import { FormControlWrapper } from './style'

interface realDoneProps {
  columns: { key: string; value: { name: string; statuses: string[] } }[]
  title: string
  label: string
}

function getSelectedDoneColumns(selectedBoardColumns: { name: string; value: string }[]) {
  return selectedBoardColumns.filter(({ value }) => value === METRICS_CONSTANTS.doneValue).map(({ name }) => name)
}

function getFilteredStatuses(
  columns: { key: string; value: { name: string; statuses: string[] } }[],
  selectedDoneColumns: string[]
) {
  return columns.filter(({ value }) => selectedDoneColumns.includes(value.name)).flatMap(({ value }) => value.statuses)
}

function getDoneStatuses(columns: { key: string; value: { name: string; statuses: string[] } }[]) {
  return columns.find((column) => column.key === METRICS_CONSTANTS.doneKeyFromBackend)?.value.statuses ?? []
}

export const RealDone = ({ columns, title, label }: realDoneProps) => {
  const dispatch = useAppDispatch()
  const selectedBoardColumns = useAppSelector(selectBoardColumns)
  const savedDoneColumns = useAppSelector(selectMetricsContent).doneColumn
  const doneStatuses = getDoneStatuses(columns)
  const selectedDoneColumns = getSelectedDoneColumns(selectedBoardColumns)
  const filteredStatuses = getFilteredStatuses(columns, selectedDoneColumns)
  const statuses = selectedDoneColumns.length < 1 ? doneStatuses : filteredStatuses
  const [selectedDoneStatuses, setSelectedDoneStatuses] = useState([] as string[])
  const isAllSelected = savedDoneColumns.length === statuses.length

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
      <FormControlWrapper variant='standard' required error={!savedDoneColumns.length}>
        <InputLabel id='real-done-data-multiple-checkbox-label'>{label}</InputLabel>
        <Select
          labelId='real-done-data-multiple-checkbox-label'
          multiple
          value={savedDoneColumns}
          onChange={handleRealDoneChange}
          renderValue={(selectedDoneColumn: string[]) => selectedDoneColumn.join(SELECTED_VALUE_SEPARATOR)}
        >
          <MenuItem value='All'>
            <Checkbox checked={isAllSelected} />
            <ListItemText primary='All' />
          </MenuItem>
          {statuses.map((column) => {
            const isChecked = savedDoneColumns.includes(column)
            return (
              <MenuItem key={column} value={column}>
                <Checkbox checked={isChecked} />
                <ListItemText primary={column} />
              </MenuItem>
            )
          })}
        </Select>
        {!savedDoneColumns.length ? (
          <FormHelperText>
            Must select which you want to <strong>consider as Done</strong>
          </FormHelperText>
        ) : (
          DEFAULT_HELPER_TEXT
        )}
      </FormControlWrapper>
    </>
  )
}
