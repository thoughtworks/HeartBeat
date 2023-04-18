import { IconButton } from '@mui/material'
import { Add } from '@mui/icons-material'
import { MetricsSettingButtonContainer } from '@src/components/Common/MetricsSettingTitle'
import React from 'react'

interface metricsSettingAddButtonProps {
  handleClick: () => void
}

export const MetricsSettingAddButton = ({ handleClick }: metricsSettingAddButtonProps) => {
  return (
    <MetricsSettingButtonContainer>
      <IconButton onClick={handleClick}>
        <Add />
      </IconButton>
    </MetricsSettingButtonContainer>
  )
}
