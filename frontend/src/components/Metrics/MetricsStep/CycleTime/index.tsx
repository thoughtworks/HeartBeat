import React from 'react'
import MetricsSettingTitle from '@src/components/common/metricsSettingTitle'

interface cycletimeProps {
  title: string
}

export const CycleTime = ({ title }: cycletimeProps) => <MetricsSettingTitle title={title} />
