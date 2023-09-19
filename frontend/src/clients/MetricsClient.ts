import { HttpClient } from '@src/clients/Httpclient'
import { HttpStatusCode } from 'axios'

export interface getStepsParams {
  pipelineName: string
  repository: string
  orgName: string
  startTime: number
  endTime: number
}

export class MetricsClient extends HttpClient {
  steps: string[] = []
  haveStep = true
  branches: string[] = []

  getSteps = async (
    params: getStepsParams,
    organizationId: string,
    buildId: string,
    pipelineType: string,
    token: string
  ) => {
    this.steps = []
    this.haveStep = true
    const result = await this.axiosInstance.get(
      `/pipelines/${pipelineType}/${organizationId}/pipelines/${buildId}/steps`,
      {
        headers: {
          Authorization: `${token}`,
        },
        params,
      }
    )
    result.status === HttpStatusCode.NoContent ? (this.haveStep = false) : (this.steps = result.data.steps)
    this.branches = result.status === HttpStatusCode.NoContent ? [] : (this.branches = result.data.branches)
    return {
      response: this.steps,
      haveStep: this.haveStep,
      branches: this.branches,
    }
  }
}

export const metricsClient = new MetricsClient()
