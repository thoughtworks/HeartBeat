import { Validators } from '@angular/forms';
import { Metric } from '../types/metric';
import { MetricsConfig } from '../types/metrics-config';
import { metricsConstant } from './constant';

export const metrics: Metric[] = [
  {
    name: 'Velocity',
    roles: ['board'],
  },
  {
    name: 'Cycle time',
    roles: ['board'],
  },
  {
    name: 'Classification',
    roles: ['board'],
  },
  {
    name: 'Lead time for changes',
    roles: ['sourceControl', 'pipelineTool'],
  },
  {
    name: 'Deployment frequency',
    roles: ['pipelineTool'],
  },
  {
    name: 'Change failure rate',
    roles: ['pipelineTool'],
  },
  {
    name: 'Mean time to recovery',
    roles: ['pipelineTool'],
  },
];

export const metricsConfig: MetricsConfig = {
  sourceControl: {
    Github: {
      token: [Validators.required],
    },
  },
  pipelineTool: {
    BuildKite: {
      token: [Validators.required],
    },
    GoCD: {
      token: [Validators.required],
    },
  },
  board: {
    Jira: {
      boardId: [Validators.required],
      token: [Validators.required],
      site: [Validators.required],
      email: [Validators.required, Validators.email],
      projectKey: [Validators.required],
    },
    'Classic Jira': {
      boardId: [Validators.required],
      token: [Validators.required],
      site: [Validators.required],
      email: [Validators.required, Validators.email],
      projectKey: [Validators.required],
    },
    Linear: {
      projectName: [Validators.required],
      token: [Validators.required],
    },
    // Trello: {
    //   token: [Validators.required],
    // },
  },
};

export const velocityReport = [
  {
    id: 'velocityForSP',
    name: 'Velocity(SP)',
  },
  {
    id: 'velocityForCards',
    name: 'Throughput(Cards Count)',
  },
];

export const cycleTimeReport = [
  {
    id: 'averageCycleTimePerSP',
    name: 'Average Cycle Time',
    unit: '(days/SP)',
  },
  {
    id: 'averageCircleTimePerCard',
    name: 'Average Cycle Time',
    unit: '(days/card)',
  },
  {
    id: 'totalTime',
    type: metricsConstant.inDevValue,
    name: 'Total Development Time / Total Cycle Time',
  },
  {
    id: 'totalTime',
    type: metricsConstant.testingValue,
    name: 'Total Testing Time / Total Cycle Time',
  },
  {
    id: 'totalTime',
    type: metricsConstant.waitingValue,
    name: 'Total Waiting Time / Total Cycle Time',
  },
  {
    id: 'totalTime',
    type: metricsConstant.blockValue,
    name: 'Total Block Time / Total Cycle Time',
  },
  {
    id: 'totalTime',
    type: metricsConstant.reviewValue,
    name: 'Total Review Time / Total Cycle Time',
  },
  {
    id: 'averageTimeForSP',
    type: metricsConstant.inDevValue,
    name: 'Average Development Time',
    unit: '(days/SP)',
  },
  {
    id: 'averageTimeForCards',
    type: metricsConstant.inDevValue,
    name: 'Average Development Time',
    unit: '(days/card)',
  },
  {
    id: 'averageTimeForSP',
    type: metricsConstant.testingValue,
    name: 'Average Testing Time',
    unit: '(days/SP)',
  },
  {
    id: 'averageTimeForCards',
    type: metricsConstant.testingValue,
    name: 'Average Testing Time',
    unit: '(days/card)',
  },
  {
    id: 'averageTimeForSP',
    type: metricsConstant.waitingValue,
    name: 'Average Waiting Time',
    unit: '(days/SP)',
  },
  {
    id: 'averageTimeForCards',
    type: metricsConstant.waitingValue,
    name: 'Average Waiting Time',
    unit: '(days/card)',
  },
  {
    id: 'averageTimeForSP',
    type: metricsConstant.blockValue,
    name: 'Average Block Time',
    unit: '(days/SP)',
  },
  {
    id: 'averageTimeForCards',
    type: metricsConstant.blockValue,
    name: 'Average Block Time',
    unit: '(days/card)',
  },
  {
    id: 'averageTimeForSP',
    type: metricsConstant.reviewValue,
    name: 'Average Review Time',
    unit: '(days/SP)',
  },
  {
    id: 'averageTimeForCards',
    type: metricsConstant.reviewValue,
    name: 'Average Review Time',
    unit: '(days/card)',
  },
];

export const deploymentFrequencyReport = [
  {
    id: 'deploymentFrequency',
    name: 'Deployment Frequency (deployments/day)',
  },
];

export const leadTimeReport = [
  {
    id: 'mergeDelayTime',
    name: 'mergeDelayTime',
  },
  {
    id: 'pipelineDelayTime',
    name: 'pipelineDelayTime',
  },
  {
    id: 'totalDelayTime',
    name: 'totalDelayTime',
  },
];

export const failureRateReport = [
  {
    id: 'failureRate',
    name: 'Failure Rate',
  },
];

export const meanTimeToRecoveryReport = [
  {
    id: 'timeToRecovery',
    name: 'Mean Time To Recovery',
  },
];

export const metricFormConfig = [
  {
    name: 'Velocity',
    displayItems: ['crews'],
  },
  {
    name: 'Cycle time',
    displayItems: ['crews', 'cycleTime'],
  },
  {
    name: 'Classification',
    displayItems: ['classification', 'crews'],
  },
  {
    name: 'Lead time for changes',
    displayItems: ['leadTime'],
  },
  {
    name: 'Deployment frequency',
    displayItems: ['deployment'],
  },
  {
    name: 'Change failure rate',
    displayItems: ['deployment'],
  },
  {
    name: 'Mean time to recovery',
    displayItems: ['deployment'],
  },
];
