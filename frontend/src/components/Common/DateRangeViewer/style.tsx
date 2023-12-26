import styled from '@emotion/styled'
import { ArrowForward, CalendarToday } from '@mui/icons-material'
import { theme } from '@src/theme'

export const DateRangeContainer = styled.div({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  backgroundColor: theme.palette.secondary.dark,
  borderRadius: '0.4rem',
  border: '0.07rem solid',
  borderColor: theme.palette.grey[400],
  width: 'fit-content',
  padding: '.6rem',
  color: theme.palette.text.disabled,
})

export const StyledArrowForward = styled(ArrowForward)({
  color: theme.palette.text.disabled,
  margin: '0 .25rem',
  fontSize: '1rem',
})

export const StyledCalendarToday = styled(CalendarToday)({
  color: theme.palette.text.disabled,
  marginLeft: '.25rem',
  fontSize: '1rem',
})
