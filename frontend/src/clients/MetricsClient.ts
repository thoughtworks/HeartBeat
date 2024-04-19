import { HttpClient } from '@src/clients/HttpClient';
import { HttpStatusCode } from 'axios';

export interface IStepsParams {
  pipelineName: string;
  repository: string;
  orgName: string;
  startTime: number;
  endTime: number;
}

export interface IStepsRes {
  response: string[];
  haveStep: boolean;
  branches: string[];
  pipelineCrews: string[];
}

export class MetricsClient extends HttpClient {
  steps: string[] = [];
  haveStep = true;
  branches: string[] = [];
  pipelineCrews: string[] = [];

  getSteps = async (
    params: IStepsParams,
    organizationId: string,
    buildId: string,
    pipelineType: string,
    token: string,
  ): Promise<IStepsRes> => {
    this.steps = [];
    this.haveStep = true;
    const result = await this.axiosInstance.get(
      `/pipelines/${pipelineType}/${organizationId}/pipelines/${buildId}/steps`,
      {
        headers: {
          Authorization: `${token}`,
        },
        params,
      },
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
