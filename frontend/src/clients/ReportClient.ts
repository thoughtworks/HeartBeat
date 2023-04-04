import { HttpClient } from '@src/clients/Httpclient'
import { AxiosError, HttpStatusCode } from 'axios'
import { InternalServerException } from '@src/exceptions/InternalServerException'
import { reportResponseProps } from '@src/types/reportResponse'

export class ReportClient extends HttpClient {
  reportResponse: reportResponseProps = {
    velocity: {
      velocityForSP: '',
      velocityForCards: '',
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
