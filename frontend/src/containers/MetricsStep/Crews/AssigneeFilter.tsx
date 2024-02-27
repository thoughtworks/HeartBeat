import {
  selectAssigneeFilter,
  updateAssigneeFilter,
  updateMetricsBoardDirtyStatus,
} from '@src/context/Metrics/metricsSlice';
import { StyledRadioGroup } from '@src/containers/MetricsStep/Crews/style';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { FormControlLabel, Radio } from '@mui/material';
import { useAppSelector } from '@src/hooks';
import React from 'react';

export const AssigneeFilter = () => {
  const dispatch = useAppDispatch();
  const assigneeFilter = useAppSelector(selectAssigneeFilter);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateAssigneeFilter(event.target.value));
    dispatch(updateMetricsBoardDirtyStatus(true));
  };

  return (
    <StyledRadioGroup aria-label='assigneeFilter' name='assigneeFilter' value={assigneeFilter} onChange={handleChange}>
      <FormControlLabel value='lastAssignee' control={<Radio />} label='Last assignee' />
      <FormControlLabel value='historicalAssignee' control={<Radio />} label='Historical assignee' />
    </StyledRadioGroup>
  );
};
