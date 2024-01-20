import { StyleDialogActions, StyleDialogTitle } from '@src/containers/ReportStep/ExpiredDialog/style';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import { Fragment, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import * as React from 'react';

export interface ExpiredDialogInterface {
  isExpired: boolean;
  handleOk: () => void;
}

export const ExpiredDialog = ({ isExpired, handleOk }: ExpiredDialogInterface) => {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setOpen(isExpired);
  }, [isExpired]);

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <StyleDialogTitle id='alert-dialog-title'>
          <ReportGmailerrorredIcon />
          {'The report has been expired, please generate it again'}
        </StyleDialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>Go back to previous page to reload?</DialogContentText>
        </DialogContent>
        <StyleDialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleOk} autoFocus variant='contained'>
            Yes
          </Button>
        </StyleDialogActions>
      </Dialog>
    </Fragment>
  );
};
