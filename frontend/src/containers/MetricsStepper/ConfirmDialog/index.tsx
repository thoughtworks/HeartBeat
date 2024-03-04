import {
  CancelButton,
  ConformationDialog,
  DialogButtonGroup,
  YesButton,
} from '@src/containers/MetricsStepper/ConfirmDialog/style';
import { Dialog } from '@mui/material';
import React from 'react';

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
