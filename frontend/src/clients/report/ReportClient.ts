import { HttpClient } from '@src/clients/HttpClient.base';
import { ReportRequestDTO } from '@src/clients/report/dto/request';
import { ReportCallbackResponse, ReportResponseDTO } from '@src/clients/report/dto/response';

export class ReportClient extends HttpClient {
  status = 0;
  reportCallbackResponse: ReportCallbackResponse = {
    callbackUrl: '',
    interval: 0,
  };
  reportResponse: ReportResponseDTO = {
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
    reportMetricsError: {
      boardMetricsError: null,
      pipelineMetricsError: null,
      sourceControlMetricsError: null,
    },
    meanTimeToRecovery: null,
    exportValidityTime: null,
    boardMetricsCompleted: false,
    pipelineMetricsCompleted: false,
    sourceControlMetricsCompleted: false,
    allMetricsCompleted: false,
  };

  retrieveByUrl = async (params: ReportRequestDTO, url: string) => {
    await this.axiosInstance
      .post(url, params, {})
      .then((res) => {
        this.reportCallbackResponse = res.data;
      })
      .catch((e) => {
        throw e;
      });
    return {
      response: this.reportCallbackResponse,
    };
  };

  polling = async (url: string) => {
    await this.axiosInstance
      .get(url)
      .then((res) => {
        this.status = res.status;
        this.reportResponse = res.data;
      })
      .catch((e) => {
        throw e;
      });
    return {
      status: this.status,
      response: this.reportResponse,
    };
  };
}

export const reportClient = new ReportClient();
