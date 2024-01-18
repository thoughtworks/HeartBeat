import { HttpClient } from '@src/clients/HttpClient.base';
import { VersionResponseDTO } from '@src/clients/header/dto/request';

export class HeaderClient extends HttpClient {
  response: VersionResponseDTO = {
    version: '',
  };

  getVersion = async () => {
    try {
      const res = await this.axiosInstance.get(`/version`);
      this.response = res.data;
    } catch (e) {
      this.response = {
        version: '',
      };
      throw e;
    }
    return this.response.version;
  };
}

export const headerClient = new HeaderClient();
