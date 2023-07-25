import { Checkbox, FormHelperText, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useState } from 'react'
import {
  saveDoneColumn,
  selectCycleTimeSettings,
  selectMetricsContent,
  selectRealDoneWarningMessage,
} from '@src/context/Metrics/metricsSlice'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle'
import { DEFAULT_HELPER_TEXT, METRICS_CONSTANTS, SELECTED_VALUE_SEPARATOR } from '@src/constants'
import { useAppSelector } from '@src/hooks'
import { FormControlWrapper } from './style'
import { WarningNotification } from '@src/components/Common/WarningNotification'

interface realDoneProps {
  columns: { key: string; value: { name: string; statuses: string[] } }[]
  title: string
  label: string
}

const getSelectedDoneColumns = (selectedBoardColumns: { name: string; value: string }[]) =>
  selectedBoardColumns.filter(({ value }) => value === METRICS_CONSTANTS.doneValue).map(({ name }) => name)

const getFilteredStatus = (
  columns: { key: string; value: { name: string; statuses: string[] } }[],
  selectedDoneColumns: string[]
) => columns.filter(({ value }) => selectedDoneColumns.includes(value.name)).flatMap(({ value }) => value.statuses)

const getDoneStatus = (columns: { key: string; value: { name: string; statuses: string[] } }[]) =>
  columns.find((column) => column.key === METRICS_CONSTANTS.doneKeyFromBackend)?.value.statuses ?? []

export const RealDone = ({ columns, title, label }: realDoneProps) => {
  const dispatch = useAppDispatch()
  const selectedCycleTimeSettings = useAppSelector(selectCycleTimeSettings)
  const savedDoneColumns = useAppSelector(selectMetricsContent).doneColumn
  const realDoneWarningMessage = useAppSelector(selectRealDoneWarningMessage)
  const doneStatus = getDoneStatus(columns)
  const selectedDoneColumns = getSelectedDoneColumns(selectedCycleTimeSettings)
  const filteredStatus = getFilteredStatus(columns, selectedDoneColumns)
  const status = selectedDoneColumns.length < 1 ? doneStatus : filteredStatus
  const [selectedDoneStatus, setSelectedDoneStatus] = useState([] as string[])
  const isAllSelected = savedDoneColumns.length === status.length

  const handleRealDoneChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value
    if (value[value.length - 1] === 'All') {
      setSelectedDoneStatus(selectedDoneStatus.length === status.length ? [] : status)
      dispatch(saveDoneColumn(selectedDoneStatus.length === status.length ? [] : status))
      return
    }
    setSelectedDoneStatus([...value])
    dispatch(saveDoneColumn([...value]))
  }

  return (
    <>
      <MetricsSettingTitle title={title} />
      {realDoneWarningMessage && <WarningNotification message={realDoneWarningMessage} />}
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
          {status.map((column) => {
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
