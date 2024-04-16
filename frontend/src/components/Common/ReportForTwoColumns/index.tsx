import {
  BorderTableCell,
  ColumnTableCell,
  Container,
  Row,
  StyledTableCell,
} from '@src/components/Common/ReportForTwoColumns/style';
import { ReportDataWithTwoColumns } from '@src/hooks/reportMapper/reportUIDataStructure';
import { EmojiWrap, StyledAvatar, StyledTypography } from '@src/constants/emojis/style';
import { getEmojiUrls, removeExtraEmojiName } from '@src/constants/emojis/emoji';
import { METRICS_TITLE, REPORT_SUFFIX_UNITS } from '@src/constants/resources';
import { ReportSelectionTitle } from '@src/containers/MetricsStep/style';
import { Table, TableBody, TableHead, TableRow } from '@mui/material';
import React, { Fragment } from 'react';

interface ReportForTwoColumnsProps {
  title: string;
  data: ReportDataWithTwoColumns[];
}

export const ReportForTwoColumns = ({ title, data }: ReportForTwoColumnsProps) => {
  const transformEmoji = (row: ReportDataWithTwoColumns) => {
    if (typeof row.name != 'string') {
      return row.name;
    }
    const name = row.name as string;
    const emojiUrls: string[] = getEmojiUrls(name);
    if (name.includes(':') && emojiUrls.length > 0) {
      const [prefix, suffix] = name.split('/');
      return (
        <EmojiWrap>
          <StyledTypography>{prefix}/</StyledTypography>
          {emojiUrls.map((url) => (
            <StyledAvatar key={url} src={url} />
          ))}
          <StyledTypography>{removeExtraEmojiName(suffix)}</StyledTypography>
        </EmojiWrap>
      );
    }
    return <StyledTypography>{name}</StyledTypography>;
  };

  const renderRows = () => {
    return data.map((row) => (
      <Fragment key={row.id}>
        <Row data-testid={'tr'}>
          <ColumnTableCell rowSpan={row.valueList.length}>{transformEmoji(row)}</ColumnTableCell>
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
              <StyledTableCell>{`Value${getTitleUnit(title)}`}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody key={title}>{renderRows()}</TableBody>
        </Table>
      </Container>
    </>
  );
};

const getTitleUnit = (title: string) => {
  switch (title) {
    case METRICS_TITLE.DEV_MEAN_TIME_TO_RECOVERY:
      return REPORT_SUFFIX_UNITS.HOURS;
    case METRICS_TITLE.DEPLOYMENT_FREQUENCY:
      return REPORT_SUFFIX_UNITS.DEPLOYMENTS_DAY;
    default:
      return '';
  }
};

export default ReportForTwoColumns;
