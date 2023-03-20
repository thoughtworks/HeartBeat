import { Divider } from '@src/components/Common/MetricsSettingTitle/style'
import React from 'react'

const MetricsSettingTitle = (props: { title: string }) => (
  <Divider>
    <h4>{props.title}</h4>
  </Divider>
)

export default MetricsSettingTitle
