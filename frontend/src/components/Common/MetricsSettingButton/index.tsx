import {
  MetricsSettingAddButtonContainer,
  MetricsSettingAddButtonItem,
} from '@src/components/Common/MetricsSettingButton/style';
import { Add } from '@mui/icons-material';
import React from 'react';

interface metricsSettingAddButtonProps {
  onAddPipeline: () => void;
}

export const MetricsSettingAddButton = ({ onAddPipeline }: metricsSettingAddButtonProps) => {
  return (
    <MetricsSettingAddButtonContainer>
      <MetricsSettingAddButtonItem startIcon={<Add />} onClick={onAddPipeline}>
        New Pipeline
      </MetricsSettingAddButtonItem>
    </MetricsSettingAddButtonContainer>
  );
};
