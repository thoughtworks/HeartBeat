import React from 'react'
import FlagCard from '@src/components/Metrics/MetricsStep/CycleTime/FlagCard'
import { selectCycleTimeWarningMessage } from '@src/context/Metrics/metricsSlice'
import { useAppSelector } from '@src/hooks'
import { WarningNotification } from '@src/components/Common/WarningNotification'
import CycleTimeTable from '@src/components/Metrics/MetricsStep/CycleTime/Table'

export const CycleTime = () => {
  const warningMessage = useAppSelector(selectCycleTimeWarningMessage)

  return (
    <div aria-label='Cycle time settings section'>
      {warningMessage && <WarningNotification message={warningMessage} />}
      <CycleTimeTable />
      <FlagCard />
    </div>
  )
}
