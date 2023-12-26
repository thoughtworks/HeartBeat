import styled from '@emotion/styled'
import { TextField, Typography } from '@mui/material'
import { theme } from '@src/theme'

export const StyledItem = styled.div({
  display: 'flex',
  alignItems: 'center',
})

export const StyledContent = styled('div')({
  width: '100%',
  display: 'flex',
  alignItems: 'end',
  justifyContent: 'space-between',
})

export const StyledWrapper = styled('div')({
  width: '100%',
})

export const StyledValue = styled(Typography)({
  width: '100%',
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
  [theme.breakpoints.down('lg')]: {
    marginRight: '1.5rem',
  },
})

export const StyledValueSection = styled.div({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const StyledExtraValue = styled.div({
  width: '100%',
  fontSize: '1rem',
  fontWeight: 400,
  paddingTop: '1rem',
  whiteSpace: 'nowrap',
})
