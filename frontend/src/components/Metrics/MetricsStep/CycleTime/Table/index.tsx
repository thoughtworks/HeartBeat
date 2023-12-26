import React, { useCallback } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useAppSelector } from '@src/hooks'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { saveCycleTimeSettings, saveDoneColumn, selectMetricsContent } from '@src/context/Metrics/metricsSlice'
import { selectJiraColumns } from '@src/context/config/configSlice'
import { DONE, METRICS_CYCLE_SETTING_TABLE_HEADER } from '@src/constants/resources'
import CellAutoComplete from '@src/components/Metrics/MetricsStep/CycleTime/Table/CellAutoComplete'
import { StyledTableHeaderCell, StyledTableRowCell } from '@src/components/Metrics/MetricsStep/CycleTime/Table/style'
import { TABLE_ROW_HEIGHT } from '@src/constants/commons'

const CycleTimeTable = () => {
  const dispatch = useAppDispatch()
  const { cycleTimeSettings } = useAppSelector(selectMetricsContent)
  const jiraColumns = useAppSelector(selectJiraColumns)
  const jiraColumnsWithValue = jiraColumns?.map(
    (obj: { key: string; value: { name: string; statuses: string[] } }) => obj.value
  )
  const rows = cycleTimeSettings.map((setting) => ({
    ...setting,
    statuses: jiraColumnsWithValue.find((columnWithValue) => columnWithValue.name === setting.name)?.statuses,
  }))

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
    <TableContainer sx={{ my: '1.25rem', maxHeight: `${6 * (TABLE_ROW_HEIGHT + 1) - 1}px` }}>
      <Table stickyHeader aria-label='sticky table'>
        <TableHead>
          <TableRow>
            {METRICS_CYCLE_SETTING_TABLE_HEADER.map((column, index) => (
              <StyledTableHeaderCell
                sx={{ width: `${(100 / METRICS_CYCLE_SETTING_TABLE_HEADER.length).toFixed(2)}%` }}
                key={index}
              >
                {column}
              </StyledTableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => {
            const row1Content = row.name
            const row2Content = row.statuses?.join(',')
            return (
              <TableRow hover key={index}>
                <StyledTableRowCell title={row1Content}>{row1Content}</StyledTableRowCell>
                <StyledTableRowCell title={row2Content}>{row2Content}</StyledTableRowCell>
                <StyledTableRowCell>
                  <CellAutoComplete name={`${row?.name}`} defaultSelected={row.value} onSelect={saveCycleTimeOptions} />
                </StyledTableRowCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CycleTimeTable
