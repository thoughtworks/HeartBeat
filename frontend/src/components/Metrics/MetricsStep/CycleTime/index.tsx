import { Divider } from '@src/components/Metrics/MetricsStep/Crews/style'
import React from 'react'

interface cycletimeProps {
  title: string
}

export const CycleTime = ({ title }: cycletimeProps) => (
  <Divider>
    <span>{title}</span>
  </Divider>
)
