import { styled } from '@mui/material/styles'
import { theme } from '@src/theme'
import { Typography } from '@mui/material'

export const StyledMetricsTitleSection = styled('div')({
  display: 'flex',
})

export const StyledMetricsSign = styled('canvas')({
  margin: '0 1rem 1rem 1rem',
  width: '0.4rem',
  background: theme.main.backgroundColor,
})

export const StyledMetricsTitle = styled(Typography)({
  fontFamily: 'Roboto',
  fontWeight: 500,
  fontSize: '1.2rem',
  marginBottom: '1rem',
})
