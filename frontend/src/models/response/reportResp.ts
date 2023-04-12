export interface ReportResp {
  velocity?: VelocityResp
  cycleTime?: CycleTimeResp
  deploymentFrequency?: DeploymentFrequency
  leadTimeForChanges?: LeadTime
  changeFailureRate?: FailureRate
  classification?: Array<ClassificationResp>
  hasExportCsvData?: string
  meanTimeToRecovery?: MeanTimeToRecovery
}

export interface VelocityResp {
  velocityForSP: string
  velocityForCards: string
}

export interface Swimlane {
  optionalItemName: string
  averageTimeForSP: string
  averageTimeForCards: string
  totalTime: string
}

export interface CycleTimeResp {
  totalTimeForCards: number
  averageCircleTimePerCard: string
  averageCycleTimePerSP: string
  swimlaneList: Array<Swimlane>
}

export interface AVGDeploymentFrequency {
  name: string
  step: string
  deploymentFrequency: string
}

export interface DeploymentDateCount {
  date: string
  count: number
}

export interface DeploymentFrequencyOfPipeline {
  name: string
  step: string
  deploymentFrequency: string
  items: DeploymentDateCount[]
}

export interface DeploymentFrequency {
  avgDeploymentFrequency: AVGDeploymentFrequency
  deploymentFrequencyOfPipelines: DeploymentFrequencyOfPipeline[]
}

export interface LeadTimeOfPipeline {
  name: string
  step: string
  mergeDelayTime: number
  pipelineDelayTime: number
  totalDelayTime: number
}

export interface AvgLeadTime {
  name: string
  step: string
  mergeDelayTime: number
  pipelineDelayTime: number
  totalDelayTime: number
}

export interface LeadTime {
  leadTimeForChangesOfPipelines: Array<LeadTimeOfPipeline>
  avgLeadTimeForChanges: AvgLeadTime
}

export interface FailureRateOfPipeline {
  name: string
  step: string
  failureRate: string
}

export interface AvgFailureRate {
  name: string
  step: string
  failureRate: string
}

export interface FailureRate {
  avgChangeFailureRate: AvgFailureRate
  changeFailureRateOfPipelines: FailureRateOfPipeline[]
}

export interface MeanTimeToRecoveryOfPipeline {
  name: string
  step: string
  timeToRecovery: number
}

export interface AvgMeanTimeToRecovery {
  name: string
  step: string
  timeToRecovery: string
}

export interface MeanTimeToRecovery {
  avgMeanTimeToRecovery: AvgMeanTimeToRecovery
  meanTimeRecoveryPipelines: MeanTimeToRecoveryOfPipeline[]
}

export interface Pair {
  name: string
  value: string
}

export interface ClassificationResp {
  fieldName: string
  pairs: Array<Pair>
}
