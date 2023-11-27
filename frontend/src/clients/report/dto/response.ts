export interface ReportResponseDTO {
  velocity?: VelocityResponse
  cycleTime?: CycleTimeResponse
  deploymentFrequency?: DeploymentFrequencyResponse
  meanTimeToRecovery?: MeanTimeToRecoveryResponse
  leadTimeForChanges?: LeadTimeForChangesResponse
  changeFailureRate?: ChangeFailureRateResponse
  classificationList?: Array<ClassificationResponse>
  exportValidityTime?: number
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
  items: DeploymentDateCount[]
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
