import React from 'react'
import { Grid } from '@mui/material'
import { ReportCard } from '@src/components/Common/ReportGrid/ReportCard'
import { GRID_XS } from '@src/constants/commons'
import { ReportCardItemProps } from '@src/components/Common/ReportGrid/ReportCardItem'

export interface ReportGridProps {
  lastGrid?: boolean
  reportDetails: {
    title: string
    items: ReportCardItemProps[]
  }[]
}

export const ReportGrid = ({ lastGrid, reportDetails }: ReportGridProps) => {
  const getXS = (index: number) => {
    if (lastGrid && reportDetails.length - 1 == index) {
      return GRID_XS.FULL
    } else if (reportDetails.length > 1) {
      return GRID_XS.HALF
    } else {
      return GRID_XS.FULL
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
