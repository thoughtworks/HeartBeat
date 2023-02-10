import { styled } from '@mui/material/styles'
import { FormControl, TextField } from '@mui/material'

export const BoardSection = styled('div')({
  boxShadow: '0 2px 1px -1px rgb(0 0 0 / 20%), 0 1px 1px 0 rgb(0 0 0 / 14%), 0 1px 3px 0 rgb(0 0 0 / 12%);',
  borderRadius: '4px',
  margin: '16px 0',
  padding: '16px',
  fontSize: '14px',
  lineHeight: '20px',
})

export const BoardTitle = styled('h2')({
  margin: '0px 12px',
  fontSize: '20px',
})
export const BoardForm = styled('form')({
  margin: '16px',
})

export const BoardTypeSelections = styled(FormControl)({
  width: '20rem',
  margin: '0px 60px 12px 0px',
})

export const BoardTextField = styled(TextField)({
  width: '20rem',
  margin: '0px 60px 12px 0px',
  padding: '9px 0px',
})
