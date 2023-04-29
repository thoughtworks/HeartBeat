import { Crews } from '@src/components/Metrics/MetricsStep/Crews'
import { useAppSelector } from '@src/hooks'
import { RealDone } from '@src/components/Metrics/MetricsStep/RealDone'
import { CycleTime } from '@src/components/Metrics/MetricsStep/CycleTime'
import { Classification } from '@src/components/Metrics/MetricsStep/Classification'
import { selectJiraColumns, selectMetrics, selectTargetFields, selectUsers } from '@src/context/config/configSlice'
import { METRICS_CONSTANTS, REQUIRED_DATA } from '@src/constants'
import { selectBoardColumns } from '@src/context/Metrics/metricsSlice'
import { DeploymentFrequencySettings } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings'
import { LeadTimeForChanges } from '@src/components/Metrics/MetricsStep/LeadTimeForChanges'

export const MetricsStep = () => {
  const requiredData = useAppSelector(selectMetrics)
  const users = useAppSelector(selectUsers)
  const jiraColumns = useAppSelector(selectJiraColumns)
  const targetFields = useAppSelector(selectTargetFields)
  const selectedBoardColumns = useAppSelector(selectBoardColumns)
  return (
    <>
      <Crews options={users} title={'Crews setting'} label={'Included crews'} />
      {requiredData.includes(REQUIRED_DATA.CYCLE_TIME) && (
        <CycleTime columns={jiraColumns} title={'Cycle time settings'} />
      )}
      {selectedBoardColumns.filter((column) => column.value === METRICS_CONSTANTS.doneValue).length < 2 && (
        <RealDone columns={jiraColumns} title={'Real done'} label={'Consider as done'} />
      )}
      {requiredData.includes(REQUIRED_DATA.CLASSIFICATION) && (
        <Classification options={targetFields} title={'Classification setting'} label={'Distinguished by'} />
      )}
      {requiredData.includes(REQUIRED_DATA.DEPLOYMENT_FREQUENCY) && <DeploymentFrequencySettings />}
      {requiredData.includes(REQUIRED_DATA.LEAD_TIME_FOR_CHANGES) && <LeadTimeForChanges />}
    </>
  )
}
