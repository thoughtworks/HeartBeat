import { HttpClient } from '@src/clients/Httpclient'

export class PipelineToolClient extends HttpClient {
  verifyPipelineTool = async () => {
    try {
      return await this.axiosInstance.post('/pipeline/fetch').then((res) => res)
    } catch (error) {
      throw new Error('error')
    }
  }
}

export const pipelineToolClient = new PipelineToolClient()
