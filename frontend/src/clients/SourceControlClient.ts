import { HttpClient } from '@src/clients/Httpclient'

export interface getVerifySourceControlParams {
  type: string
  token: string
  startTime: string | number | null
  endTime: string | number | null
}

export class SourceControlClient extends HttpClient {
  isSourceControlVerify = false
  response = {}

  getVerifySourceControl = async (params: getVerifySourceControlParams) => {
    try {
      const result = await this.axiosInstance.get('/source-control', { params: { ...params } })
      this.handleSourceControlVerifySucceed(result.data)
    } catch (e) {
      this.isSourceControlVerify = false
      throw e
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
