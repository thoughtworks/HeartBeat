export interface Pipeline {
  name: string;
  id: string;
  orgId?: string;
  orgName?: string;
  repository: string;
  steps: string[];
}

export interface Org {
  orgName: string;
  orgId: string;
}

export interface PipelineEqual {
  id: string;
  step: string;
}
