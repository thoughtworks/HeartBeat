import MetricsSettingTitle from '@src/components/Common/MetricsSettingTitle'
import { TableBody, TableCell, TableHead, TableRow, Table } from '@mui/material'
import { Container, Row } from '@src/components/Metrics/ExportStep/Velocity/style'

interface VelocityProps {
  title: string
  velocityData: { name: string; value: number }[]
}

export const Velocity = ({ title, velocityData }: VelocityProps) => {
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
            {velocityData.map((data) => (
              <Row key={data.name}>
                <TableCell align='left'>{data.name}</TableCell>
                <TableCell align='center'>{data.value}</TableCell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </Container>
    </>
  )
}
