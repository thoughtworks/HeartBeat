import { DeploymentDateCount } from './reportResponse';
import Step from '../models/buildkiteStepParams';

export interface Report {
  name: string;
  value: string;
}

export interface PipelineReport {
  pipeline: string;
  name: string;
  step: Step;
  value: string;
  items?: DeploymentDateCount[] | undefined;
}

export interface ClassificationReport {
  fieldName: string;
  subTitle: string;
  value: string;
}

export interface Reports {
  name: string;
  items: Array<Report>;
}
