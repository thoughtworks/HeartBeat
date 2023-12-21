import { theme } from '@src/theme'
import styled from '@emotion/styled'
import { Typography } from '@mui/material'
import '@fontsource/roboto'

export const StyledReportCard = styled.div({
  padding: '1.5rem',
  height: '11.75rem',
  borderRadius: '1rem',
  border: theme.main.cardBorder,
  background: theme.main.color,
  boxShadow: theme.main.cardShadow,
})

export const StyledItemSection = styled.div({
  display: 'flex',
  alignItems: 'center',
  minWidth: '25%',
})

export const StyledReportCardTitle = styled(Typography)({
  fontFamily: 'Roboto',
  fontWeight: 500,
  fontSize: '1.2rem',
})

export const StyledReportCardProgress = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  background: 'red',
})
