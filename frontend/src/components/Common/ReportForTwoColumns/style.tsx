import { styled } from '@mui/material/styles'
import { TableCell, TableRow } from '@mui/material'
import { MetricSelectionWrapper } from '@src/components/Metrics/MetricsStep/style'
import { tableCellClasses } from '@mui/material/TableCell'
import { theme } from '@src/theme'

export const Container = styled(MetricSelectionWrapper)({})

export const Row = styled(TableRow)({})
export const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.table.backgroundColor,
    fontWeight: 600,
  },
}))

export const BorderTableCell = styled(TableCell)(() => ({
  border: '1px solid rgba(224, 224, 224, 1)',
  borderRight: 'none',
  color: theme.palette.table.text,
}))

export const ColumnTableCell = styled(TableCell)(() => ({
  color: theme.palette.table.text,
}))
