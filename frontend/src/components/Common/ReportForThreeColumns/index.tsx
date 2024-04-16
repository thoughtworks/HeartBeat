import {
  BorderTableCell,
  ColumnTableCell,
  Container,
  Row,
  StyledTableCell,
} from '@src/components/Common/ReportForTwoColumns/style';
import { AVERAGE_FIELD, METRICS_TITLE, REPORT_SUFFIX_UNITS } from '@src/constants/resources';
import { ReportDataWithThreeColumns } from '@src/hooks/reportMapper/reportUIDataStructure';
import { EmojiWrap, StyledAvatar, StyledTypography } from '@src/constants/emojis/style';
import { getEmojiUrls, removeExtraEmojiName } from '@src/constants/emojis/emoji';
import { ReportSelectionTitle } from '@src/containers/MetricsStep/style';
import { ErrorMessagePrompt } from '@src/components/ErrorMessagePrompt';
import { Table, TableBody, TableHead, TableRow } from '@mui/material';
import { Loading } from '@src/components/Loading';
import { styled } from '@mui/material/styles';
import { Optional } from '@src/utils/types';
import React, { Fragment } from 'react';
import { isEmpty } from 'lodash';

interface ReportForThreeColumnsProps {
  title: string;
  fieldName: string;
  listName: string;
  data: Optional<ReportDataWithThreeColumns[]>;
  errorMessage?: string;
}

export const StyledLoadingWrapper = styled('div')({
  position: 'relative',
  height: '12rem',
  width: '100%',
});

export const ReportForThreeColumns = ({
  title,
  fieldName,
  listName,
  data,
  errorMessage,
}: ReportForThreeColumnsProps) => {
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
    data?.slice(0, data?.length === 2 && data[1]?.name === AVERAGE_FIELD ? 1 : data?.length).map((row) => {
      if (isEmpty(row.valuesList)) {
        row.valuesList = [
          {
            name: '--',
            value: '--',
          },
        ];
      }
      return (
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
      );
    });

  const getTitleUnit = (title: string) => {
    return title === METRICS_TITLE.LEAD_TIME_FOR_CHANGES ? REPORT_SUFFIX_UNITS.HOURS : '';
  };

  const renderLoading = () => (
    <>
      {!errorMessage && !data && (
        <StyledLoadingWrapper>
          <Loading size='1.5rem' backgroundColor='transparent' />
        </StyledLoadingWrapper>
      )}
    </>
  );

  const renderData = () => (
    <>
      {!errorMessage && data && (
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
      )}
    </>
  );

  return (
    <>
      <Container>
        <ReportSelectionTitle>{title}</ReportSelectionTitle>
        {errorMessage && <ErrorMessagePrompt errorMessage={errorMessage} style={{ marginBottom: '1.5rem' }} />}
        {renderLoading()}
        {renderData()}
      </Container>
    </>
  );
};

export default ReportForThreeColumns;
