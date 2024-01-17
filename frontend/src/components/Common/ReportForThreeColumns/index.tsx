import { Table, TableBody, TableHead, TableRow } from '@mui/material';
import {
  BorderTableCell,
  ColumnTableCell,
  Container,
  Row,
  StyledTableCell,
} from '@src/components/Common/ReportForTwoColumns/style';
import React, { Fragment } from 'react';
import { ReportDataWithThreeColumns } from '@src/hooks/reportMapper/reportUIDataStructure';
import { AVERAGE_FIELD, METRICS_TITLE, REPORT_SUFFIX_UNITS } from '@src/constants/resources';
import { getEmojiUrls, removeExtraEmojiName } from '@src/emojis/emoji';
import { EmojiWrap, StyledAvatar, StyledTypography } from '@src/emojis/style';
import { ReportSelectionTitle } from '@src/containers/MetricsStep/style';
import { Loading } from '@src/components/Loading';
import { styled } from '@mui/material/styles';
import { Optional } from '@src/utils/types';

interface ReportForThreeColumnsProps {
  title: string;
  fieldName: string;
  listName: string;
  data: Optional<ReportDataWithThreeColumns[]>;
}

export const StyledLoadingWrapper = styled('div')({
  position: 'relative',
  height: '12rem',
  width: '100%',
});

export const ReportForThreeColumns = ({ title, fieldName, listName, data }: ReportForThreeColumnsProps) => {
  const emojiRow = (row: ReportDataWithThreeColumns) => {
    const { name } = row;
    const emojiUrls: string[] = getEmojiUrls(name);
    if (name.includes(':') && emojiUrls.length > 0) {
      const [prefix, suffix] = row.name.split('/');
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

  const renderRows = () =>
    data?.slice(0, data?.length === 2 && data[1]?.name === AVERAGE_FIELD ? 1 : data?.length).map((row) => (
      <Fragment key={row.id}>
        <TableRow data-testid={'tr'}>
          <ColumnTableCell rowSpan={row.valuesList.length + 1}>{emojiRow(row)}</ColumnTableCell>
        </TableRow>
        {row.valuesList.map((valuesList) => (
          <Row data-testid={'tr'} key={valuesList.name}>
            <BorderTableCell>{valuesList.name}</BorderTableCell>
            <BorderTableCell>{valuesList.value}</BorderTableCell>
          </Row>
        ))}
      </Fragment>
    ));

  const getTitleUnit = (title: string) => {
    return title === METRICS_TITLE.LEAD_TIME_FOR_CHANGES || title === METRICS_TITLE.MEAN_TIME_TO_RECOVERY
      ? REPORT_SUFFIX_UNITS.HOURS
      : title === METRICS_TITLE.DEPLOYMENT_FREQUENCY
      ? REPORT_SUFFIX_UNITS.DEPLOYMENTS_DAY
      : '';
  };

  return (
    <>
      <Container>
        <ReportSelectionTitle>{title}</ReportSelectionTitle>
        {data ? (
          <Table data-test-id={title} data-testid={title}>
            <TableHead>
              <TableRow>
                <StyledTableCell>{fieldName}</StyledTableCell>
                <StyledTableCell>{listName}</StyledTableCell>
                <StyledTableCell>{`Value${getTitleUnit(title)}`}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderRows()}</TableBody>
          </Table>
        ) : (
          <StyledLoadingWrapper>
            <Loading size='1.5rem' backgroundColor='transparent' />
          </StyledLoadingWrapper>
        )}
      </Container>
    </>
  );
};

export default ReportForThreeColumns;
