import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Container, Row } from '@src/components/Common/ReportForTwoColumns/style'
import React, { Fragment } from 'react'
import { ReportDataWithThreeColumns } from '@src/hooks/reportMapper/reportUIDataStructure'
import { AVERAGE_FIELD, Unit } from '@src/constants'
import { getEmojiUrls, removeExtraEmojiName } from '@src/emojis/emoji'
import { EmojiWrap, StyledAvatar } from '@src/emojis/style'
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
          <Typography>{prefix}/</Typography>
          {emojiUrls.map((url) => (
            <StyledAvatar key={url} src={url} />
          ))}
          <Typography>{removeExtraEmojiName(suffix)}</Typography>
        </EmojiWrap>
      )
    }
    return <Typography>{name}</Typography>
  }

  const renderRows = () =>
    data.slice(0, data.length === 2 && data[1].name === AVERAGE_FIELD ? 1 : data.length).map((row) => (
      <Fragment key={row.id}>
        <TableRow>
          <TableCell rowSpan={row.valuesList.length + 1}>{emojiRow(row)}</TableCell>
        </TableRow>
        {row.valuesList.map((valuesList) => (
          <Row key={valuesList.name}>
            <TableCell>{valuesList.name}</TableCell>
            <TableCell>{valuesList.value}</TableCell>
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
              <TableCell>{fieldName}</TableCell>
              <TableCell>{listName}</TableCell>
              <TableCell>
                Value{title === 'Lead time for changes' || title === 'Mean Time To Recovery' ? Unit.HOURS : ''}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderRows()}</TableBody>
        </Table>
      </Container>
    </>
  )
}

export default ReportForThreeColumns
