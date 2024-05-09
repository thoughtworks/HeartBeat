export interface IPipelineToolVerifyResponse {
  pipelineList: IPipeline[];
}

export interface IPipeline {
  id: string;
  name: string;
  orgId: string;
  orgName: string;
  repository: string;
  steps: string[];
  branches: string[];
  crews: string[];
}

export const initialPipelineToolVerifiedResponseState: IPipelineToolVerifyResponse = {
  pipelineList: [],
};
