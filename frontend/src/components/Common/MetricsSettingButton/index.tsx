import { IconButton } from '@mui/material'
import { Add } from '@mui/icons-material'
import { MetricsSettingButtonContainer } from '@src/components/Common/MetricsSettingTitle'
import React from 'react'

interface metricsSettingAddButtonProps {
  onAddPipeline: () => void
}

export const MetricsSettingAddButton = ({ onAddPipeline }: metricsSettingAddButtonProps) => {
  return (
    <MetricsSettingButtonContainer>
      <IconButton onClick={onAddPipeline}>
        <Add />
      </IconButton>
    </MetricsSettingButtonContainer>
  )
}
