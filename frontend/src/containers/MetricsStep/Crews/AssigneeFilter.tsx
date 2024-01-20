import { selectAssigneeFilter, updateAssigneeFilter } from '@src/context/Metrics/metricsSlice';
import { AssigneeFilterContainer } from '@src/containers/MetricsStep/Crews/style';
import { FormControlLabel, RadioGroup, Radio } from '@mui/material';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { useAppSelector } from '@src/hooks';
import React from 'react';

export const AssigneeFilter = () => {
  const dispatch = useAppDispatch();
  const assigneeFilter = useAppSelector(selectAssigneeFilter);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateAssigneeFilter(event.target.value));
  };

  return (
    <AssigneeFilterContainer>
      <RadioGroup
        aria-label='assigneeFilter'
        name='assigneeFilter'
        value={assigneeFilter}
        onChange={handleChange}
        style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
      >
        <FormControlLabel value='lastAssignee' control={<Radio />} label='Last assignee' />
        <FormControlLabel value='historicalAssignee' control={<Radio />} label='Historical assignee' />
      </RadioGroup>
    </AssigneeFilterContainer>
  );
};
