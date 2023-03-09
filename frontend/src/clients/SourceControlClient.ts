import { HttpClient } from '@src/clients/Httpclient'
import { AxiosError } from 'axios'
import { BadRequestException } from '@src/exceptions/BadRequestException'
import { InternalServerException } from '@src/exceptions/InternalServerException'
import { UnauthorizedException } from '@src/exceptions/UnauthorizedException'

export interface getVerifySourceControlParams {
  type: string
  token: string
  startTime: string | null
  endTime: string | null
}

export class SourceControlClient extends HttpClient {
  isSourceControlVerify = false
  response = {}

  getVerifySourceControl = async (params: getVerifySourceControlParams) => {
    try {
      const result = await this.axiosInstance.get('/source-control', { params: { ...params } }).then((res) => res)
      this.handleSourceControlVerifySucceed(result.data)
    } catch (e) {
      this.isSourceControlVerify = false
      const code = (e as AxiosError).response?.status
      if (code === 400) {
        throw new BadRequestException(params.type, 'Bad request')
      }
      if (code === 401) {
        throw new UnauthorizedException(params.type, 'Token is incorrect')
      }
      if (code === 500) {
        throw new InternalServerException(params.type, 'Internal server error')
      }
    }
    return {
      response: this.response,
      isSourceControlVerify: this.isSourceControlVerify,
    }
  }

  handleSourceControlVerifySucceed = (res: object) => {
    this.isSourceControlVerify = true
    this.response = res
  }
}

export const sourceControlClient = new SourceControlClient()
