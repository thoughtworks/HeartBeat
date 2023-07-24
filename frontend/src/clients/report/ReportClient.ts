import { HttpClient } from '@src/clients/Httpclient'
import { ReportRequestDTO } from '@src/clients/report/dto/request'

export class ReportClient extends HttpClient {
  reportResponse = {
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
        mergeDelayTime: 1,
        pipelineDelayTime: 1,
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

  report = async (params: ReportRequestDTO) => {
    const res = await this.axiosInstance.post(`/reports`, params, {})
    this.reportResponse = res.data
    return {
      response: this.reportResponse,
    }
  }
}

export const reportClient = new ReportClient()
