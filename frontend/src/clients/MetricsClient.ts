import { HttpClient } from '@src/clients/Httpclient'

export interface getStepsParams {
  pipelineName: string
  repository: string
  orgName: string
  startTime: number
  endTime: number
}

export class MetricsClient extends HttpClient {
  steps: string[] = []

  getSteps = async (
    params: getStepsParams,
    organizationId: string,
    buildId: string,
    pipelineType: string,
    token: string
  ) => {
    await this.axiosInstance
      .get(`/pipelines/${pipelineType}/${organizationId}/pipelines/${buildId}/steps`, {
        headers: {
          Authorization: `${token}`,
        },
        params,
      })
      .then((res) => {
        this.steps = res.data.steps
      })
      .catch((e) => {
        throw e
      })
    return this.steps
  }
}

export const metricsClient = new MetricsClient()
