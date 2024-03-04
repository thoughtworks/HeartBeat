import {
  StyledContent,
  StyledDividingLine,
  StyledExtraValue,
  StyledItem,
  StyledSubtitle,
  StyledValue,
  StyledValueSection,
  StyledWrapper,
} from '@src/components/Common/ReportGrid/ReportCardItem/style';
import DividingLine from '@src/assets/DividingLine.svg';
import React, { HTMLAttributes } from 'react';
import { Tooltip } from '@mui/material';

export interface ReportCardItemProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  isToFixed?: boolean;
  extraValue?: string;
  subtitle: string;
  showDividingLine?: boolean;
}

export const ReportCardItem = ({
  style,
  value,
  isToFixed = true,
  extraValue,
  subtitle,
  showDividingLine,
}: ReportCardItemProps) => {
  return (
    <StyledItem style={style}>
      {showDividingLine && <StyledDividingLine src={DividingLine} alt='Dividing Line' />}
      <StyledWrapper>
        <StyledContent>
          <StyledValueSection>
            <StyledValue>{isToFixed ? value.toFixed(2) : value}</StyledValue>
            {extraValue && <StyledExtraValue>{extraValue}</StyledExtraValue>}
          </StyledValueSection>
        </StyledContent>
        <Tooltip arrow title={subtitle} placement={'bottom'}>
          <StyledSubtitle>{subtitle}</StyledSubtitle>
        </Tooltip>
      </StyledWrapper>
    </StyledItem>
  );
};
