import React from 'react'
import { Crews } from '@src/components/Metrics/MetricsStep/Crews'
const options = ['Oliver Hansen', 'Van Henry']
export const MetricsStep = () => {
  return (
    <>
      <Crews options={options} title={'Crews Setting'} label={'Included Crews'} />
    </>
  )
}
