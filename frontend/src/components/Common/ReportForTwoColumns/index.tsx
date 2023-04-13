import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle'
import { Row } from '@src/components/Common/ReportForTwoColumns/style'
import { Container } from '@src/components/Common/ReportForTwoColumns/style'
import { ReportDataWithTwoColumns } from '@src/models/reportUIDataStructure'
import { Fragment } from 'react'

interface ReportForTwoColumnsProps {
  title: string
  data: ReportDataWithTwoColumns[]
}

export const ReportForTwoColumns = ({ title, data }: ReportForTwoColumnsProps) => {
  const renderRows = () => {
    return data.map((row) => (
      <Fragment key={row.id}>
        <Row>
          <TableCell rowSpan={row.value.length}>{row.name}</TableCell>
          <TableCell>{row.value[0]}</TableCell>
        </Row>
        {row.value.slice(1).map((value) => (
          <Row key={row.id}>
            <TableCell>{value}</TableCell>
          </Row>
        ))}
      </Fragment>
    ))
  }

  return (
    <>
      <MetricsSettingTitle title={title} />
      <Container>
        <Table>
          <TableHead>
            <TableRow id={title}>
              <TableCell>Name</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody key={title}>{renderRows()}</TableBody>
        </Table>
      </Container>
    </>
  )
}

export default ReportForTwoColumns
