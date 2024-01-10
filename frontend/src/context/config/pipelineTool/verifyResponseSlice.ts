export interface IPipelineToolVerifyResponse {
  pipelineList: pipeline[];
  pipelineCrews: string[];
}

export interface pipeline {
  id: string;
  name: string;
  orgId: string;
  orgName: string;
  repository: string;
  steps: string[];
  branches: string[];
}

export const initialPipelineToolVerifiedResponseState: IPipelineToolVerifyResponse = {
  pipelineList: [],
  pipelineCrews: [],
};
