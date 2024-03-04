import { saveUsers, selectMetricsContent, savePipelineCrews } from '@src/context/Metrics/metricsSlice';
import { AssigneeFilter } from '@src/containers/MetricsStep/Crews/AssigneeFilter';
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle';
import MultiAutoComplete from '@src/components/Common/MultiAutoComplete';
import { WarningMessage } from '@src/containers/MetricsStep/Crews/style';
import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { FormHelperText } from '@mui/material';
import { useAppSelector } from '@src/hooks';

interface crewsProps {
  options: string[];
  title: string;
  label: string;
  type?: string;
}

export const Crews = ({ options, title, label, type = 'board' }: crewsProps) => {
  const isBoardCrews = type === 'board';
  const dispatch = useAppDispatch();

  const [isEmptyCrewData, setIsEmptyCrewData] = useState<boolean>(false);
  const { users, pipelineCrews } = useAppSelector(selectMetricsContent);
  const [selectedCrews, setSelectedCrews] = useState<string[]>([]);
  const isAllSelected = options.length > 0 && selectedCrews.length === options.length;

  useMemo(() => {
    setSelectedCrews(isBoardCrews ? users : pipelineCrews);
  }, [users, isBoardCrews, pipelineCrews]);

  useEffect(() => {
    setIsEmptyCrewData(selectedCrews.length === 0);
  }, [selectedCrews]);

  const handleCrewChange = (_: React.SyntheticEvent, value: string[]) => {
    if (value[value.length - 1] === 'All') {
      setSelectedCrews(selectedCrews.length === options.length ? [] : options);
      return;
    }
    setSelectedCrews([...value]);
  };

  useEffect(() => {
    dispatch(isBoardCrews ? saveUsers(selectedCrews) : savePipelineCrews(selectedCrews));
  }, [selectedCrews, dispatch, isBoardCrews]);

  return (
    <>
      <MetricsSettingTitle title={title} />
      <MultiAutoComplete
        ariaLabel='Included Crews multiple select'
        optionList={options}
        isError={isEmptyCrewData && isBoardCrews}
        isSelectAll={isAllSelected}
        onChangeHandler={handleCrewChange}
        selectedOption={selectedCrews}
        textFieldLabel={label}
        isBoardCrews={isBoardCrews}
      />
      {isBoardCrews && <AssigneeFilter />}
      <FormHelperText>
        {isEmptyCrewData && isBoardCrews && (
          <WarningMessage>
            {label} is <strong>required</strong>
          </WarningMessage>
        )}
      </FormHelperText>
    </>
  );
};
