import styled from '@emotion/styled'
import { ArrowForward, CalendarToday } from '@mui/icons-material'

export const DateRangeContainer = styled.div({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  backgroundColor: '#f3f3f3',
  borderRadius: '0.4rem',
  border: '0.07rem solid #d8d8d8',
  width: 'fit-content',
  padding: '.6rem',
  color: '#7c7c7c',
})

export const StyledArrowForward = styled(ArrowForward)({
  color: '#7c7c7c',
  margin: '0 .25rem',
  fontSize: '1rem',
})

export const StyledCalendarToday = styled(CalendarToday)({
  color: '#7c7c7c',
  marginLeft: '.25rem',
  fontSize: '1rem',
})
