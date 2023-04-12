import { ReportForTwoColumns } from '@src/components/Common/ReportForTwoColumns'
import React from 'react'
import { ReportDataWithTwoColumns } from '@src/models/reportUIDataStructure'

interface CycleTimeProps {
  title: string
  cycleTimeData: ReportDataWithTwoColumns[]
}

export const CycleTimeReport = ({ title, cycleTimeData }: CycleTimeProps) => (
  <ReportForTwoColumns title={title} data={cycleTimeData} />
)
