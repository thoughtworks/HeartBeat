import { HttpClient } from '@src/clients/Httpclient'
import { VersionResponseDTO } from '@src/clients/header/dto/request'

export class HeaderClient extends HttpClient {
  response: VersionResponseDTO

  getVersion = async () => {
    try {
      this.response = await this.axiosInstance.get(`/version`)
    } catch (e) {
      this.response = {
        data: {
          version: '',
        },
      }
      throw e
    }
    return this.response?.data.version
  }
}

export const headerClient = new HeaderClient()
