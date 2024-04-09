import { ReportDataWithThreeColumns, ReportDataWithTwoColumns } from '@src/hooks/reportMapper/reportUIDataStructure';
import { Nullable } from '@src/utils/types';

export interface ReportResponseDTO {
  velocity: Nullable<VelocityResponse>;
  cycleTime: Nullable<CycleTimeResponse>;
  rework: Nullable<ReworkTimeResponse>;
  classificationList: Nullable<ClassificationResponse[]>;
  deploymentFrequency: Nullable<DeploymentFrequencyResponse>;
  devMeanTimeToRecovery: Nullable<DevMeanTimeToRecoveryResponse>;
  leadTimeForChanges: Nullable<LeadTimeForChangesResponse>;
  devChangeFailureRate: Nullable<DevChangeFailureRateResponse>;
  exportValidityTime: Nullable<number>;
  boardMetricsCompleted: boolean | null;
  doraMetricsCompleted: boolean | null;
  overallMetricsCompleted: boolean;
  allMetricsCompleted: boolean;
  reportMetricsError: AllErrorResponse;
  isSuccessfulCreateCsvFile: boolean;
  [key: string]: unknown;
}

export interface VelocityResponse {
  velocityForSP: number;
  velocityForCards: number;
}

export interface AllErrorResponse {
  boardMetricsError: ErrorResponse | null;
  pipelineMetricsError: ErrorResponse | null;
  sourceControlMetricsError: ErrorResponse | null;
}

export interface ErrorResponse {
  status: number;
  message: string;
}

export interface CycleTimeResponse {
  totalTimeForCards: number;
  averageCycleTimePerCard: number;
  averageCycleTimePerSP: number;
  swimlaneList: Array<Swimlane>;
}

export interface ReworkTimeResponse {
  totalReworkTimes: number;
  reworkState: string;
  fromAnalysis: number | null;
  fromInDev: number | null;
  fromBlock: number | null;
  fromFlag: number | null;
  fromWaitingForTesting: number | null;
  fromTesting: number | null;
  fromReview: number | null;
  fromDone: number | null;
  totalReworkCards: number;
  reworkCardsRatio: number;
  throughput: number;
}

export interface ClassificationResponse {
  fieldName: string;
  pairList: Array<ClassificationNameValuePair>;
}

export interface DeploymentFrequencyResponse {
  avgDeploymentFrequency: AVGDeploymentFrequency;
  deploymentFrequencyOfPipelines: DeploymentFrequencyOfPipeline[];
}

export interface LeadTimeForChangesResponse {
  leadTimeForChangesOfPipelines: Array<LeadTimeOfPipeline>;
  avgLeadTimeForChanges: AvgLeadTime;
}

export interface DevChangeFailureRateResponse {
  avgDevChangeFailureRate: AvgFailureRate;
  devChangeFailureRateOfPipelines: FailureRateOfPipeline[];
}

export interface Swimlane {
  optionalItemName: string;
  averageTimeForSP: number;
  averageTimeForCards: number;
  totalTime: number;
}

export interface AVGDeploymentFrequency {
  name: string;
  step?: string;
  deploymentFrequency: number;
}

export interface DeploymentDateCount {
  date: string;
  count: number;
}

export interface DeploymentFrequencyOfPipeline {
  name: string;
  step: string;
  deploymentFrequency: number;
  dailyDeploymentCounts: DeploymentDateCount[];
}

export interface LeadTimeOfPipeline {
  name: string;
  step: string;
  prLeadTime: number;
  pipelineLeadTime: number;
  totalDelayTime: number;
}

export interface AvgLeadTime {
  name: string;
  step?: string;
  prLeadTime: number;
  pipelineLeadTime: number;
  totalDelayTime: number;
}

export interface FailureRateOfPipeline {
  name: string;
  step: string;
  failedTimesOfPipeline: number;
  totalTimesOfPipeline: number;
  failureRate: number;
}

export interface AvgFailureRate {
  name: string;
  step?: string;
  totalTimes: number;
  totalFailedTimes: number;
  failureRate: number;
}

export interface DevMeanTimeToRecoveryOfPipeline {
  name: string;
  step: string;
  timeToRecovery: number;
}

export interface AvgDevMeanTimeToRecovery {
  name: string;
  timeToRecovery: number;
}

export interface DevMeanTimeToRecoveryResponse {
  avgDevMeanTimeToRecovery: AvgDevMeanTimeToRecovery;
  devMeanTimeToRecoveryOfPipelines: DevMeanTimeToRecoveryOfPipeline[];
}

export interface ClassificationNameValuePair {
  name: string;
  value: number;
}

export interface ReportCallbackResponse {
  callbackUrl: string;
  interval: number;
}

export interface ReportResponse {
  velocityList?: ReportDataWithTwoColumns[] | null;
  cycleTimeList?: ReportDataWithTwoColumns[] | null;
  reworkList?: ReportDataWithTwoColumns[] | null;
  classification?: ReportDataWithThreeColumns[] | null;
  deploymentFrequencyList?: ReportDataWithThreeColumns[] | null;
  devMeanTimeToRecoveryList?: ReportDataWithThreeColumns[] | null;
  leadTimeForChangesList?: ReportDataWithThreeColumns[] | null;
  devChangeFailureRateList?: ReportDataWithThreeColumns[] | null;
  exportValidityTimeMin?: number | null;
}
