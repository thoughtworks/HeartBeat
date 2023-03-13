import React from 'react'
import MetricsSettingTitle from '@src/components/common/MetricsSettingTitle'
import FlagCard from '@src/components/Metrics/MetricsStep/CycleTime/FlagCard'
import { FormSelectPart } from '@src/components/Metrics/MetricsStep/CycleTime/FormSelectPart'

interface cycletimeProps {
  columns: string[]
  title: string
}

export const CycleTime = ({ columns, title }: cycletimeProps) => (
  <>
    <MetricsSettingTitle title={title} />
    <FormSelectPart columns={columns} />
    <FlagCard />
  </>
)
