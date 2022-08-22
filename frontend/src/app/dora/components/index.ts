import { ClassificationComponent } from './config-stepper/metrics/metrics-board/classification/classification.component';
import { HomeComponent } from './home/home.component';
import { ConfigurationComponent } from './config-stepper/configuration/configuration.component';
import { MetricsComponent } from './config-stepper/metrics/metrics.component';
import { ConfigStepperComponent } from './config-stepper/config-stepper.component';
import { MetricSourceComponent } from './config-stepper/configuration/metric-source/metric-source.component';
import { PipelineItemComponent } from './config-stepper/metrics/metric-pipeline/pipeline-item/pipeline-item.component';
import { ExportComponent } from './config-stepper/reports/reports.component';
import { CycleItemComponent } from './config-stepper/metrics/metrics-board/cycle-time/cycle-item/cycle-item.component';
import { CrewsComponent } from './config-stepper/metrics/metrics-board/crews/crews.component';
import { CollectionComponent } from './config-stepper/configuration/collection/collection.component';
import { MetricPipelineComponent } from './config-stepper/metrics/metric-pipeline/metric-pipeline.component';
import { CycleTimeComponent } from './config-stepper/metrics/metrics-board/cycle-time/cycle-time.component';
import { VelocityReportComponent } from './config-stepper/reports/velocity/velocity.component';
import { CycleTimeReportComponent } from './config-stepper/reports/cycle-time/cycle-time.component';
import { DeploymentFrequencyReportComponent } from './config-stepper/reports/deployment-frequency/deployment-frequency.component';
import { LeadTimeReportComponent } from './config-stepper/reports/lead-time/lead-time.component';
import { FailureRateReportComponent } from './config-stepper/reports/failure-rate/failure-rate.component';
import { MeanTimeToRecoveryComponent } from './config-stepper/reports/mean-time-to-recovery/mean-time-to-recovery.component';
import { ClassificationReportComponent } from './config-stepper/reports/classification/classification.component';
import { ExportCsvComponent } from './config-stepper/reports/export-csv/export-csv.component';
import { DoneColumnsComponent } from './config-stepper/metrics/metrics-board/done-columns/done-columns.component';
import { WarningMessageComponent } from './config-stepper/metrics/warning-message/warning-message.component';
import { BlockReasonPercentageReportComponent } from './config-stepper/reports/block-reason-percentage/block-reason-percentage.component';
import { AverageCycleTimeReportComponent } from './config-stepper/reports/average-cycle-time/average-cycle-time.component';
import { ThroughputReportComponent } from './config-stepper/reports/throughput/throughput.component';
import { TimeAllocationReportComponent } from './config-stepper/reports/time-allocation/time-allocation.component';
import { ExportExcelComponent } from './config-stepper/reports/export-excel/export-excel.component';

export const components: any[] = [
  HomeComponent,
  ConfigStepperComponent,
  ConfigurationComponent,
  MetricSourceComponent,
  MetricsComponent,
  PipelineItemComponent,
  ExportComponent,
  CycleItemComponent,
  CrewsComponent,
  CollectionComponent,
  MetricPipelineComponent,
  CycleTimeComponent,
  VelocityReportComponent,
  CycleTimeReportComponent,
  DeploymentFrequencyReportComponent,
  LeadTimeReportComponent,
  FailureRateReportComponent,
  ClassificationComponent,
  CycleTimeComponent,
  ClassificationReportComponent,
  ExportCsvComponent,
  DoneColumnsComponent,
  WarningMessageComponent,
  MeanTimeToRecoveryComponent,
  BlockReasonPercentageReportComponent,
  AverageCycleTimeReportComponent,
  ThroughputReportComponent,
  TimeAllocationReportComponent,
  ExportExcelComponent,
];
