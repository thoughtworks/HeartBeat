import {
  StyledDividingLine,
  StyledItem,
  StyledSubtitle,
  StyledValue,
  StyledValueWrapper,
  StyledUnit,
} from '@src/components/Common/ReportGrid/ReportCardItem/style'
import DividingLine from '@src/assets/DividingLine.svg'
import React, { HTMLAttributes } from 'react'

export interface ReportCardItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string
  subtitle: string
  showDividingLine?: boolean
  unit?: string
}

export const ReportCardItem = ({ style, value, unit, subtitle, showDividingLine = false }: ReportCardItemProps) => {
  return (
    <StyledItem style={style}>
      {showDividingLine && <StyledDividingLine src={DividingLine} alt='dividingLine' />}
      <div>
        <StyledValueWrapper>
          <StyledValue>{value}</StyledValue>
          <StyledUnit>{unit}</StyledUnit>
        </StyledValueWrapper>
        <StyledSubtitle>{subtitle}</StyledSubtitle>
      </div>
    </StyledItem>
  )
}
