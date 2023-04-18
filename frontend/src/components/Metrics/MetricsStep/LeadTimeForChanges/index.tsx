import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle'
import React from 'react'
import { addALeadTimeForChanges } from '@src/context/Metrics/metricsSlice'
import { useAppDispatch } from '@src/hooks'
import { MetricsSettingAddButton } from '@src/components/Common/MetricsSettingButton'

export const LeadTimeForChanges = () => {
  const dispatch = useAppDispatch()
  const handleClick = () => {
    dispatch(addALeadTimeForChanges())
  }
  return (
    <>
      <MetricsSettingTitle title={'Lead Time for Changes'} />
      <MetricsSettingAddButton handleClick={handleClick} />
    </>
  )
}
