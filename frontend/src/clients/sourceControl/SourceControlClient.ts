import { HttpClient } from '@src/clients/HttpClient';
import { SourceControlRequestDTO } from '@src/clients/sourceControl/dto/request';

export class SourceControlClient extends HttpClient {
  isSourceControlVerify = false;
  response = {};

  getVerifySourceControl = async (params: SourceControlRequestDTO) => {
    try {
      const result = await this.axiosInstance.post('/source-control', params);
      this.handleSourceControlVerifySucceed(result.data);
    } catch (e) {
      this.isSourceControlVerify = false;
      throw e;
    }
    return {
      response: this.response,
      isSourceControlVerify: this.isSourceControlVerify,
    };
  };

  handleSourceControlVerifySucceed = (res: object) => {
    this.isSourceControlVerify = true;
    this.response = res;
  };
}

export const sourceControlClient = new SourceControlClient();
