import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'
import { theme } from '@src/theme'
import { basicButtonStyle } from '@src/components/Metrics/ReportStep/style'

export const StyledRightButtonGroup = styled('div')({
  [theme.breakpoints.down('lg')]: {
    width: '85%',
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center',
  },
})

export const StyledButtonGroup = styled('div')({
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  margin: '0 auto',
  justifyContent: 'space-between',
  width: '100%',
  paddingTop: '2rem',
})

export const StyledExportButton = styled(Button)({
  ...basicButtonStyle,
  width: '12rem',
  whiteSpace: 'nowrap',
  backgroundColor: theme.main.backgroundColor,
  color: theme.main.color,
  '&:hover': {
    ...basicButtonStyle,
    backgroundColor: theme.main.backgroundColor,
    color: theme.main.color,
    [theme.breakpoints.down('lg')]: {
      fontSize: '0.8rem',
    },
  },
  '&:disabled': {
    backgroundColor: theme.main.button.disabled.backgroundColor,
    color: theme.main.button.disabled.color,
  },
  [theme.breakpoints.down('lg')]: {
    fontSize: '0.8rem',
  },
})
