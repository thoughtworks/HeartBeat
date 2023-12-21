import { styled } from '@mui/material/styles'
import { Z_INDEX } from '@src/constants/commons'
import { Button, Typography } from '@mui/material'
import { theme } from '@src/theme'
import { basicButtonStyle } from '@src/components/Metrics/ReportStep/ReportDetail/style'

export const StyledErrorNotification = styled('div')({
  zIndex: Z_INDEX.MODAL_BACKDROP,
})

export const StyledMetricsSection = styled('div')({
  marginTop: '3rem',
})

export const StyledSpacing = styled('div')({
  height: '1.5rem',
})

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
})
