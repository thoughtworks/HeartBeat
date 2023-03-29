import MetricsSettingTitle from '@src/components/Common/MetricsSettingTitle'
import { TableBody, TableCell, TableHead, TableRow, Table } from '@mui/material'
import { Container, Row } from '@src/components/Metrics/ExportStep/Velocity/style'
import { VelocityInterface } from '@src/types/reportResponse'

interface VelocityProps {
  title: string
  velocityData: VelocityInterface
}

export const Velocity = ({ title, velocityData }: VelocityProps) => {
  const velocities = Object.entries(velocityData).map(([name, value]) => ({
    name,
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
            {velocities.map(({ name, value }) => (
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
