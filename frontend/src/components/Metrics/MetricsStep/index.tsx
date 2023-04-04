import React from 'react'
import { Crews } from '@src/components/Metrics/MetricsStep/Crews'
import { useAppSelector } from '@src/hooks'
import { RealDone } from '@src/components/Metrics/MetricsStep/RealDone'
import { selectJiraColumns, selectTargetFields, selectUsers } from '@src/context/response/responseSlice'
import { CycleTime } from '@src/components/Metrics/MetricsStep/CycleTime'
import { Classification } from '@src/components/Metrics/MetricsStep/Classification'
import { selectMetrics } from '@src/context/config/configSlice'
import { METRICS_CONSTANTS, REQUIRED_DATA } from '@src/constants'
import { selectBoardColumns } from '@src/context/Metrics/metricsSlice'
import { DeploymentFrequencySettings } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings'

export const MetricsStep = () => {
  const requiredData = useAppSelector(selectMetrics)
  const users = useAppSelector(selectUsers)
  const jiraColumns = useAppSelector(selectJiraColumns)
  const targetFields = useAppSelector(selectTargetFields)
  const selectedBoardColumns = useAppSelector(selectBoardColumns)
  return (
    <>
      <Crews options={users} title={'Crews Setting'} label={'Included Crews'} />
      {requiredData.includes(REQUIRED_DATA.CYCLE_TIME) && (
        <CycleTime columns={jiraColumns} title={'Cycle Time Settings'} />
      )}
      {selectedBoardColumns.filter((column) => column.value === METRICS_CONSTANTS.doneValue).length < 2 && (
        <RealDone columns={jiraColumns} title={'Real Done'} label={'Consider as Done'} />
      )}
      {requiredData.includes(REQUIRED_DATA.CLASSIFICATION) && (
        <Classification options={targetFields} title={'Classification Setting'} label={'Distinguished By'} />
      )}
      {requiredData.includes(REQUIRED_DATA.DEPLOYMENT_FREQUENCY) && <DeploymentFrequencySettings />}
    </>
  )
}
