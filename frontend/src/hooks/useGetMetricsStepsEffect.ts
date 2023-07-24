import { useState } from 'react'
import { GET_STEPS_FAILED_MESSAGE } from '@src/constants'
import { getStepsParams, metricsClient } from '@src/clients/MetricsClient'
import { handleApiRequest } from '@src/hooks/HandleApiRequest/handleApiRequest'

export interface useGetMetricsStepsEffectInterface {
  getSteps: (
    params: getStepsParams,
    organizationId: string,
    buildId: string,
    pipelineType: string,
    token: string
  ) => Promise<
    | {
        haveStep: boolean
        response: string[]
      }
    | undefined
  >
  isLoading: boolean
  isServerError: boolean
  errorMessage: string
}

export const useGetMetricsStepsEffect = (): useGetMetricsStepsEffectInterface => {
  const [isLoading, setIsLoading] = useState(false)
  const [isServerError, setIsServerError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const getSteps = async (
    params: getStepsParams,
    organizationId: string,
    buildId: string,
    pipelineType: string,
    token: string
  ) => {
    const errorHandler = (err: Error) => {
      setErrorMessage(`${pipelineType} ${GET_STEPS_FAILED_MESSAGE}: ${err.message}`)
    }

    return await handleApiRequest(
      () => metricsClient.getSteps(params, organizationId, buildId, pipelineType, token),
      errorHandler,
      setIsLoading,
      setIsServerError,
      setErrorMessage
    )
  }

  return { isLoading, isServerError, getSteps, errorMessage }
}
