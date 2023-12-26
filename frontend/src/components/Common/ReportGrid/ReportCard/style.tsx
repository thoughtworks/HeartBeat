import { theme } from '@src/theme'
import styled from '@emotion/styled'
import { Typography } from '@mui/material'

export const StyledReportCard = styled.div({
  position: 'relative',
  padding: '0.8rem 1.5rem 0.8rem 1.5rem',
  height: '6.5rem',
  borderRadius: '1rem',
  border: theme.main.cardBorder,
  background: theme.main.color,
  boxShadow: theme.main.cardShadow,
})

export const StyledItemSection = styled.div({
  display: 'flex',
  alignItems: 'center',
  minWidth: '25 %',
})

export const StyledReportCardTitle = styled(Typography)({
  fontFamily: 'Roboto',
  fontWeight: 500,
  fontSize: '1rem',
})
