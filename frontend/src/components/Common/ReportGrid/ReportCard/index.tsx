import { StyledReportCard, StyledReportCardTitle } from '@src/components/Common/ReportGrid/ReportCard/style'
import React, { HTMLAttributes } from 'react'
import { Typography } from '@mui/material'

interface ReportCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string
}

export const ReportCard = ({ title }: ReportCardProps) => {
  return (
    <StyledReportCard>
      <StyledReportCardTitle>
        <Typography variant='subtitle1' component='h2'>
          {title}
        </Typography>
      </StyledReportCardTitle>
    </StyledReportCard>
  )
}
