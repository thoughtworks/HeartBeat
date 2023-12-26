import {
  StyledDividingLine,
  StyledItem,
  StyledSubtitle,
  StyledValue,
  StyledContent,
  StyledValueSection,
  StyledExtraValue,
  StyledWrapper,
} from '@src/components/Common/ReportGrid/ReportCardItem/style'
import DividingLine from '@src/assets/DividingLine.svg'
import React, { HTMLAttributes } from 'react'

export interface ReportCardItemProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  isToFixed?: boolean
  extraValue?: string
  subtitle: string
  showDividingLine?: boolean
}

export const ReportCardItem = ({
  style,
  value,
  isToFixed = true,
  extraValue,
  subtitle,
  showDividingLine = false,
}: ReportCardItemProps) => {
  return (
    <StyledItem style={style}>
      {showDividingLine && <StyledDividingLine src={DividingLine} alt='dividingLine' />}
      <StyledWrapper>
        <StyledContent>
          <StyledValueSection>
            <StyledValue>{isToFixed ? value.toFixed(2) : value}</StyledValue>
            {extraValue && <StyledExtraValue>{extraValue}</StyledExtraValue>}
          </StyledValueSection>
        </StyledContent>
        <StyledSubtitle disabled variant='standard' InputProps={{ disableUnderline: true }} value={subtitle} />
      </StyledWrapper>
    </StyledItem>
  )
}
