import { HttpClient } from '@src/clients/Httpclient'
import { AxiosError } from 'axios'
import { BadRequestException } from '@src/exceptions/BadRequestException'
import { BadServerException } from '@src/exceptions/BasServerException'

export interface getVerifySourceControlParams {
  type: string
  token: string
}

export class SourceControlClient extends HttpClient {
  isSourceControlVerify = false
  response = {}

  getVerifySourceControl = async (params: getVerifySourceControlParams) => {
    try {
      const result = await this.axiosInstance
        .get('https://jsonplaceholder.typicode.com/posts', { params: { ...params } })
        .then((res) => res)
      // const result = await this.axiosInstance.get('/codebase/fetch/repos', { params: { ...params } }).then((res) => res)
      if (result.status === 200) {
        this.handleSourceControlVerifySucceed(result.data)
      }
    } catch (e) {
      this.isSourceControlVerify = false
      const code = (e as AxiosError).response?.status
      if (code === 404) {
        throw new BadRequestException(params.type, 'Bad Request')
      }
      if (code === 500) {
        throw new BadServerException(params.type, 'Bad Server')
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
