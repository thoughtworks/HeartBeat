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
    classification: [
      {
        fieldName: '',
        pairs: [],
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
        failureRate: '',
      },
      changeFailureRateOfPipelines: [],
    },
  }

  report = async (params: ReportRequestDTO) => {
    await this.axiosInstance
      .post(`/report`, params, {
        headers: {
          'content-type': 'application/json',
        },
      })
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
