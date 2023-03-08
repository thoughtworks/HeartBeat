import { HttpClient } from '@src/clients/Httpclient'
import { AxiosError } from 'axios'
import { BadRequestException } from '@src/exceptions/BadRequestException'
import { InternalServerException } from '@src/exceptions/InternalServerException'

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
      const result = await this.axiosInstance.post('/pipeline/fetch', { params: { ...params } }).then((res) => res)
      this.isPipelineToolVerified = true
      this.response = result
    } catch (e) {
      this.isPipelineToolVerified = false
      const code = (e as AxiosError).response?.status
      if (code === 404) {
        throw new BadRequestException(params.type, 'verify failed')
      }
      if (code === 500) {
        throw new InternalServerException(params.type, 'verify failed')
      }
    }
    return {
      response: this.response,
      isPipelineToolVerified: this.isPipelineToolVerified,
    }
  }
}

export const pipelineToolClient = new PipelineToolClient()
