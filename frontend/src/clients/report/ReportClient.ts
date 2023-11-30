import { HttpClient } from '@src/clients/Httpclient'
import { ReportRequestDTO } from '@src/clients/report/dto/request'
import { ReportCallbackResponse } from '@src/clients/report/dto/response'

export class ReportClient extends HttpClient {
  reportCallbackResponse: ReportCallbackResponse = {
    status: 0,
    callbackURL: '',
    interval: 0,
  }
  reportResponse = {
    status: 0,
    velocity: {
      velocityForSP: 0,
      velocityForCards: 0,
    },
    cycleTime: {
      averageCycleTimePerCard: 0,
      averageCycleTimePerSP: 0,
      totalTimeForCards: 0,
      swimlaneList: [
        {
          optionalItemName: '',
          averageTimeForSP: 0,
          averageTimeForCards: 0,
          totalTime: 0,
        },
      ],
    },
    classificationList: [
      {
        fieldName: '',
        pairList: [],
      },
    ],
    deploymentFrequency: {
      avgDeploymentFrequency: {
        name: '',
        deploymentFrequency: 0,
      },
      deploymentFrequencyOfPipelines: [],
    },
    leadTimeForChanges: {
      leadTimeForChangesOfPipelines: [],
      avgLeadTimeForChanges: {
        name: '',
        prLeadTime: 1,
        pipelineLeadTime: 1,
        totalDelayTime: 1,
      },
    },
    changeFailureRate: {
      avgChangeFailureRate: {
        name: '',
        totalTimes: 0,
        totalFailedTimes: 0,
        failureRate: 0.0,
      },
      changeFailureRateOfPipelines: [],
    },
  }

  retrieveReport = async (params: ReportRequestDTO) => {
    await this.axiosInstance
      .post(`/reports`, params, {})
      .then((res) => {
        this.reportCallbackResponse = res.data
      })
      .catch((e) => {
        throw e
      })
    return {
      response: this.reportCallbackResponse,
    }
  }

  pollingReport = async (url: string) => {
    await this.axiosInstance
      .get(url)
      .then((res) => {
        this.reportResponse = res.data
      })
      .catch((e) => {
        throw e
      })
    return {
      response: this.reportResponse,
    }
  }
}

export const reportClient = new ReportClient()
