import styled from '@emotion/styled'
import { TextField, Typography } from '@mui/material'
import '@fontsource/roboto'
import { theme } from '@src/theme'

export const StyledItem = styled.div({
  display: 'flex',
  alignItems: 'center',
})

export const StyledValueWrapper = styled('div')({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const StyledUnit = styled('div')({
  fontFamily: 'Roboto',
  fontSize: '1.1rem',
  fontStyle: 'normal',
  opacity: '0.65',
  marginTop: '2rem',
  wordWrap: 'break-word',
})

export const StyledValue = styled(Typography)({
  width: '100%',
  fontFamily: 'Roboto',
  fontSize: '2.5rem',
  fontStyle: 'normal',
  fontWeight: 500,
  wordWrap: 'break-word',
})

export const StyledSubtitle = styled(TextField)({
  width: '100%',
  '& .MuiInputBase-input': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontFamily: 'Roboto',
    fontSize: '0.8rem',
    fontStyle: 'normal',
  },
  '& .MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: theme.main.secondColor,
    opacity: 0.65,
  },
})

export const StyledDividingLine = styled.img({
  marginRight: '2.25rem',
})
