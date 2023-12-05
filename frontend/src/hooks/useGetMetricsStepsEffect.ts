import { useState } from 'react'
import { getStepsParams, metricsClient } from '@src/clients/MetricsClient'
import { DURATION } from '@src/constants/commons'
import { MESSAGE } from '@src/constants/resources'

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
        pipelineCrews: string[]
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
      setErrorMessage(`${pipelineType} ${MESSAGE.GET_STEPS_FAILED}: ${err.message}`)
      setTimeout(() => {
        setErrorMessage('')
      }, DURATION.ERROR_MESSAGE_TIME)
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, getSteps, errorMessage }
}
