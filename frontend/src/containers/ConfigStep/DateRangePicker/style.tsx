import { BasicButton } from '@src/components/Common/Buttons';
import { DatePicker } from '@mui/x-date-pickers';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { theme } from '@src/theme';

export const DateRangePickerGroupContainer = styled('div')({
  border: `${theme.main.cardBorder}`,
  borderRadius: '0.25rem',
  padding: '1rem 1.5rem 1.5rem 1.5rem',
});

export const TitleContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

export const StyledFeaturedRangePickerContainer = styled('div')({
  '&:first-of-type>.range-picker-row': {
    marginTop: '1rem',
  },
});

export const StyledDateRangePickerContainer = styled('div')({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  gap: '1.5rem',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
  position: 'relative',
  paddingBottom: '2.5rem',
});

export const StyledDateRangePicker = styled(DatePicker)({
  width: '50%',
  button: {
    margin: '0.75rem',
  },
  marginTop: '-0.4rem',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
});

export const AddButton = styled(Button)({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  borderRadius: '0.25rem',
  border: `0.07rem dashed ${theme.main.alert.info.iconColor}`,
  marginTop: '1.5rem',
});

export const RemoveButton = styled(BasicButton)({
  fontFamily: theme.main.font.secondary,
  position: 'absolute',
  right: 0,
  top: '3rem',
});
