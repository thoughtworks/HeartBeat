import { saveCycleTimeSettings, saveDoneColumn, selectMetricsContent } from '@src/context/Metrics/metricsSlice';
import { StyledTableHeaderCell, StyledTableRowCell } from '@src/containers/MetricsStep/CycleTime/Table/style';
import CellAutoComplete from '@src/containers/MetricsStep/CycleTime/Table/CellAutoComplete';
import { DONE, METRICS_CYCLE_SETTING_TABLE_HEADER } from '@src/constants/resources';
import { selectJiraColumns } from '@src/context/config/configSlice';
import EllipsisText from '@src/components/Common/EllipsisText';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import { useAppSelector } from '@src/hooks';
import React, { useCallback } from 'react';
import Table from '@mui/material/Table';
import { theme } from '@src/theme';

export const columns = METRICS_CYCLE_SETTING_TABLE_HEADER.map(
  (config) =>
    function CellRenderFunc() {
      return config.emphasis ? (
        <>
          <span>{config.text}</span>
          <span style={{ color: theme.components?.errorMessage.color }}> *</span>
        </>
      ) : (
        config.text
      );
    },
);

const CycleTimeTable = () => {
  const dispatch = useAppDispatch();
  const { cycleTimeSettings } = useAppSelector(selectMetricsContent);
  const jiraColumns = useAppSelector(selectJiraColumns);
  const jiraColumnsWithValue = jiraColumns?.map(
    (obj: { key: string; value: { name: string; statuses: string[] } }) => obj.value,
  );
  const rows = cycleTimeSettings.map((setting) => ({
    ...setting,
    statuses: jiraColumnsWithValue.find((columnWithValue) => columnWithValue.name === setting.name)?.statuses,
  }));

  const resetRealDoneColumn = useCallback(
    (name: string, value: string) => {
      const optionNamesWithDone = cycleTimeSettings.filter((item) => item.value === DONE).map((item) => item.name);

      if (value === DONE) {
        dispatch(saveDoneColumn([]));
      }

      if (optionNamesWithDone.includes(name)) {
        dispatch(saveDoneColumn([]));
      }
    },
    [cycleTimeSettings, dispatch],
  );
  const saveCycleTimeOptions = useCallback(
    (name: string, value: string) => {
      const newCycleTimeSettings = cycleTimeSettings.map((item) =>
        item.name === name
          ? {
              ...item,
              value,
            }
          : item,
      );

      resetRealDoneColumn(name, value);
      dispatch(saveCycleTimeSettings(newCycleTimeSettings));
    },
    [cycleTimeSettings, dispatch, resetRealDoneColumn],
  );

  return (
    <TableContainer sx={{ mb: '2rem' }}>
      <Table aria-label='sticky table'>
        <TableHead>
          <TableRow>
            {columns.map((columnRenderFunc, index) => (
              <StyledTableHeaderCell sx={{ width: `${(100 / columns.length).toFixed(2)}%` }} key={index}>
                {columnRenderFunc()}
              </StyledTableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => {
            const row1Content = row.name;
            const row2Content = row.statuses?.join(', ');
            return (
              <TableRow hover key={index}>
                <StyledTableRowCell>{row1Content}</StyledTableRowCell>
                <StyledTableRowCell>
                  <Tooltip title={row2Content} arrow>
                    <EllipsisText fitContent>{row2Content}</EllipsisText>
                  </Tooltip>
                </StyledTableRowCell>
                <StyledTableRowCell>
                  <CellAutoComplete name={`${row?.name}`} defaultSelected={row.value} onSelect={saveCycleTimeOptions} />
                </StyledTableRowCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CycleTimeTable;
