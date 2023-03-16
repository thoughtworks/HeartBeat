import { HttpClient } from '@src/clients/Httpclient'
import { AxiosError, HttpStatusCode } from 'axios'
import { BadRequestException } from '@src/exceptions/BadRequestException'
import { InternalServerException } from '@src/exceptions/InternalServerException'
import { UnauthorizedException } from '@src/exceptions/UnauthorizedException'

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
      this.isPipelineToolVerified = true
      this.response = result
    } catch (e) {
      this.isPipelineToolVerified = false
      const code = (e as AxiosError).response?.status
      if (code === HttpStatusCode.BadRequest) {
        throw new BadRequestException(params.type, 'Bad request')
      }
      if (code === HttpStatusCode.Unauthorized) {
        throw new UnauthorizedException(params.type, 'Token is incorrect')
      }
      if (code === HttpStatusCode.InternalServerError) {
        throw new InternalServerException(params.type, 'Internal server error')
      }
    }
    return {
      response: this.response,
      isPipelineToolVerified: this.isPipelineToolVerified,
    }
  }
}

export const pipelineToolClient = new PipelineToolClient()
