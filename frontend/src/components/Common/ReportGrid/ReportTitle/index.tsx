import React from 'react'
import {
  StyledMetricsSign,
  StyledMetricsTitle,
  StyledMetricsTitleSection,
} from '@src/components/Common/ReportGrid/ReportTitle/style'

interface ReportTitleProps {
  title: string
}
export const ReportTitle = ({ title }: ReportTitleProps) => {
  return (
    <StyledMetricsTitleSection>
      <StyledMetricsSign />
      <StyledMetricsTitle>{title}</StyledMetricsTitle>
    </StyledMetricsTitleSection>
  )
}
