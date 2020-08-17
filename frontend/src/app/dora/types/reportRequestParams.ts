import { TargetField } from './board';

export interface Deployment {
  orgId?: string;
  orgName?: string;
  id: string;
  name: string;
  step: string;
}

export interface PipelineParams {
  type: string;
  token: string;
  deployment: Deployment[];
}

export interface BoardParams {
  type: string;
  token: string;
  site: string;
  project: string;
  doneColumn: string;
  boardColumns: {
    name: string;
    value: string;
  };
  users: string[];
  targetFields: TargetField[];
  boardId: number;
}

export interface LeadTime {
  orgId?: string;
  orgName?: string;
  id: string;
  name: string;
  step: string;
  repository: string;
}

export interface CodebaseParams {
  type: string;
  token: string;
  leadTime: LeadTime[];
}
