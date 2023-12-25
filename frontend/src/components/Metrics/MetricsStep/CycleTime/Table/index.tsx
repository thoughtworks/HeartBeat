import React, { useCallback } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useAppSelector } from '@src/hooks'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { saveCycleTimeSettings, saveDoneColumn, selectMetricsContent } from '@src/context/Metrics/metricsSlice'
import { selectBoard, selectJiraColumns } from '@src/context/config/configSlice'
import { DONE, METRICS_CYCLE_SETTING_TABLE_HEADER } from '@src/constants/resources'
import { FormSelect } from '@src/components/Metrics/MetricsStep/CycleTime/FormSelect'

const CycleTimeTable = () => {
  const { type } = useAppSelector(selectBoard)
  console.log('type [table]', type)
  const { cycleTimeSettings } = useAppSelector(selectMetricsContent)
  console.log('cycleTimeSettings [table]', cycleTimeSettings)
  const jiraColumns = useAppSelector(selectJiraColumns)
  console.log('selectJiraColumns [table]', jiraColumns)
  const jiraColumnsWithValue = jiraColumns?.map(
    (obj: { key: string; value: { name: string; statuses: string[] } }) => obj.value
  )
  console.log('jiraColumnsWithValue [table]', jiraColumnsWithValue)
  const rows = cycleTimeSettings.map((setting) => ({
    ...setting,
    ...jiraColumnsWithValue.find((columnWithValue) => columnWithValue.name === setting.name),
  }))
  console.log('rows [table]', rows)

  const dispatch = useAppDispatch()

  const resetRealDoneColumn = useCallback(
    (name: string, value: string) => {
      const optionNamesWithDone = cycleTimeSettings.filter((item) => item.value === DONE).map((item) => item.name)

      if (value === DONE) {
        dispatch(saveDoneColumn([]))
      }

      if (optionNamesWithDone.includes(name)) {
        dispatch(saveDoneColumn([]))
      }
    },
    [cycleTimeSettings, dispatch]
  )
  const saveCycleTimeOptions = useCallback(
    (name: string, value: string) => {
      const newCycleTimeSettings = cycleTimeSettings.map((item) =>
        item.name === name
          ? {
              ...item,
              value,
            }
          : item
      )

      resetRealDoneColumn(name, value)
      dispatch(saveCycleTimeSettings(newCycleTimeSettings))
    },
    [cycleTimeSettings, dispatch, resetRealDoneColumn]
  )

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {METRICS_CYCLE_SETTING_TABLE_HEADER.map((column, index) => (
                <TableCell key={index}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              return (
                <TableRow hover key={index}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.statuses?.join(',')}</TableCell>
                  <TableCell>
                    <FormSelect
                      containerSx={{ width: '100%' }}
                      label={''}
                      name={''}
                      defaultSelected={row.value}
                      saveCycleTimeOptions={saveCycleTimeOptions}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default CycleTimeTable
