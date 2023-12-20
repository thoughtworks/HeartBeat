import {
  StyledItemSection,
  StyledReportCard,
  StyledReportCardProgress,
  StyledReportCardTitle,
} from '@src/components/Common/ReportGrid/ReportCard/style'
import React, { HTMLAttributes } from 'react'
import { ReportCardItem, ReportCardItemProps } from '@src/components/Common/ReportGrid/ReportCardItem'
import { CircularProgress } from '@mui/material'
import { GRID_XS, REPORT_ITEM_INDEX } from '@src/constants/commons'
import { StyledDividingLine } from '@src/components/Common/ReportGrid/ReportCardItem/style'
import DividingLine from '@src/assets/DividingLine.svg'

interface ReportCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  items?: ReportCardItemProps[]
  xs: number
}

export const ReportCard = ({ title, items, xs }: ReportCardProps) => {
  const getReportItems = () => {
    let limitedIndex = 0
    switch (xs) {
      case GRID_XS.HALF:
        limitedIndex = REPORT_ITEM_INDEX.HALF
        break
      case GRID_XS.FULL:
        limitedIndex = REPORT_ITEM_INDEX.FULL
        break
    }
    return (
      <StyledItemSection>
        {items?.map((item, index) => {
          if (index >= limitedIndex) return
          return (
            <>
              {items.length > 1 && index > 0 && <StyledDividingLine src={DividingLine} alt='dividingLine' />}
              <ReportCardItem key={item.subtitle} value={item.value} subtitle={item.subtitle} />
            </>
          )
        })}
      </StyledItemSection>
    )
  }

  return (
    <StyledReportCard>
      <StyledReportCardTitle>{title}</StyledReportCardTitle>
      {items ? (
        getReportItems()
      ) : (
        <StyledReportCardProgress>
          <CircularProgress size='2' />
        </StyledReportCardProgress>
      )}
    </StyledReportCard>
  )
}
