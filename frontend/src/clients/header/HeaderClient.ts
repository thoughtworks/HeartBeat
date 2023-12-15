import { HttpClient } from '@src/clients/Httpclient'

export class HeaderClient extends HttpClient {
  response: object = {}

  getVersion = async () => {
    try {
      this.response = await this.axiosInstance.get(`/version`)
    } catch (e) {
      this.response = {}
      throw e
    }
    return this.response?.data.version
  }
}

export const headerClient = new HeaderClient()
