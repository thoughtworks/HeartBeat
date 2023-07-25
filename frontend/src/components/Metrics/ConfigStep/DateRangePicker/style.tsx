import { styled } from '@mui/material/styles'
import { theme } from '@src/theme'

export const StyledDateRangePicker = styled('div')({
  display: 'flex',
  justifyContent: 'space-around',
  padding: '1rem',
  gap: '1rem',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
})
