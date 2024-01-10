import { HttpClient } from '@src/clients/Httpclient'
import axios, { HttpStatusCode } from 'axios'
import { isHeartBeatException } from '@src/exceptions'
import { IHeartBeatException } from '@src/exceptions/ExceptionType'
import { PipelineRequestDTO } from '@src/clients/pipeline/dto/request'
import { IPipelineInfoResponseDTO } from '@src/clients/pipeline/dto/response'
import { ERROR_CASE_TEXT_MAPPING, PIPELINE_TOOL_ERROR_MESSAGE, UNKNOWN_ERROR_TITLE } from '@src/constants/resources'

export interface IGetPipelineToolInfoResult {
  code: number | undefined | null
  data?: IPipelineInfoResponseDTO
  errorTitle: string
  errorMessage: string
}

export class PipelineToolClient extends HttpClient {
  isPipelineToolVerified = false
  response = {}

  verifyPipelineTool = async (params: PipelineRequestDTO) => {
    try {
      const result = await this.axiosInstance.post(`/pipelines/${params.type}/verify`, params)
      this.isPipelineToolVerified = true
    } catch (e) {
      this.isPipelineToolVerified = false
      console.error(`Failed to verify ${params.type} token`, e)
      throw e
    }
    return {
      isPipelineToolVerified: this.isPipelineToolVerified,
    }
  }

  getPipelineToolInfo = async (params: PipelineRequestDTO) => {
    const result: IGetPipelineToolInfoResult = {
      code: null,
      data: undefined,
      errorTitle: '',
      errorMessage: '',
    }

    try {
      const response = await this.axiosInstance.post(`/pipelines/${params.type}/info`, params)
      if (response.status === HttpStatusCode.Ok) {
        result.data = response.data as IPipelineInfoResponseDTO
      } else if (response.status === HttpStatusCode.NoContent) {
        result.errorTitle = ERROR_CASE_TEXT_MAPPING[response.status]
        result.errorMessage = PIPELINE_TOOL_ERROR_MESSAGE
      }
      result.code = response.status
    } catch (e) {
      console.error(`Failed to get pipeline tool info for ${params.type}`, e)
      if (isHeartBeatException(e)) {
        const exception = e as IHeartBeatException
        result.code = exception.code
        result.errorTitle = ERROR_CASE_TEXT_MAPPING[`${exception.code}`] || UNKNOWN_ERROR_TITLE
      } else {
        result.errorTitle = UNKNOWN_ERROR_TITLE
      }
      result.errorMessage = PIPELINE_TOOL_ERROR_MESSAGE
    }

    return result
  }
}

export const pipelineToolClient = new PipelineToolClient()
