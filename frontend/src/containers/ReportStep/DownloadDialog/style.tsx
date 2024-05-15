import { Button, Dialog, DialogContent, DialogTitle, FormControlLabel, FormGroup } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { theme } from '@src/theme';

export const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: '1rem',
  },
});

export const DialogContainer = styled('div')({
  width: '24rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
});

export const StyledDialogTitle = styled(DialogTitle)({
  boxSizing: 'border-box',
  width: '100%',
  padding: '2.5rem 1.375rem 1.5rem 1.375rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '1rem',
});

export const StyledDialogContent = styled(DialogContent)({
  boxSizing: 'border-box',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '1.25rem 1.375rem 1.875rem 1.375rem',
});

export const StyledCalendarToday = styled(CalendarToday)({
  color: theme.palette.text.primary,
  marginRight: '0.75rem',
  fontSize: '1.5rem',
});

export const TimePeriodSelectionMessage = styled('div')({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  fontSize: '1rem',
});

export const StyledFormGroup = styled(FormGroup)({
  margin: '2.25rem 0',
});

export const StyledButton = styled(Button)({
  alignSelf: 'flex-end',
});

export const tooltipModifiers = {
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [190, 0],
      },
    },
  ],
};

export const StyledFormControlLabel = styled(FormControlLabel)(({ checked }) => ({
  width: '21rem',
  height: '2rem',
  borderRadius: '0.75rem',
  border: `0.0625rem solid ${theme.main.boardColor}`,
  margin: '0.375rem 0',

  ...(checked && {
    background: theme.main.downloadListLabel.backgroundColor,
  }),
}));

export const CloseButton = styled(CloseIcon)({
  cursor: 'pointer',
});
