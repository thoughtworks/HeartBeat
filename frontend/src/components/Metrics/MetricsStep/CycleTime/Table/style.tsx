import { styled } from '@mui/material/styles'
import TableCell from '@mui/material/TableCell'
import TextField from '@mui/material/TextField'
import { theme } from '@src/theme'

export const StyledTableHeaderCell = styled(TableCell)({
  padding: '1rem',
  color: `${theme.palette.text.primary}`,
  fontSize: '1rem',
  fontWeight: 500,
  backgroundColor: `${theme.palette.secondary.dark}`,
})

export const StyledTableRowCell = styled(TableCell)({
  padding: '1rem',
  color: `${theme.palette.text.secondary}`,
  fontSize: '0.875rem',
  fontWeight: 400,
})

export const StyledTextField = styled(TextField)({
  borderBottom: 0,
  '& .MuiInput-root': {
    padding: 0,
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
})
