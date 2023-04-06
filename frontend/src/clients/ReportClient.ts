import { HttpClient } from '@src/clients/Httpclient'
import { ReportRes } from '@src/types/reportRes'

export interface ReportReq {
  metrics: string[]
  pipeline?: {
    type: string
    token: string
  }
  board?: {
    token: string
    type: string
    site: string
    email: string
    projectKey: string
    boardId: string
  }
  sourceControl?: {
    type: string
    token: string
  }
  calendarType: string
  startTime: string | null
  endTime: string | null
}

export class ReportClient extends HttpClient {
  reportResponse: ReportRes = {
    velocity: {
      velocityForSP: '',
      velocityForCards: '',
    },
  }

  report = async (params: ReportReq) => {
    // eslint-disable-next-line no-useless-catch
    try {
      await this.axiosInstance
        .post(
          `/report`,
          {},
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            params: params,
          }
        )
        .then((res) => {
          this.reportResponse = res.data
        })
    } catch (e) {
      throw e
    }
    return {
      response: this.reportResponse,
    }
  }
}

export const reportClient = new ReportClient()
