import { pipelineToolClient } from '@src/clients/PipelineToolClient'

export class PipeLineToolService {
  verifyPipelineTool = async () => {
    try {
      return await pipelineToolClient.post('/pipeline/fetch')
    } catch (e) {
      //TODO: handle error
    }
  }
}

export const pipeLineToolService = new PipeLineToolService()
