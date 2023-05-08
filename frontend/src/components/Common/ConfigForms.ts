import { styled } from '@mui/material/styles'
import { FormControl, TextField } from '@mui/material'
import { theme } from '@src/theme'

export const StyledSection = styled('div')({
  position: 'relative',
  boxShadow: theme.main.boxShadow,
  borderRadius: '0.25rem',
  margin: '1rem 0',
  padding: '1rem 0',
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
  marginTop: '-0.4rem',
  [theme.breakpoints.down('md')]: {
    width: '90%',
    padding: '0.5rem 0 1rem 0',
  },
})

export const StyledTextField = styled(TextField)({
  width: '45%',
  marginLeft: '2.5%',
  [theme.breakpoints.down('md')]: {
    width: '90%',
  },
})

export const StyledButtonGroup = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '1rem',
  gap: '1rem',
})
