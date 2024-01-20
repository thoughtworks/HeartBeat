import {
  StyledMetricsSign,
  StyledMetricsTitle,
  StyledMetricsTitleSection,
} from '@src/components/Common/ReportGrid/ReportTitle/style';
import React from 'react';

interface ReportTitleProps {
  title: string;
}
export const ReportTitle = ({ title }: ReportTitleProps) => {
  return (
    <StyledMetricsTitleSection>
      <StyledMetricsSign />
      <StyledMetricsTitle>{title}</StyledMetricsTitle>
    </StyledMetricsTitleSection>
  );
};
