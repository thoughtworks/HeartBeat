import { HttpClient } from '@src/clients/Httpclient'

export class BoardClient extends HttpClient {
  public async get(path: string) {
    try {
      return await this.axiosInstance.get(path)
    } catch (e) {
      //TODO: handle error
      return e
    }
  }
}

export const boardClient = new BoardClient()
