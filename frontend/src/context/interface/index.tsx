export interface PipelineSetting {
  id: number;
  organization: string;
  pipelineName: string;
  step: string;
  branches: string[];
}
