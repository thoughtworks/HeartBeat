import React from 'react'
import { Dialog } from '@mui/material'
import {
  CancelButton,
  ConformationDialog,
  DialogButtonGroup,
  YesButton,
} from '@src/components/Metrics/MetricsStepper/ConfirmDialog/style'
export const ConfirmDialog = () => {
  return (
    <Dialog open={true}>
      <ConformationDialog>All the filled data will be cleared. Continue to Home page?</ConformationDialog>
      <DialogButtonGroup>
        <YesButton>Yes</YesButton>
        <CancelButton>Cancel</CancelButton>
      </DialogButtonGroup>
    </Dialog>
  )
}
