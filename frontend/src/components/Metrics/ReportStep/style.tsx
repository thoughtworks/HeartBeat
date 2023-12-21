import { styled } from '@mui/material/styles'
import { Z_INDEX } from '@src/constants/commons'
import { Typography } from '@mui/material'
import { theme } from '@src/theme'

export const StyledErrorNotification = styled('div')({
  zIndex: Z_INDEX.MODAL_BACKDROP,
})

export const StyledMetricsSection = styled('div')({
  marginTop: '3rem',
})

export const StyledMetricsTitle = styled(Typography)({
  fontFamily: 'Roboto',
  fontWeight: 500,
  fontSize: '1.2rem',
  marginBottom: '1rem',
})
export const StyledMetricsSign = styled('canvas')({
  margin: '0 1rem 1rem 1rem',
  background: theme.main.backgroundColor,
  display: 'inline-block',
  width: '0.4rem',
})

export const StyledSpacing = styled('div')({
  height: '1.5rem',
})

export const StyledMetricsTitleSection = styled('div')({
  display: 'flex',
})
