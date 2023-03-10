import React from 'react'
import MetricsSettingTitle from '@src/components/common/MetricsSettingTitle'
import FlagCard from '@src/components/Metrics/MetricsStep/CycleTime/FlagCard'
import { FormSelectPart } from '@src/components/Metrics/MetricsStep/CycleTime/FormSelectPart'

interface cycletimeProps {
  options: string[]
  title: string
}

export const CycleTime = ({ options, title }: cycletimeProps) => (
  <>
    <MetricsSettingTitle title={title} />
    <FormSelectPart options={options} />
    <FlagCard />
  </>
)
