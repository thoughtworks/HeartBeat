import { HttpClient } from '@src/clients/HttpClient.base';
import { HttpStatusCode } from 'axios';

export interface getStepsParams {
  pipelineName: string;
  repository: string;
  orgName: string;
  startTime: number;
  endTime: number;
}

export class MetricsClient extends HttpClient {
  steps: string[] = [];
  haveStep = true;
  branches: string[] = [];
  pipelineCrews: string[] = [];

  getSteps = async (
    params: getStepsParams,
    organizationId: string,
    buildId: string,
    pipelineType: string,
    token: string
  ) => {
    this.steps = [];
    this.haveStep = true;
    const result = await this.axiosInstance.get(
      `/pipelines/${pipelineType}/${organizationId}/pipelines/${buildId}/steps`,
      {
        headers: {
          Authorization: `${token}`,
        },
        params,
      }
    );
    if (result.status === HttpStatusCode.NoContent) {
      this.haveStep = false;
    } else {
      this.steps = result.data.steps;
      this.haveStep = true;
    }
    this.branches = result.status === HttpStatusCode.NoContent ? [] : result.data.branches;
    this.pipelineCrews = result.status === HttpStatusCode.NoContent ? [] : result.data.pipelineCrews;
    return {
      response: this.steps,
      haveStep: this.haveStep,
      branches: this.branches,
      pipelineCrews: this.pipelineCrews,
    };
  };
}

export const metricsClient = new MetricsClient();
