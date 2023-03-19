import React from 'react'
import { Crews } from '@src/components/Metrics/MetricsStep/Crews'
import { useAppSelector } from '@src/hooks'
import { RealDone } from '@src/components/Metrics/MetricsStep/RealDone'
import {
  selectJiraColumns,
  selectTargetFields,
  selectUsers,
} from '@src/context/config/board/jiraVerifyResponse/jiraVerifyResponseSlice'
import { CycleTime } from '@src/components/Metrics/MetricsStep/CycleTime'
import { Classification } from '@src/components/Metrics/MetricsStep/Classification'
import { selectMetrics } from '@src/context/config/configSlice'
import { REQUIRED_DATA } from '@src/constants'
import { DeploymentFrequencySettings } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings'

export const MetricsStep = () => {
  const requiredData = useAppSelector(selectMetrics)
  const users = useAppSelector(selectUsers)
  const doneColumn = ['DONE', 'CANCELLED']
  const jiraColumns = useAppSelector(selectJiraColumns)
  const targetFields = useAppSelector(selectTargetFields)

  return (
    <>
      <Crews options={users} title={'Crews Setting'} label={'Included Crews'} />
      {requiredData.includes(REQUIRED_DATA.CYCLE_TIME) && (
        <CycleTime columns={jiraColumns} title={'Cycle Time Settings'} />
      )}
      <RealDone options={doneColumn} title={'Real Done'} label={'Consider as Done'} />
      {requiredData.includes(REQUIRED_DATA.CLASSIFICATION) && (
        <Classification options={targetFields} title={'Classification Setting'} label={'Distinguished By'} />
      )}
      {requiredData.includes(REQUIRED_DATA.DEPLOYMENT_FREQUENCY) && <DeploymentFrequencySettings />}
    </>
  )
}
