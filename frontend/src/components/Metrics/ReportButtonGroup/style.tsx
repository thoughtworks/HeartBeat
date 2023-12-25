import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'
import { theme } from '@src/theme'
import { basicButtonStyle } from '@src/components/Metrics/ReportStep/ReportDetail/style'

export const StyledButtonGroup = styled('div')({
  boxSizing: 'border-box',
  display: 'flex',
  textAlign: 'center',
  margin: '0 auto',
  justifyContent: 'space-between',
  width: '100%',
  paddingTop: '2rem',
})

export const StyledExportButton = styled(Button)({
  ...basicButtonStyle,
  width: '12rem',
  backgroundColor: theme.main.backgroundColor,
  color: theme.main.color,
  '&:hover': {
    ...basicButtonStyle,
    backgroundColor: theme.main.backgroundColor,
    color: theme.main.color,
  },
  '&:disabled': {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    color: 'rgba(0,0,0,0.35)',
  },
})
