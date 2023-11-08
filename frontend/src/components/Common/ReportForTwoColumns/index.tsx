import { Table, TableBody, TableHead, TableRow } from '@mui/material'
import {
  BorderTableCell,
  ColumnTableCell,
  Container,
  Row,
  StyledTableCell,
} from '@src/components/Common/ReportForTwoColumns/style'
import { Fragment } from 'react'
import { ReportDataWithTwoColumns } from '@src/hooks/reportMapper/reportUIDataStructure'
import { ReportSelectionTitle } from '@src/components/Metrics/MetricsStep/style'

interface ReportForTwoColumnsProps {
  title: string
  data: ReportDataWithTwoColumns[]
}

export const ReportForTwoColumns = ({ title, data }: ReportForTwoColumnsProps) => {
  const renderRows = () => {
    return data.map((row) => (
      <Fragment key={row.id}>
        <Row>
          <ColumnTableCell rowSpan={row.valueList.length}>{row.name}</ColumnTableCell>
          <BorderTableCell>
            {row.valueList[0]?.unit ? `${row.valueList[0].value}${row.valueList[0].unit}` : row.valueList[0].value}
          </BorderTableCell>
        </Row>
        {row.valueList.slice(1).map((data) => (
          <Row key={row.id}>
            <BorderTableCell>{`${data.value}${data.unit}`}</BorderTableCell>
          </Row>
        ))}
      </Fragment>
    ))
  }

  return (
    <>
      <Container>
        <ReportSelectionTitle>{title}</ReportSelectionTitle>
        <Table data-test-id={title}>
          <TableHead>
            <TableRow id={title}>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Value</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody key={title}>{renderRows()}</TableBody>
        </Table>
      </Container>
    </>
  )
}

export default ReportForTwoColumns
