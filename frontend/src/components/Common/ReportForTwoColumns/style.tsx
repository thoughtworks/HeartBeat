import { styled } from '@mui/material/styles'
import { TableContainer, TableRow } from '@mui/material'
import { theme } from '@src/theme'

export const Container = styled(TableContainer)({
  boxShadow: theme.main.boxShadow,
  borderRadius: '0.25rem',
  padding: '1rem 0',
})

export const Row = styled(TableRow)({
  '&:last-child td, &:last-child th': {
    border: '0',
  },
})
