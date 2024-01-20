import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { theme } from '@src/theme';

export const StyledTableHeaderCell = styled(TableCell)({
  padding: 0,
  height: `3rem`,
  color: `${theme.palette.text.primary}`,
  fontWeight: 600,
  backgroundColor: `${theme.palette.secondary.dark}`,
  maxWidth: 0,
  paddingLeft: '1rem',
  paddingRight: '1rem',
  '&:last-child': {
    paddingLeft: '1.5rem',
  },
  borderBottom: 0,
});

export const StyledTableRowCell = styled(TableCell)({
  padding: 0,
  height: `3rem`,
  color: `${theme.palette.text.secondary}`,
  fontWeight: 400,
  maxWidth: 0,
  paddingLeft: '1rem',
  paddingRight: '1rem',
  borderBottom: `0.1rem solid ${theme.palette.secondary.dark}`,
});

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
    fontSize: '0.875rem',
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
});
