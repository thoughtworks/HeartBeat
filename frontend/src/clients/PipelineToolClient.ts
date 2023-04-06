import { HttpClient } from '@src/clients/Httpclient'

export interface getVerifyPipelineToolParams {
  type: string
  token: string
  startTime: string | null
  endTime: string | null
}

export class PipelineToolClient extends HttpClient {
  isPipelineToolVerified = false
  response = {}

  verifyPipelineTool = async (params: getVerifyPipelineToolParams) => {
    try {
      const result = await this.axiosInstance.get(`/pipelines/${params.type}`, { params: { ...params } })
      this.handlePipelineToolVerifySucceed(result.data)
    } catch (e) {
      this.isPipelineToolVerified = false
      throw e
    }
    return {
      response: this.response,
      isPipelineToolVerified: this.isPipelineToolVerified,
    }
  }
  handlePipelineToolVerifySucceed = (res: object) => {
    this.isPipelineToolVerified = true
    this.response = res
  }
}

export const pipelineToolClient = new PipelineToolClient()
