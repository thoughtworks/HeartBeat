import { HttpClient } from '@src/clients/Httpclient'
import axios, { HttpStatusCode, isAxiosError } from 'axios'
import { PipelineRequestDTO } from '@src/clients/pipeline/dto/request'

interface IGetPipelineToolInfoResult {
  code: number | undefined | null
  data: any
  errorTitle: string
  errorMessage: string
}

const errorCaseTextMapping: { [key: string]: string } = {
  '204': 'No pipeline!',
  '400': 'Invalid input!',
  '401': 'Unauthorized request!',
  '403': 'Forbidden request!',
  '404': 'Not found!',
}

export class PipelineToolClient extends HttpClient {
  isPipelineToolVerified = false
  response = {}

  verifyPipelineTool = async (params: PipelineRequestDTO) => {
    try {
      const result = await this.axiosInstance.post(`/pipelines/${params.type}/verify`, params)
      if (result.status === HttpStatusCode.Ok) {
        this.isPipelineToolVerified = true
      }
    } catch (e) {
      this.isPipelineToolVerified = false
      throw e
    }
    return {
      isPipelineToolVerified: this.isPipelineToolVerified,
    }
  }

  getPipelineToolInfo = async (params: PipelineRequestDTO) => {
    const result: IGetPipelineToolInfoResult = {
      code: null,
      data: {},
      errorTitle: '',
      errorMessage: '',
    }

    try {
      const response = await this.axiosInstance.post(`/pipelines/${params.type}/info`, params)
      if (response.status === HttpStatusCode.Ok) {
        result.data = response.data
      } else if (response.status === HttpStatusCode.NoContent) {
        result.errorTitle = errorCaseTextMapping[response.status]
        result.errorMessage =
          'Please go back to the previous page and change your pipeline token with correct access permission.'
      }
      result.code = response.status
    } catch (e) {
      if (isAxiosError(e)) {
        result.code = e.response?.status
        result.errorTitle = errorCaseTextMapping[`${e.response?.status}`] || 'Unknown error'
      } else {
        result.errorTitle = 'Unknown error'
      }
      result.errorMessage =
        'Please go back to the previous page and change your pipeline token with correct access permission.'
    }

    return result
  }
}

export const pipelineToolClient = new PipelineToolClient()
