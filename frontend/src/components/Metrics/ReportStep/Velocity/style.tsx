import { styled } from '@mui/material/styles'
import { TableContainer, TableRow } from '@mui/material'

export const Container = styled(TableContainer)({
  boxShadow:
    '0 0.125rem 0.0625rem -0.0625rem rgb(0 0 0 / 20%), 0 0.125rem 0.25rem 0 rgb(0 0 0 / 14%), 0 0.0625rem 0.1875px 0 rgb(0 0 0 / 12%);',
  borderRadius: '0.25rem',
})

export const Row = styled(TableRow)({
  '&:last-child td, &:last-child th': {
    border: '0',
  },
})
