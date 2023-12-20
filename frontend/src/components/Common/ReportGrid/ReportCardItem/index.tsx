import {
  StyledDividingLine,
  StyledItem,
  StyledSubtitle,
  StyledValue,
} from '@src/components/Common/ReportGrid/ReportCardItem/style'
import DividingLine from '@src/assets/DividingLine.svg'
import React from 'react'

export interface ReportCardItemProps {
  value: string
  subtitle: string
  showDividingLine?: boolean
}

export const ReportCardItem = ({ value, subtitle, showDividingLine = false }: ReportCardItemProps) => {
  return (
    <StyledItem>
      {showDividingLine && <StyledDividingLine src={DividingLine} alt='dividingLine' />}
      <div>
        <StyledValue>{value}</StyledValue>
        <StyledSubtitle>{subtitle}</StyledSubtitle>
      </div>
    </StyledItem>
  )
}
