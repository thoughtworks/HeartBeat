import { Table, TableBody, TableHead, TableRow } from '@mui/material'
import {
  BorderTableCell,
  ColumnTableCell,
  Container,
  Row,
  StyledTableCell,
} from '@src/components/Common/ReportForTwoColumns/style'
import React, { Fragment } from 'react'
import { ReportDataWithThreeColumns } from '@src/hooks/reportMapper/reportUIDataStructure'
import { AVERAGE_FIELD, Unit } from '@src/constants'
import { getEmojiUrls, removeExtraEmojiName } from '@src/emojis/emoji'
import { EmojiWrap, StyledAvatar, StyledTypography } from '@src/emojis/style'
import { ReportSelectionTitle } from '@src/components/Metrics/MetricsStep/style'

interface ReportForThreeColumnsProps {
  title: string
  fieldName: string
  listName: string
  data: ReportDataWithThreeColumns[]
}

export const ReportForThreeColumns = ({ title, fieldName, listName, data }: ReportForThreeColumnsProps) => {
  const emojiRow = (row: ReportDataWithThreeColumns) => {
    const { name } = row
    const emojiUrls: string[] = getEmojiUrls(name)
    if (name.includes(':') && emojiUrls.length > 0) {
      const [prefix, suffix] = row.name.split('/')
      return (
        <EmojiWrap>
          <StyledTypography>{prefix}/</StyledTypography>
          {emojiUrls.map((url) => (
            <StyledAvatar key={url} src={url} />
          ))}
          <StyledTypography>{removeExtraEmojiName(suffix)}</StyledTypography>
        </EmojiWrap>
      )
    }
    return <StyledTypography>{name}</StyledTypography>
  }

  const renderRows = () =>
    data.slice(0, data.length === 2 && data[1].name === AVERAGE_FIELD ? 1 : data.length).map((row) => (
      <Fragment key={row.id}>
        <TableRow>
          <ColumnTableCell rowSpan={row.valuesList.length + 1}>{emojiRow(row)}</ColumnTableCell>
        </TableRow>
        {row.valuesList.map((valuesList) => (
          <Row key={valuesList.name}>
            <BorderTableCell>{valuesList.name}</BorderTableCell>
            <BorderTableCell>{valuesList.value}</BorderTableCell>
          </Row>
        ))}
      </Fragment>
    ))

  return (
    <>
      <Container>
        <ReportSelectionTitle>{title}</ReportSelectionTitle>
        <Table data-test-id={title}>
          <TableHead>
            <TableRow>
              <StyledTableCell>{fieldName}</StyledTableCell>
              <StyledTableCell>{listName}</StyledTableCell>
              <StyledTableCell>
                Value{title === 'Lead time for changes' || title === 'Mean Time To Recovery' ? Unit.HOURS : ''}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderRows()}</TableBody>
        </Table>
      </Container>
    </>
  )
}

export default ReportForThreeColumns
