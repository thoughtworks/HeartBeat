import styled from '@emotion/styled'
import { Typography } from '@mui/material'
import '@fontsource/roboto'

export const StyledItem = styled.div({
  marginTop: '1.5rem',
  display: 'flex',
  alignItems: 'center',
})

export const StyledValue = styled(Typography)({
  fontFamily: 'Roboto',
  fontSize: '4rem',
  fontStyle: 'normal',
  fontWeight: 500,
  wordWrap: 'break-word',
})

export const StyledSubtitle = styled(Typography)({
  fontFamily: 'Roboto',
  fontSize: '1.1rem',
  fontStyle: 'normal',
  opacity: '0.65',
  wordWrap: 'break-word',
})

export const StyledDividingLine = styled.img({
  marginRight: '2.25rem',
})
