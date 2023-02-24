import { HttpClient } from '@src/clients/Httpclient'

export class PipelineToolClient extends HttpClient {
  public async post(path: string) {
    try {
      return await this.axiosInstance.post(path)
    } catch (e) {
      //TODO: handle error
      return e
    }
  }
}

export const pipelineToolClient = new PipelineToolClient()
