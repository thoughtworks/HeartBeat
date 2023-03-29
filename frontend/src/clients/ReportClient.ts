import { HttpClient } from '@src/clients/Httpclient'
import { AxiosError, HttpStatusCode } from 'axios'
import { BadRequestException } from '@src/exceptions/BadRequestException'
import { NotFoundException } from '@src/exceptions/NotFoundException'
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
      // await this.axiosInstance.post(`/report`).then((res) => res)
      await this.axiosInstance.post(`http://54.222.132.169:4323/api/v1/report`).then((res) => {
        this.reportResponse = res.data
      })
    } catch (e) {
      const code = (e as AxiosError).response?.status
      if (code === HttpStatusCode.BadRequest) {
        throw new BadRequestException('report', 'Please reconfirm the input')
      }
      if (code === HttpStatusCode.Unauthorized) {
        throw new NotFoundException('report', 'Token is incorrect')
      }
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
