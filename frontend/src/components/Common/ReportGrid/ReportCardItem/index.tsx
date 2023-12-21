import {
  StyledDividingLine,
  StyledItem,
  StyledSubtitle,
  StyledValue,
} from '@src/components/Common/ReportGrid/ReportCardItem/style'
import DividingLine from '@src/assets/DividingLine.svg'
import React, { HTMLAttributes } from 'react'

export interface ReportCardItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string
  subtitle: string
  showDividingLine?: boolean
}

export const ReportCardItem = ({ style, value, subtitle, showDividingLine = false }: ReportCardItemProps) => {
  return (
    <StyledItem style={style}>
      {showDividingLine && <StyledDividingLine src={DividingLine} alt='dividingLine' />}
      <div>
        <StyledValue>{value}</StyledValue>
        <StyledSubtitle>{subtitle}</StyledSubtitle>
      </div>
    </StyledItem>
  )
}
