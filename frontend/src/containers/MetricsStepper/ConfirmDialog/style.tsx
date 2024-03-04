import { styled } from '@mui/material/styles';
import { DialogContent } from '@mui/material';
import Button from '@mui/material/Button';
import { theme } from '@src/theme';

export const ConformationDialog = styled(DialogContent)({
  margin: '1rem 0 0 0',
});

export const DialogButtonGroup = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  margin: '1rem 0',
});

export const YesButton = styled(Button)({
  boxShadow: theme.main.boxShadow,
  padding: '0 1rem',
  margin: '0 1rem',
  color: theme.main.color,
  backgroundColor: theme.main.backgroundColor,
  '&:hover': {
    backgroundColor: theme.main.backgroundColor,
  },
});

export const CancelButton = styled(Button)({
  color: theme.main.secondColor,
});
