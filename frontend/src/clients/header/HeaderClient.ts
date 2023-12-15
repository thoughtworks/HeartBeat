import { HttpClient } from '@src/clients/Httpclient'
import { VersionResponseDTO } from '@src/clients/header/dto/request'

export class HeaderClient extends HttpClient {
  response: VersionResponseDTO = {
    version: '',
  }

  getVersion = async () => {
    await this.axiosInstance
      .get(`/version`)
      .then((res) => {
        this.response = res.data
      })
      .catch((e) => {
        throw e
      })
    return this.response.version
  }
}

export const headerClient = new HeaderClient()
