import styled from '@emotion/styled'
import { theme } from '@src/theme'

export const StyledReportCard = styled.div({
  height: '11.75rem',
  borderRadius: '0.75rem',
  border: theme.main.cardBorder,
  background: theme.main.color,
  boxShadow: theme.main.cardShadow,
})

export const StyledReportCardTitle = styled.div({
  padding: '1.5rem 1.5rem',
})
