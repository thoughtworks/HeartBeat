import { styled } from '@mui/material/styles'
import { TableRow } from '@mui/material'
import { MetricSelectionWrapper } from '@src/components/Metrics/MetricsStep/style'

export const Container = styled(MetricSelectionWrapper)({})

export const Row = styled(TableRow)({
  '&:last-child td, &:last-child th': {
    border: '0',
  },
})
