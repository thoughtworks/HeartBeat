import { Divider } from '@src/components/Metrics/MetricsStep/Crews/style'
import React from 'react'

const MetricsSettingTitle = (props: { title: string }) => (
  <Divider>
    <span>{props.title}</span>
  </Divider>
)

export default MetricsSettingTitle
