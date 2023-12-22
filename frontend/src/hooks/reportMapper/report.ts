import { ReportResponse, ReportResponseDTO } from '@src/clients/report/dto/response'
import { changeFailureRateMapper } from '@src/hooks/reportMapper/changeFailureRate'
import { velocityMapper } from '@src/hooks/reportMapper/velocity'
import { cycleTimeMapper } from '@src/hooks/reportMapper/cycleTime'
import { classificationMapper } from '@src/hooks/reportMapper/classification'
import { deploymentFrequencyMapper } from '@src/hooks/reportMapper/deploymentFrequency'
import { leadTimeForChangesMapper } from '@src/hooks/reportMapper/leadTimeForChanges'
import { meanTimeToRecoveryMapper } from '@src/hooks/reportMapper/meanTimeToRecovery'
import { exportValidityTimeMapper } from '@src/hooks/reportMapper/exportValidityTime'

export const reportMapper = ({
  velocity,
  cycleTime,
  classificationList,
  deploymentFrequency,
  meanTimeToRecovery,
  leadTimeForChanges,
  changeFailureRate,
  exportValidityTime,
}: ReportResponseDTO): ReportResponse => {
  const velocityList = velocity && velocityMapper(velocity)

  const cycleTimeList = cycleTime && cycleTimeMapper(cycleTime)

  const classification = classificationList && classificationMapper(classificationList)

  const deploymentFrequencyList = deploymentFrequency && deploymentFrequencyMapper(deploymentFrequency)

  const meanTimeToRecoveryList = meanTimeToRecovery && meanTimeToRecoveryMapper(meanTimeToRecovery)

  const leadTimeForChangesList = leadTimeForChanges && leadTimeForChangesMapper(leadTimeForChanges)

  const changeFailureRateList = changeFailureRate && changeFailureRateMapper(changeFailureRate)

  const exportValidityTimeMin = exportValidityTimeMapper(exportValidityTime)

  return {
    velocityList,
    cycleTimeList,
    classification,
    deploymentFrequencyList,
    meanTimeToRecoveryList,
    leadTimeForChangesList,
    changeFailureRateList,
    exportValidityTimeMin,
  }
}

export const boardReportMapper = ({ velocity, cycleTime }: ReportResponseDTO): ReportResponse => {
  const velocityList = velocity && velocityMapper(velocity)

  const cycleTimeList = cycleTime && cycleTimeMapper(cycleTime)

  return {
    velocityList,
    cycleTimeList,
  }
}

export const sourceControlReportMapper = ({ leadTimeForChanges }: ReportResponseDTO): ReportResponse => {
  const leadTimeForChangesList = leadTimeForChanges && leadTimeForChangesMapper(leadTimeForChanges)

  return {
    leadTimeForChangesList,
  }
}

export const pipelineReportMapper = ({
  deploymentFrequency,
  meanTimeToRecovery,
  changeFailureRate,
}: ReportResponseDTO): ReportResponse => {
  const deploymentFrequencyList = deploymentFrequency && deploymentFrequencyMapper(deploymentFrequency)
  const meanTimeToRecoveryList = meanTimeToRecovery && meanTimeToRecoveryMapper(meanTimeToRecovery)
  const changeFailureRateList = changeFailureRate && changeFailureRateMapper(changeFailureRate)

  return {
    deploymentFrequencyList,
    meanTimeToRecoveryList,
    changeFailureRateList,
  }
}

export const formatDoraMetrics = ({
  leadTimeForChanges,
  deploymentFrequency,
  meanTimeToRecovery,
  changeFailureRate,
}: ReportResponseDTO) => {
  const leadTimeForChangesList = {
    title: 'Lead Time For Change',
    items: [
      {
        value: leadTimeForChanges?.avgLeadTimeForChanges.prLeadTime,
        subtitle: 'PR Lead Time',
      },
      {
        value: leadTimeForChanges?.avgLeadTimeForChanges.pipelineLeadTime,
        subtitle: 'Pipeline Lead Time',
      },
      {
        value: leadTimeForChanges?.avgLeadTimeForChanges.totalDelayTime,
        subtitle: 'Total Lead Time',
      },
    ],
  }
  const deploymentFrequencyList = {
    title: 'Deployment Frequency',
    items: [
      {
        value: deploymentFrequency?.avgDeploymentFrequency.deploymentFrequency,
        subtitle: 'Deployment Frequency(Deployments/Day)',
      },
    ],
  }

  const meanTimeToRecoveryList = {
    title: 'Mean Time To Recovery',
    items: [
      {
        value: meanTimeToRecovery?.avgMeanTimeToRecovery.timeToRecovery,
        subtitle: 'Deployment Frequency(Deployments/Day)',
      },
    ],
  }

  const changeFailureRateList = {
    title: 'Change Failure Rate',
    items: [
      {
        value: changeFailureRate?.avgChangeFailureRate.failureRate,
        extraValue: `${changeFailureRate?.avgChangeFailureRate.totalFailedTimes}/${changeFailureRate?.avgChangeFailureRate.totalTimes}`,
        subtitle: 'Fallurerate',
      },
    ],
  }

  return [leadTimeForChangesList, deploymentFrequencyList, meanTimeToRecoveryList, changeFailureRateList]
}
