import { HttpClient } from '@src/clients/Httpclient'
import { VerifyPipelineReq } from '@src/models/request/pipelineReq'

export class PipelineToolClient extends HttpClient {
  isPipelineToolVerified = false
  response = {}

  verifyPipelineTool = async (params: VerifyPipelineReq) => {
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
