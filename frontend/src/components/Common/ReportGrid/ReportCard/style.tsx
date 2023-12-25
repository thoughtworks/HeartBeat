import { theme } from '@src/theme'
import styled from '@emotion/styled'
import { Typography } from '@mui/material'

export const StyledReportCard = styled.div`
  position: relative;
  padding: 0.8rem 1.5rem 0.8rem 1.5rem;
  height: 7rem;
  border-radius: 1rem;
  border: ${theme.main.cardBorder};
  background: ${theme.main.color};
  box-shadow: ${theme.main.cardShadow};
`

export const StyledItemSection = styled.div`
  display: flex;
  align-items: center;
  min-width: 25%;
`

export const StyledReportCardTitle = styled(Typography)`
  font-weight: 500;
  font-size: 1rem;
`
