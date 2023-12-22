import {
  StyledDividingLine,
  StyledItem,
  StyledSubtitle,
  StyledUnit,
  StyledValue,
  StyledContent,
} from '@src/components/Common/ReportGrid/ReportCardItem/style'
import DividingLine from '@src/assets/DividingLine.svg'
import React, { HTMLAttributes } from 'react'

export interface ReportCardItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string | number | undefined
  extraValue?: string
  subtitle: string
  showDividingLine?: boolean
  unit?: string
}

export const ReportCardItem = ({ style, value, unit, subtitle, showDividingLine = false }: ReportCardItemProps) => {
  return (
    <StyledItem style={style}>
      {showDividingLine && <StyledDividingLine src={DividingLine} alt='dividingLine' />}
      <div>
        <StyledContent>
          <StyledValue>{value}</StyledValue>
          <StyledUnit disabled variant='standard' InputProps={{ disableUnderline: true }} value={unit} />
        </StyledContent>
        <StyledSubtitle disabled variant='standard' InputProps={{ disableUnderline: true }} value={subtitle} />
      </div>
    </StyledItem>
  )
}
