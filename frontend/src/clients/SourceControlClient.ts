import { HttpClient } from '@src/clients/Httpclient'

export interface getVerifySourceControlParams {
  type: string
  token: string
}

export class SourceControlClient extends HttpClient {
  isSourceControlVerify = false
  response = {}

  getVerifySourceControl = async (params: getVerifySourceControlParams) => {
    try {
      const result = await this.axiosInstance.get('/codebase/fetch/repos', { params: { ...params } }).then((res) => res)
      if (result.status === 200) {
        this.handleSourceControlVerifySucceed(result.data)
      }
    } catch (e) {
      // TODO: handle error
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
