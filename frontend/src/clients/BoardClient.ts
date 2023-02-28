import { HttpClient } from '@src/clients/Httpclient'

export class BoardClient extends HttpClient {
  getVerifyBoard = async () => {
    try {
      return await this.axiosInstance.get('/kanban/verify').then((res) => res)
    } catch (error) {
      throw new Error('error')
    }
  }
}

export const boardClient = new BoardClient()
