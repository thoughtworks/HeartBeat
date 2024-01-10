import { HttpClient } from '@src/clients/Httpclient';
import { PipelineRequestDTO } from '@src/clients/pipeline/dto/request';

export class PipelineToolClient extends HttpClient {
  isPipelineToolVerified = false;
  response = {};

  verifyPipelineTool = async (params: PipelineRequestDTO) => {
    try {
      const result = await this.axiosInstance.post(`/pipelines/${params.type}`, params);
      this.handlePipelineToolVerifySucceed(result.data);
    } catch (e) {
      this.isPipelineToolVerified = false;
      throw e;
    }
    return {
      response: this.response,
      isPipelineToolVerified: this.isPipelineToolVerified,
    };
  };
  handlePipelineToolVerifySucceed = (res: object) => {
    this.isPipelineToolVerified = true;
    this.response = res;
  };
}

export const pipelineToolClient = new PipelineToolClient();
