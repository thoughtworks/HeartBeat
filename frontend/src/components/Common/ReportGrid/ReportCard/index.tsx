import {
  StyledItemSection,
  StyledReportCard,
  StyledReportCardProgress,
  StyledReportCardTitle,
} from '@src/components/Common/ReportGrid/ReportCard/style'
import React, { HTMLAttributes } from 'react'
import { ReportCardItem, ReportCardItemProps } from '@src/components/Common/ReportGrid/ReportCardItem'
import { CircularProgress } from '@mui/material'
import { GRID_CONFIG } from '@src/constants/commons'

interface ReportCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  items?: ReportCardItemProps[]
  xs: number
}

export const ReportCard = ({ title, items, xs }: ReportCardProps) => {
  const WIDTH = '100%'
  const getReportItems = () => {
    let style = GRID_CONFIG.FULL
    switch (xs) {
      case GRID_CONFIG.HALF.XS:
        style = GRID_CONFIG.HALF
        break
      case GRID_CONFIG.FULL.XS:
        style = GRID_CONFIG.FULL
        break
    }

    const getWidth = (length: number) => {
      if (length <= 1) {
        return WIDTH
      } else {
        switch (xs) {
          case GRID_CONFIG.FULL.XS:
            return GRID_CONFIG.FULL.WIDTH
          case GRID_CONFIG.HALF.XS:
            return GRID_CONFIG.HALF.WIDTH
        }
      }
    }

    return (
      <StyledItemSection>
        {items?.map((item, index) =>
          index < style.INDEX ? (
            <ReportCardItem
              key={item.subtitle}
              value={item.value}
              subtitle={item.subtitle}
              showDividingLine={items.length > 1 && index > 0}
              style={{ width: getWidth(items.length) }}
            />
          ) : (
            <></>
          )
        )}
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
          <CircularProgress size='2rem' />
        </StyledReportCardProgress>
      )}
    </StyledReportCard>
  )
}
