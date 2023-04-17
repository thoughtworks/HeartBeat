import { ReportForTwoColumns } from '@src/components/Common/ReportForTwoColumns'
import React from 'react'
import { ReportDataWithTwoColumns } from '@src/hooks/reportMapper/reportUIDataStructure'

interface VelocityProps {
  title: string
  velocityData: ReportDataWithTwoColumns[]
}

export const Velocity = ({ title, velocityData }: VelocityProps) => (
  <ReportForTwoColumns title={title} data={velocityData} />
)
