import { styled } from '@mui/material/styles'
import { FormControl } from '@mui/material'

export const BoardSection = styled('div')({
  boxShadow: '0 2px 1px -1px rgb(0 0 0 / 20%), 0 1px 1px 0 rgb(0 0 0 / 14%), 0 1px 3px 0 rgb(0 0 0 / 12%);',
  padding: '16px',
  borderRadius: '4px',
})
export const BoardTypeSelections = styled(FormControl)({
  minWidth: '15rem',
  maxWidth: '20rem',
  paddingBottom: '1rem',
})
