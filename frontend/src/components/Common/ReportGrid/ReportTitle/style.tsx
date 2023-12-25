import { styled } from '@mui/material/styles'
import { theme } from '@src/theme'
import { Typography } from '@mui/material'

export const StyledMetricsTitleSection = styled('div')`
  display: flex;
`

export const StyledMetricsSign = styled('canvas')`
  margin: 0.2rem 0.5rem 0 0.5rem;
  height: 1rem;
  width: 0.3rem;
  background: ${theme.main.backgroundColor};
`

export const StyledMetricsTitle = styled(Typography)`
  font-weight: bold;
  font-size: 1rem;
  text-align: start;
  margin-bottom: 1rem;
  text-overflow: 'ellipsis';
  white-space: nowrap;
`
