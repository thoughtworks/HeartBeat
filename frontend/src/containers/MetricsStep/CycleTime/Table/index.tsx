import {
  updateCycleTimeSettings,
  saveDoneColumn,
  selectMetricsContent,
  setCycleTimeSettingsType,
  updateReworkTimesSettings,
  updateTreatFlagCardAsBlock,
  ICycleTimeSetting,
} from '@src/context/Metrics/metricsSlice';
import {
  CYCLE_TIME_SETTINGS_TYPES,
  DONE,
  METRICS_CONSTANTS,
  METRICS_CYCLE_SETTING_TABLE_HEADER_BY_COLUMN,
  METRICS_CYCLE_SETTING_TABLE_HEADER_BY_STATUS,
} from '@src/constants/resources';
import {
  StyledRadioGroup,
  StyledTableHeaderCell,
  StyledTableRowCell,
} from '@src/containers/MetricsStep/CycleTime/Table/style';
import { FormControlLabel, Radio, Table, TableBody, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import CellAutoComplete from '@src/containers/MetricsStep/CycleTime/Table/CellAutoComplete';
import EllipsisText from '@src/components/Common/EllipsisText';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { existBlockState } from '@src/utils/util';
import { useAppSelector } from '@src/hooks';
import React, { useCallback } from 'react';
import { theme } from '@src/theme';

const CycleTimeTable = () => {
  const dispatch = useAppDispatch();
  const { cycleTimeSettings, cycleTimeSettingsType } = useAppSelector(selectMetricsContent);
  const isColumnAsKey = cycleTimeSettingsType === CYCLE_TIME_SETTINGS_TYPES.BY_COLUMN;

  const resetRealDoneColumn = useCallback(
    (name: string, value: string) => {
      if (value === DONE) {
        dispatch(saveDoneColumn([]));
      }

      const optionNamesWithDone = cycleTimeSettings.filter(({ value }) => value === DONE).map(({ column }) => column);

      if (optionNamesWithDone.includes(name)) {
        dispatch(saveDoneColumn([]));
      }
    },
    [cycleTimeSettings, dispatch],
  );

  const updateTreatFlagCardAsBlockByCycleTimeSetting = useCallback(
    (newCycleTimeSettings: ICycleTimeSetting[], preHasBlockState: boolean) => {
      if (!existBlockState(newCycleTimeSettings) && preHasBlockState) {
        dispatch(updateTreatFlagCardAsBlock(true));
      }
    },
    [dispatch],
  );

  const saveCycleTimeOptions = useCallback(
    (name: string, value: string) => {
      const preHasBlockState = existBlockState(cycleTimeSettings);
      const newCycleTimeSettings = cycleTimeSettings.map((item) =>
        (isColumnAsKey ? item.column === name : item.status === name)
          ? {
              ...item,
              value,
            }
          : item,
      );
      isColumnAsKey && resetRealDoneColumn(name, value);
      updateTreatFlagCardAsBlockByCycleTimeSetting(newCycleTimeSettings, preHasBlockState);
      dispatch(updateCycleTimeSettings(newCycleTimeSettings));
      dispatch(updateReworkTimesSettings({ excludeStates: [], reworkState: null }));
    },
    [updateTreatFlagCardAsBlockByCycleTimeSetting, cycleTimeSettings, dispatch, isColumnAsKey, resetRealDoneColumn],
  );

  const header = isColumnAsKey
    ? METRICS_CYCLE_SETTING_TABLE_HEADER_BY_COLUMN
    : METRICS_CYCLE_SETTING_TABLE_HEADER_BY_STATUS;

  const data = isColumnAsKey
    ? [...new Set(cycleTimeSettings.map(({ column }) => column))].map((uniqueColumn) => {
        const statuses = cycleTimeSettings
          .filter(({ column }) => column === uniqueColumn)
          .map(({ status }) => status)
          .join(', ');
        const value =
          cycleTimeSettings.find(({ column }) => column === uniqueColumn)?.value || METRICS_CONSTANTS.cycleTimeEmptyStr;
        return [uniqueColumn, statuses, value];
      })
    : cycleTimeSettings.map(({ status, column, value }) => [status, column, value]);

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCycleTimeSettingsType(event.target.value));
    dispatch(
      updateCycleTimeSettings(
        cycleTimeSettings.map((item) => ({
          ...item,
          value: METRICS_CONSTANTS.cycleTimeEmptyStr,
        })),
      ),
    );
    dispatch(saveDoneColumn([]));
    if (!existBlockState(cycleTimeSettings)) {
      dispatch(updateTreatFlagCardAsBlock(true));
    }
  };

  return (
    <>
      <StyledRadioGroup aria-label='cycleTimeSettingsType' value={cycleTimeSettingsType} onChange={handleTypeChange}>
        <FormControlLabel value={CYCLE_TIME_SETTINGS_TYPES.BY_COLUMN} control={<Radio />} label='By Column' />
        <FormControlLabel value={CYCLE_TIME_SETTINGS_TYPES.BY_STATUS} control={<Radio />} label='By Status' />
      </StyledRadioGroup>
      <TableContainer sx={{ mb: '2rem' }}>
        <Table aria-label='cycle time settings table'>
          <TableHead>
            <TableRow>
              {header.map(({ emphasis, text }, index) => (
                <StyledTableHeaderCell length={header.length} key={index}>
                  {emphasis ? (
                    <>
                      <span>{text}</span>
                      <span style={{ color: theme.components?.errorMessage.color }}> *</span>
                    </>
                  ) : (
                    text
                  )}
                </StyledTableHeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(([boardKey, boardSupplement, state], index) => (
              <TableRow hover key={index}>
                <StyledTableRowCell>{boardKey.toUpperCase()}</StyledTableRowCell>
                <StyledTableRowCell>
                  <Tooltip title={boardSupplement} arrow>
                    <EllipsisText fitContent>{boardSupplement.toUpperCase()}</EllipsisText>
                  </Tooltip>
                </StyledTableRowCell>
                <StyledTableRowCell>
                  <CellAutoComplete name={boardKey} defaultSelected={state} onSelect={saveCycleTimeOptions} />
                </StyledTableRowCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CycleTimeTable;
