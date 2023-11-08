import { styled } from '@mui/material/styles'
import { TableCell, TableRow } from '@mui/material'
import { MetricSelectionWrapper } from '@src/components/Metrics/MetricsStep/style'
import { tableCellClasses } from '@mui/material/TableCell'
import { theme } from '@src/theme'

export const Container = styled(MetricSelectionWrapper)({})

export const Row = styled(TableRow)({})
export const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.secondary.dark,
    fontWeight: 600,
  },
}))

export const BorderTableCell = styled(TableCell)(() => ({
  border: '0.06rem solid #E0E0E0',
  borderRight: 'none',
  color: theme.palette.secondary.contrastText,
}))

export const ColumnTableCell = styled(BorderTableCell)(() => ({
  borderLeft: 'none',
}))
