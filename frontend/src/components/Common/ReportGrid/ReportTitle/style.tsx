import { styled } from '@mui/material/styles'
import { theme } from '@src/theme'
import { Typography } from '@mui/material'

export const StyledMetricsTitleSection = styled('div')({
  display: 'flex',
})

export const StyledMetricsSign = styled('canvas')({
  margin: '0.2rem 0.5rem 0 0.5rem',
  height: '1rem',
  width: '0.3rem',
  background: theme.main.backgroundColor,
})

export const StyledMetricsTitle = styled(Typography)({
  fontWeight: 600,
  fontSize: '1rem',
  fontFamily: theme.main.font.secondary,
  textAlign: 'start',
  marginBottom: '1rem',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})
