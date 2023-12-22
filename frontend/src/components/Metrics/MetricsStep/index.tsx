import { Crews } from '@src/components/Metrics/MetricsStep/Crews'
import { useAppSelector } from '@src/hooks'
import { RealDone } from '@src/components/Metrics/MetricsStep/RealDone'
import { CycleTime } from '@src/components/Metrics/MetricsStep/CycleTime'
import { Classification } from '@src/components/Metrics/MetricsStep/Classification'
import { selectDateRange, selectJiraColumns, selectMetrics, selectUsers } from '@src/context/config/configSlice'
import { REQUIRED_DATA, DONE } from '@src/constants/resources'
import { selectCycleTimeSettings, selectMetricsContent } from '@src/context/Metrics/metricsSlice'
import { DeploymentFrequencySettings } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings'
import DateRangeViewer from '@src/components/Common/DateRangeViewer'
import {
  MetricSelectionWrapper,
  MetricsSelectionTitle,
  MetricSelectionHeader,
} from '@src/components/Metrics/MetricsStep/style'
import { useLayoutEffect } from 'react'
import { useNotificationLayoutEffectInterface } from '@src/hooks/useNotificationLayoutEffect'

const MetricsStep = ({ resetProps }: useNotificationLayoutEffectInterface) => {
  const requiredData = useAppSelector(selectMetrics)
  const users = useAppSelector(selectUsers)
  const jiraColumns = useAppSelector(selectJiraColumns)
  const targetFields = useAppSelector(selectMetricsContent).targetFields
  const cycleTimeSettings = useAppSelector(selectCycleTimeSettings)
  const { startDate, endDate } = useAppSelector(selectDateRange)
  const isShowCrewsAndRealDone =
    requiredData.includes(REQUIRED_DATA.VELOCITY) ||
    requiredData.includes(REQUIRED_DATA.CYCLE_TIME) ||
    requiredData.includes(REQUIRED_DATA.CLASSIFICATION)
  const isShowRealDone = cycleTimeSettings.some((e) => e.value === DONE)

  useLayoutEffect(() => {
    resetProps?.()
  }, [])

  return (
    <>
      {startDate && endDate && (
        <MetricSelectionHeader>
          <DateRangeViewer startDate={startDate} endDate={endDate} />
        </MetricSelectionHeader>
      )}
      <MetricSelectionWrapper>
        <MetricsSelectionTitle>Board configuration</MetricsSelectionTitle>

        {isShowCrewsAndRealDone && <Crews options={users} title={'Crew settings'} label={'Included Crews'} />}

        {requiredData.includes(REQUIRED_DATA.CYCLE_TIME) && <CycleTime title={'Cycle time settings'} />}

        {isShowCrewsAndRealDone && isShowRealDone && (
          <RealDone columns={jiraColumns} title={'Real done setting'} label={'Consider as Done'} />
        )}

        {requiredData.includes(REQUIRED_DATA.CLASSIFICATION) && (
          <Classification targetFields={targetFields} title={'Classification setting'} label={'Distinguished By'} />
        )}
      </MetricSelectionWrapper>

      {(requiredData.includes(REQUIRED_DATA.DEPLOYMENT_FREQUENCY) ||
        requiredData.includes(REQUIRED_DATA.CHANGE_FAILURE_RATE) ||
        requiredData.includes(REQUIRED_DATA.LEAD_TIME_FOR_CHANGES) ||
        requiredData.includes(REQUIRED_DATA.MEAN_TIME_TO_RECOVERY)) && (
        <MetricSelectionWrapper>
          <MetricsSelectionTitle>Pipeline configuration</MetricsSelectionTitle>
          <DeploymentFrequencySettings />
        </MetricSelectionWrapper>
      )}
    </>
  )
}

export default MetricsStep
