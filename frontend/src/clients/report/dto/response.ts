import { ReportDataWithThreeColumns, ReportDataWithTwoColumns } from '@src/hooks/reportMapper/reportUIDataStructure'

export interface ReportResponseDTO {
  velocity: VelocityResponse | null
  cycleTime: CycleTimeResponse | null
  deploymentFrequency: DeploymentFrequencyResponse | null
  meanTimeToRecovery: MeanTimeToRecoveryResponse | null
  leadTimeForChanges: LeadTimeForChangesResponse | null
  changeFailureRate: ChangeFailureRateResponse | null
  classificationList: Array<ClassificationResponse> | null
  exportValidityTime: number | null
  boardMetricsReady: boolean | null
  pipelineMetricsReady: boolean | null
  sourceControlMetricsReady: boolean | null
  allMetricsReady: boolean
}

export interface VelocityResponse {
  velocityForSP: number
  velocityForCards: number
}

export interface CycleTimeResponse {
  totalTimeForCards: number
  averageCycleTimePerCard: number
  averageCycleTimePerSP: number
  swimlaneList: Array<Swimlane>
}

export interface ClassificationResponse {
  fieldName: string
  pairList: Array<ClassificationNameValuePair>
}

export interface DeploymentFrequencyResponse {
  avgDeploymentFrequency: AVGDeploymentFrequency
  deploymentFrequencyOfPipelines: DeploymentFrequencyOfPipeline[]
}

export interface LeadTimeForChangesResponse {
  leadTimeForChangesOfPipelines: Array<LeadTimeOfPipeline>
  avgLeadTimeForChanges: AvgLeadTime
}

export interface ChangeFailureRateResponse {
  avgChangeFailureRate: AvgFailureRate
  changeFailureRateOfPipelines: FailureRateOfPipeline[]
}

export interface Swimlane {
  optionalItemName: string
  averageTimeForSP: number
  averageTimeForCards: number
  totalTime: number
}

export interface AVGDeploymentFrequency {
  name: string
  step?: string
  deploymentFrequency: number
}

export interface DeploymentDateCount {
  date: string
  count: number
}

export interface DeploymentFrequencyOfPipeline {
  name: string
  step: string
  deploymentFrequency: number
  dailyDeploymentCounts: DeploymentDateCount[]
}

export interface LeadTimeOfPipeline {
  name: string
  step: string
  prLeadTime: number
  pipelineLeadTime: number
  totalDelayTime: number
}

export interface AvgLeadTime {
  name: string
  step?: string
  prLeadTime: number
  pipelineLeadTime: number
  totalDelayTime: number
}

export interface FailureRateOfPipeline {
  name: string
  step: string
  failedTimesOfPipeline: number
  totalTimesOfPipeline: number
  failureRate: number
}

export interface AvgFailureRate {
  name: string
  step?: string
  totalTimes: number
  totalFailedTimes: number
  failureRate: number
}

export interface MeanTimeToRecoveryOfPipeline {
  name: string
  step: string
  timeToRecovery: number
}

export interface AvgMeanTimeToRecovery {
  name: string
  timeToRecovery: number
}

export interface MeanTimeToRecoveryResponse {
  avgMeanTimeToRecovery: AvgMeanTimeToRecovery
  meanTimeRecoveryPipelines: MeanTimeToRecoveryOfPipeline[]
}

export interface ClassificationNameValuePair {
  name: string
  value: number
}

export interface ReportCallbackResponse {
  callbackUrl: string
  interval: number
}

export interface ReportResponse {
  velocityList?: ReportDataWithTwoColumns[]
  cycleTimeList?: ReportDataWithTwoColumns[]
  classification?: ReportDataWithThreeColumns[]
  deploymentFrequencyList?: ReportDataWithThreeColumns[]
  meanTimeToRecoveryList?: ReportDataWithThreeColumns[]
  leadTimeForChangesList?: ReportDataWithThreeColumns[]
  changeFailureRateList?: ReportDataWithThreeColumns[]
  exportValidityTimeMin?: number
}
