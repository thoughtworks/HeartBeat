import { ArrowForward, CalendarToday, ExpandMore } from '@mui/icons-material';
import { Z_INDEX } from '@src/constants/commons';
import { Divider } from '@mui/material';
import styled from '@emotion/styled';
import { theme } from '@src/theme';

export const DateRangeContainer = styled('div')(({ color }) => ({
  position: 'relative',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  borderRadius: '0.5rem',
  border: '0.07rem solid',
  borderColor: theme.palette.grey[400],
  width: 'fit-content',
  padding: '.75rem',
  fontSize: '.875rem',
  color: color,
}));

export const DateRangeExpandContainer = styled.div({
  position: 'absolute',
  top: '4rem',
  right: '0',
  width: '14rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.0625rem',
  borderRadius: '0.25rem',
  filter: `drop-shadow(0 0 0.25rem ${theme.palette.grey[400]})`,
  backgroundColor: theme.palette.common.white,
  zIndex: Z_INDEX.POPOVER,
  padding: '0.25rem 0',
  '&:after': {
    position: 'absolute',
    top: '-0.5rem',
    right: '1rem',
    content: "''",
    width: '0',
    height: '0',
    border: '0.5rem solid transparent',
    borderTopColor: theme.palette.common.white,
    borderRightColor: theme.palette.common.white,
    transform: 'rotate(-45deg)',
  },
});

interface SingleDateRangeProps {
  disabled: boolean;
}

export const SingleDateRange = styled('div')(({ disabled }: SingleDateRangeProps) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.text.primary,
  fontSize: '.875rem',
  padding: '0.5rem',
  cursor: 'pointer',

  ...(disabled && {
    color: theme.palette.text.disabled,
    cursor: 'default',
  }),
}));

export const StyledArrowForward = styled(ArrowForward)({
  margin: '0 .5rem',
  fontSize: '0.875rem',
});

export const StyledCalendarToday = styled(CalendarToday)({
  marginLeft: '1rem',
  fontSize: '.875rem',
});

export const StyledDivider = styled(Divider)({
  position: 'absolute',
  right: '3rem',
  top: 0,
  height: '100%',
});

export const StyledExpandMoreIcon = styled(ExpandMore)({
  marginLeft: '1.5rem',
  color: theme.palette.common.black,
  cursor: 'pointer',
});
