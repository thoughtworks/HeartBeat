export interface IPipelineToolVerifyResponse {
  pipelineList: {
    id: string
    name: string
    orgId: string
    orgName: string
    repository: string
    steps: string[]
  }[]
}

export const initialPipelineToolVerifiedResponseState: IPipelineToolVerifyResponse = {
  pipelineList: [],
}
