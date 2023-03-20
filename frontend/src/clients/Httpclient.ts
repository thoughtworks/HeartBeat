import axios, { AxiosInstance } from 'axios'

export class HttpClient {
  protected httpTimeout = 20000
  protected axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: '/api/v1',
      timeout: this.httpTimeout,
    })
  }
}
