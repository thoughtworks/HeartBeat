import {
  saveDoneColumn,
  selectCycleTimeSettings,
  selectMetricsContent,
  selectRealDoneWarningMessage,
} from '@src/context/Metrics/metricsSlice';
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle';
import { WarningNotification } from '@src/components/Common/WarningNotification';
import MultiAutoComplete from '@src/components/Common/MultiAutoComplete';
import { WarningMessage } from '@src/containers/MetricsStep/Crews/style';
import { METRICS_CONSTANTS } from '@src/constants/resources';
import { DEFAULT_HELPER_TEXT } from '@src/constants/commons';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { FormHelperText } from '@mui/material';
import { useAppSelector } from '@src/hooks';
import React, { useState } from 'react';

interface realDoneProps {
  columns: { key: string; value: { name: string; statuses: string[] } }[];
  title: string;
  label: string;
}

export const RealDone = ({ columns, title, label }: realDoneProps) => {
  const dispatch = useAppDispatch();
  const cycleTimeSettings = useAppSelector(selectCycleTimeSettings);
  const savedDoneColumns = useAppSelector(selectMetricsContent).doneColumn;
  const realDoneWarningMessage = useAppSelector(selectRealDoneWarningMessage);
  const doneStatus =
    columns.find((column) => column.key === METRICS_CONSTANTS.doneKeyFromBackend)?.value.statuses ?? [];
  const selectedDoneColumns = cycleTimeSettings.filter(({ value }) => value === METRICS_CONSTANTS.doneValue);
  const filteredStatus = selectedDoneColumns.map(({ status }) => status);
  const status = selectedDoneColumns.length < 1 ? doneStatus : filteredStatus;
  const [selectedDoneStatus, setSelectedDoneStatus] = useState<string[]>([]);
  const isAllSelected = savedDoneColumns.length === status.length;

  const handleRealDoneChange = (event: React.SyntheticEvent, value: string[]) => {
    if (value[value.length - 1] === 'All') {
      setSelectedDoneStatus(selectedDoneStatus.length === status.length ? [] : status);
      dispatch(saveDoneColumn(selectedDoneStatus.length === status.length ? [] : status));
      return;
    }
    setSelectedDoneStatus([...value]);
    dispatch(saveDoneColumn([...value]));
  };

  return (
    <div aria-label='Real done setting section'>
      <MetricsSettingTitle title={title} />
      {realDoneWarningMessage && <WarningNotification message={realDoneWarningMessage} />}
      <MultiAutoComplete
        optionList={status}
        selectedOption={savedDoneColumns}
        textFieldLabel={label}
        isError={!savedDoneColumns.length}
        onChangeHandler={handleRealDoneChange}
        isSelectAll={isAllSelected}
      />
      <FormHelperText>
        {!savedDoneColumns.length ? (
          <WarningMessage>
            Must select which you want to <strong>consider as Done</strong>
          </WarningMessage>
        ) : (
          DEFAULT_HELPER_TEXT
        )}
      </FormHelperText>
    </div>
  );
};
