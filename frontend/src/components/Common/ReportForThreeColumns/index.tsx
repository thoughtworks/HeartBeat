import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle'
import { Container, Row } from '@src/components/Common/ReportForTwoColumns/style'
import React, { Fragment } from 'react'
import { ReportDataWithThreeColumns } from '@src/hooks/reportMapper/reportUIDataStructure'

interface ReportForThreeColumnsProps {
  title: string
  fieldName: string
  listName: string
  data: ReportDataWithThreeColumns[]
}

export const ReportForThreeColumns = ({ title, fieldName, listName, data }: ReportForThreeColumnsProps) => {
  const renderRows = () => {
    return data.map((row) => (
      <Fragment key={row.id}>
        <TableRow>
          <TableCell rowSpan={row.valuesList.length + 1}>{row.name}</TableCell>
        </TableRow>
        {row.valuesList.map((valuesList) => (
          <Row key={valuesList.name}>
            <TableCell>{valuesList.name}</TableCell>
            <TableCell>{valuesList.value}</TableCell>
          </Row>
        ))}
      </Fragment>
    ))
  }

  return (
    <>
      <MetricsSettingTitle title={title} />
      <Container>
        <Table data-test-id={title}>
          <TableHead>
            <TableRow>
              <TableCell>{fieldName}</TableCell>
              <TableCell>{listName}</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderRows()}</TableBody>
        </Table>
      </Container>
    </>
  )
}

export default ReportForThreeColumns
