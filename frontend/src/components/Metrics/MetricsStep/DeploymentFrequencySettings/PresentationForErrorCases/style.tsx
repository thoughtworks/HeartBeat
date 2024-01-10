import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const StyledContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  padding: '1.5rem 0',
})

export const StyledImageContainer = styled(Box)({
  maxHeight: '6rem',
  height: '6rem',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
})

export const StyledImage = styled('img')({
  display: 'block',
  width: 'auto',
  height: '100%',
  maxHeight: '100%',
})

export const StyledTitle = styled(Box)({
  fontSize: '1.25rem',
  fontWeight: 700,
  marginTop: '0.5rem',
  marginBottom: '1.25rem',
  textAlign: 'center',
})

export const StyledMessage = styled(Box)({
  fontSize: '15px',
  fontWeight: 400,
  paddingBottom: '2rem',
  textAlign: 'center',
})
