import MetricsSettingTitle from '@src/components/Common/MetricsSettingTitle'
import { TableBody, TableCell, TableHead, TableRow, Table } from '@mui/material'
import { Container, Row } from '@src/components/Metrics/ReportStep/Velocity/style'
import { VelocityRes } from '@src/types/reportRes'
import { VelocityMetric } from '@src/constants'

interface VelocityProps {
  title: string
  velocityData: VelocityRes
}
interface VelocityMetricRow {
  name: VelocityMetric
  value: string
}

export const Velocity = ({ title, velocityData }: VelocityProps) => {
  const velocityValues = {
    [VelocityMetric.VELOCITY_SP]: velocityData.velocityForSP,
    [VelocityMetric.THROUGHPUT_CARDS_COUNT]: velocityData.velocityForCards,
  }
  const velocityRows: VelocityMetricRow[] = Object.entries(velocityValues).map(([name, value]) => ({
    name: name as VelocityMetric,
    value,
  }))

  return (
    <>
      <MetricsSettingTitle title={title} />
      <Container>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='left'>Name</TableCell>
              <TableCell align='center'>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {velocityRows.map(({ name, value }) => (
              <Row key={name}>
                <TableCell align='left'>{name}</TableCell>
                <TableCell align='center'>{value}</TableCell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </Container>
    </>
  )
}
