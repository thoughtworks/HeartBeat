import { useState } from 'react'
import { ERROR_MESSAGE_TIME_DURATION, GET_STEPS_FAILED_MESSAGE } from '@src/constants'
import { getStepsParams, metricsClient } from '@src/clients/MetricsClient'

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
        branches: string[]
      }
    | undefined
  >
  isLoading: boolean
  errorMessage: string
}

export const useGetMetricsStepsEffect = (): useGetMetricsStepsEffectInterface => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const getSteps = async (
    params: getStepsParams,
    organizationId: string,
    buildId: string,
    pipelineType: string,
    token: string
  ) => {
    setIsLoading(true)
    try {
      return await metricsClient.getSteps(params, organizationId, buildId, pipelineType, token)
    } catch (e) {
      const err = e as Error
      setErrorMessage(`${pipelineType} ${GET_STEPS_FAILED_MESSAGE}: ${err.message}`)
      setTimeout(() => {
        setErrorMessage('')
      }, ERROR_MESSAGE_TIME_DURATION)
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, getSteps, errorMessage }
}
