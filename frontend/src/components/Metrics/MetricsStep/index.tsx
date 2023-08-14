import { Crews } from '@src/components/Metrics/MetricsStep/Crews'
import { useAppSelector } from '@src/hooks'
import { RealDone } from '@src/components/Metrics/MetricsStep/RealDone'
import { CycleTime } from '@src/components/Metrics/MetricsStep/CycleTime'
import { Classification } from '@src/components/Metrics/MetricsStep/Classification'
import { selectJiraColumns, selectMetrics, selectUsers } from '@src/context/config/configSlice'
import { DONE, REQUIRED_DATA } from '@src/constants'
import { selectCycleTimeSettings, selectMetricsContent } from '@src/context/Metrics/metricsSlice'
import { DeploymentFrequencySettings } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings'
import { LeadTimeForChanges } from '@src/components/Metrics/MetricsStep/LeadTimeForChanges'

const MetricsStep = () => {
  const requiredData = useAppSelector(selectMetrics)
  const users = useAppSelector(selectUsers)
  const jiraColumns = useAppSelector(selectJiraColumns)
  const targetFields = useAppSelector(selectMetricsContent).targetFields
  const cycleTimeSettings = useAppSelector(selectCycleTimeSettings)
  const isShowCrewsAndRealDone =
    requiredData.includes(REQUIRED_DATA.VELOCITY) ||
    requiredData.includes(REQUIRED_DATA.CYCLE_TIME) ||
    requiredData.includes(REQUIRED_DATA.CLASSIFICATION)
  const isShowRealDone = cycleTimeSettings.every((e) => e.value !== DONE)

  return (
    <>
      {isShowCrewsAndRealDone && <Crews options={users} title={'Crews setting'} label={'Included Crews'} />}

      {requiredData.includes(REQUIRED_DATA.CYCLE_TIME) && <CycleTime title={'Cycle time settings'} />}

      {isShowCrewsAndRealDone && !isShowRealDone && (
        <RealDone columns={jiraColumns} title={'Real done'} label={'Consider as Done'} />
      )}

      {requiredData.includes(REQUIRED_DATA.CLASSIFICATION) && (
        <Classification targetFields={targetFields} title={'Classification setting'} label={'Distinguished By'} />
      )}

      {(requiredData.includes(REQUIRED_DATA.DEPLOYMENT_FREQUENCY) ||
        requiredData.includes(REQUIRED_DATA.CHANGE_FAILURE_RATE) ||
        requiredData.includes(REQUIRED_DATA.MEAN_TIME_TO_RECOVERY)) && <DeploymentFrequencySettings />}

      {requiredData.includes(REQUIRED_DATA.LEAD_TIME_FOR_CHANGES) && <LeadTimeForChanges />}
    </>
  )
}

export default MetricsStep
