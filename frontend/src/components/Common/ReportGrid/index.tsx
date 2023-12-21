import React from 'react'
import { Grid } from '@mui/material'
import { ReportCard } from '@src/components/Common/ReportGrid/ReportCard'
import { GRID_CONFIG } from '@src/constants/commons'
import { ReportCardItemProps } from '@src/components/Common/ReportGrid/ReportCardItem'

export interface ReportGridProps {
  lastGrid?: boolean
  reportDetails: {
    title: string
    items?: ReportCardItemProps[]
  }[]
}

export const ReportGrid = ({ lastGrid, reportDetails }: ReportGridProps) => {
  const getXS = (index: number) => {
    if (lastGrid && reportDetails.length - 1 == index) {
      return GRID_CONFIG.FULL.XS
    } else if (reportDetails.length > 1) {
      return GRID_CONFIG.HALF.XS
    } else {
      return GRID_CONFIG.FULL.XS
    }
  }

  return (
    <Grid container justifyContent='center' spacing={3}>
      {reportDetails.map((detail, index) => {
        const xs = getXS(index)
        return (
          <Grid item xs={xs} key={detail.title}>
            <ReportCard title={detail.title} items={detail.items} xs={xs} />
          </Grid>
        )
      })}
    </Grid>
  )
}
