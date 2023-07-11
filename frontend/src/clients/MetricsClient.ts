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
    return {
      response: this.steps,
      haveStep: this.haveStep,
    }
  }
}

export const metricsClient = new MetricsClient()
