import { styled } from '@mui/material/styles'
import { FormControl, TextField } from '@mui/material'
import { theme } from '@src/theme'

export const StyledSection = styled('div')({
  position: 'relative',
  boxShadow:
    '0 0.125rem 0.0625rem -0.0625rem rgb(0 0 0 / 20%), 0 0.125rem 0.25rem 0 rgb(0 0 0 / 14%), 0 0.0625rem 0.1875px 0 rgb(0 0 0 / 12%);',
  borderRadius: '0.25rem',
  width: '85%',
  margin: '1rem 0',
  padding: '1rem',
  fontSize: '1rem',
  lineHeight: '2rem',
})

export const StyledTitle = styled('h2')({
  margin: '0 1rem',
  fontSize: '1.5rem',
})
export const StyledForm = styled('form')({
  marginTop: '1rem',
})

export const StyledTypeSelections = styled(FormControl)({
  width: '45%',
  marginLeft: '2.5%',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    padding: '0.5rem 0',
  },
})

export const StyledTextField = styled(TextField)({
  width: '45%',
  marginLeft: '2.5%',
  padding: '0.5rem 0',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
})

export const StyledButtonGroup = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '1rem',
  gap: '1rem',
})
