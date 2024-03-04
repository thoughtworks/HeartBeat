import {
  BorderTableCell,
  ColumnTableCell,
  Container,
  Row,
  StyledTableCell,
} from '@src/components/Common/ReportForTwoColumns/style';
import { ReportDataWithTwoColumns } from '@src/hooks/reportMapper/reportUIDataStructure';
import { ReportSelectionTitle } from '@src/containers/MetricsStep/style';
import { Table, TableBody, TableHead, TableRow } from '@mui/material';
import React, { Fragment } from 'react';

interface ReportForTwoColumnsProps {
  title: string;
  data: ReportDataWithTwoColumns[];
}

export const ReportForTwoColumns = ({ title, data }: ReportForTwoColumnsProps) => {
  const renderRows = () => {
    return data.map((row) => (
      <Fragment key={row.id}>
        <Row data-testid={'tr'}>
          <ColumnTableCell rowSpan={row.valueList.length}>{row.name}</ColumnTableCell>
          <BorderTableCell>
            {row.valueList[0]?.unit ? `${row.valueList[0].value}${row.valueList[0].unit}` : row.valueList[0].value}
          </BorderTableCell>
        </Row>
        {row.valueList.slice(1).map((data) => (
          <Row data-testid={'tr'} key={row.id}>
            <BorderTableCell>{`${data.value}${data.unit}`}</BorderTableCell>
          </Row>
        ))}
      </Fragment>
    ));
  };

  return (
    <>
      <Container>
        <ReportSelectionTitle>{title}</ReportSelectionTitle>
        <Table data-test-id={title} data-testid={title}>
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
  );
};

export default ReportForTwoColumns;
