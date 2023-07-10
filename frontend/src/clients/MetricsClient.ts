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
  isNoStep = false

  getSteps = async (
    params: getStepsParams,
    organizationId: string,
    buildId: string,
    pipelineType: string,
    token: string
  ) => {
    this.steps = []
    this.isNoStep = false
    const result = await this.axiosInstance.get(
      `/pipelines/${pipelineType}/${organizationId}/pipelines/${buildId}/steps`,
      {
        headers: {
          Authorization: `${token}`,
        },
        params,
      }
    )
    result.status === HttpStatusCode.NoContent ? (this.isNoStep = true) : (this.steps = result.data.steps)
    return {
      response: this.steps,
      isNoStep: this.isNoStep,
    }
  }
}

export const metricsClient = new MetricsClient()
