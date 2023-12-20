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
}

export const ReportCardItem = ({ value, subtitle }: ReportCardItemProps) => {
  return (
    <StyledItem>
      <StyledValue>{value}</StyledValue>
      <StyledSubtitle display='inline'>{subtitle}</StyledSubtitle>
    </StyledItem>
  )
}
