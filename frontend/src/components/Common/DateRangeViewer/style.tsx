import { ArrowForward, CalendarToday } from '@mui/icons-material';
import styled from '@emotion/styled';
import { theme } from '@src/theme';

export const DateRangeContainer = styled.div({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  backgroundColor: theme.palette.secondary.dark,
  borderRadius: '0.5rem',
  border: '0.07rem solid',
  borderColor: theme.palette.grey[400],
  width: 'fit-content',
  padding: '.75rem',
  color: theme.palette.text.disabled,
  fontSize: '.875rem',
});

export const StyledArrowForward = styled(ArrowForward)({
  color: theme.palette.text.disabled,
  margin: '0 .5rem',
  fontSize: '.875rem',
});

export const StyledCalendarToday = styled(CalendarToday)({
  color: theme.palette.text.disabled,
  marginLeft: '1rem',
  fontSize: '.875rem',
});
