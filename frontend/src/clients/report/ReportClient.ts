import { ReportCallbackResponse, ReportResponseDTO } from '@src/clients/report/dto/response';
import { ReportRequestDTO } from '@src/clients/report/dto/request';
import { HttpClient } from '@src/clients/HttpClient';

export interface IPollingRes {
  status: number;
  response: ReportResponseDTO;
}

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
    rework: {
      totalReworkTimes: 0,
      reworkState: 'Done',
      fromAnalysis: 0,
      fromInDev: 0,
      fromBlock: 0,
      fromWaitingForTesting: 0,
      fromTesting: 0,
      fromReview: 0,
      fromDone: 0,
      totalReworkCards: 0,
      throughput: 1,
      reworkCardsRatio: 0,
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
    devChangeFailureRate: {
      avgDevChangeFailureRate: {
        name: '',
        totalTimes: 0,
        totalFailedTimes: 0,
        failureRate: 0.0,
      },
      devChangeFailureRateOfPipelines: [],
    },
    reportMetricsError: {
      boardMetricsError: null,
      pipelineMetricsError: null,
      sourceControlMetricsError: null,
    },
    devMeanTimeToRecovery: null,
    exportValidityTime: null,
    boardMetricsCompleted: false,
    doraMetricsCompleted: false,
    overallMetricsCompleted: false,
    allMetricsCompleted: false,
    isSuccessfulCreateCsvFile: false,
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
    return this.reportCallbackResponse;
  };

  polling = async (url: string): Promise<IPollingRes> => {
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
