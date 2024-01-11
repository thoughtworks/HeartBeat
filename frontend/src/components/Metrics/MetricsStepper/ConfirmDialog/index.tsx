import React from 'react';
import { Dialog } from '@mui/material';
import {
  CancelButton,
  ConformationDialog,
  DialogButtonGroup,
  YesButton,
} from '@src/components/Metrics/MetricsStepper/ConfirmDialog/style';

export const ConfirmDialog = (props: { onConfirm: () => void; onClose: () => void; isDialogShowing: boolean }) => {
  const { onConfirm, onClose, isDialogShowing } = props;
  return (
    <Dialog open={isDialogShowing}>
      <ConformationDialog>All the filled data will be cleared. Continue to Home page?</ConformationDialog>
      <DialogButtonGroup>
        <YesButton onClick={onConfirm}>Yes</YesButton>
        <CancelButton onClick={onClose}>Cancel</CancelButton>
      </DialogButtonGroup>
    </Dialog>
  );
};
