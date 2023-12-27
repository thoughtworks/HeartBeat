import { styled } from '@mui/material/styles'
import TableCell from '@mui/material/TableCell'
import TextField from '@mui/material/TextField'
import { theme } from '@src/theme'
import { TABLE_ROW_HEIGHT } from '@src/constants/commons'
import { ellipsisProps } from '@src/layouts/style'

export const StyledTableHeaderCell = styled(TableCell)({
  padding: 0,
  height: `${TABLE_ROW_HEIGHT}px`,
  color: `${theme.palette.text.primary}`,
  fontSize: '14px',
  fontWeight: 500,
  backgroundColor: `${theme.palette.secondary.dark}`,
  maxWidth: 0,
  paddingLeft: '1rem',
  paddingRight: '1rem',
  '&:last-child': {
    paddingLeft: '1.5rem',
  },
  borderBottom: 0,
  ...ellipsisProps,
})

export const StyledTableRowCell = styled(TableCell)({
  padding: 0,
  height: `${TABLE_ROW_HEIGHT}px`,
  color: `${theme.palette.text.secondary}`,
  fontSize: '14px',
  fontWeight: 400,
  maxWidth: 0,
  paddingLeft: '1rem',
  paddingRight: '1rem',
  borderBottom: `1px solid ${theme.palette.secondary.dark}`,
  ...ellipsisProps,
})

export const StyledTextField = styled(TextField)({
  borderBottom: 0,
  '& .MuiInput-root': {
    padding: 0,
  },
  '& .MuiOutlinedInput-root': {
    padding: 0,
  },
  '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
    padding: 0,
    height: '2rem',
    borderColor: 'transparent',
    textIndent: '0.5rem',
    fontSize: '14px',
  },
  '& .MuiInput-root .MuiInput-input': {
    padding: 0,
    height: '1.25rem',
    lineHeight: '1.25rem',
  },
  '& .MuiInput-root:before': {
    border: 0,
  },
  '& .MuiInput-root:after': {
    border: 0,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
  },
})
