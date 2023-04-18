import { IconButton } from '@mui/material'
import { Add } from '@mui/icons-material'
import { MetricsSettingButtonContainer } from '@src/components/Common/MetricsSettingTitle'
import React from 'react'

interface metricsSettingAddButtonProps {
  handleClickAddButton: () => void
}

export const MetricsSettingAddButton = ({ handleClickAddButton }: metricsSettingAddButtonProps) => {
  return (
    <MetricsSettingButtonContainer>
      <IconButton onClick={handleClickAddButton}>
        <Add />
      </IconButton>
    </MetricsSettingButtonContainer>
  )
}
