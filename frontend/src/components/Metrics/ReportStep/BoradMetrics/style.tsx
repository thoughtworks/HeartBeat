import { styled } from '@mui/material/styles'
import { theme } from '@src/theme'
import { Link } from 'react-router-dom'

export const StyledMetricsSection = styled('div')({
  marginTop: '2rem',
})

export const StyledTitleWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1rem',
})

export const StyledShowMore = styled(Link)({
  marginLeft: '0.5rem',
  fontSize: '0.8rem',
  textDecoration: 'none',
  color: theme.palette.link,
})
