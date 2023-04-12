import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { Container, Row } from '@src/components/Metrics/ReportStep/Velocity/style'
import { ReportDataWithTwoColumns } from '@src/models/reportUIDataStructure'

interface VelocityProps {
  title: string
  velocityData: ReportDataWithTwoColumns[]
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
            {velocityData.map(({ id, name, value }) => (
              <Row key={id}>
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
