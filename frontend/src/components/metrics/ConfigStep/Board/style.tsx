import { styled } from '@mui/material/styles'
import { Button, FormControl, TextField } from '@mui/material'

export const BoardSection = styled('div')({
  boxShadow: '0 2px 1px -1px rgb(0 0 0 / 20%), 0 1px 1px 0 rgb(0 0 0 / 14%), 0 1px 3px 0 rgb(0 0 0 / 12%);',
  borderRadius: '1rem',
  width: '85%',
  margin: '1rem 0',
  padding: '1rem',
  fontSize: '1rem',
  lineHeight: '2rem',
})

export const BoardTitle = styled('h2')({
  margin: '0 1rem',
  fontSize: '1.5rem',
})
export const BoardForm = styled('form')({
  margin: '1rem',
})

export const BoardTypeSelections = styled(FormControl)({
  width: '20rem',
  margin: '0 4rem 1rem 0',
})

export const BoardTextField = styled(TextField)({
  width: '20rem',
  margin: '0 4rem 1rem 0',
  padding: '0.5rem 0',
})

export const BoardButtonGroup = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '1rem',
})

export const VerifyButton = styled(Button)({
  width: '3rem',
  color: '#3f51b5',
})
