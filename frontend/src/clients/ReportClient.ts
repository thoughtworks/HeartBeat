import { HttpClient } from '@src/clients/Httpclient'
import { AxiosError, HttpStatusCode } from 'axios'
import { InternalServerException } from '@src/exceptions/InternalServerException'

export class ReportClient extends HttpClient {
  reportResponse = {
    velocity: {
      velocityForSP: '2',
      velocityForCards: '2',
    },
  }

  generateReporter = async () => {
    try {
      await this.axiosInstance.post(`/report`).then((res) => {
        this.reportResponse = res.data
      })
    } catch (e) {
      const code = (e as AxiosError).response?.status
      if (code === HttpStatusCode.InternalServerError) {
        throw new InternalServerException('report', 'Internal server error')
      }
    }
    return {
      response: this.reportResponse,
    }
  }
}

export const reportClient = new ReportClient()
