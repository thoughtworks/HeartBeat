import { DatePicker } from '@mui/x-date-pickers';
import { styled } from '@mui/material/styles';
import { theme } from '@src/theme';
export const StyledDateRangePickerContainer = styled('div')({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  gap: '1.5rem',
  marginTop: '1rem',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
});

export const StyledDateRangePicker = styled(DatePicker)({
  width: '50%',
  button: {
    margin: '0.75rem',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
});
