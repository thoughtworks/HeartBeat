import { act, renderHook } from '@testing-library/react'
import { ERROR_MESSAGE_TIME_DURATION } from '@src/constants'
import { useGetMetricsStepsEffect } from '@src/hooks/useGetMetricsStepsEffect'
import { metricsClient } from '@src/clients/MetricsClient'
import { InternalServerException } from '@src/exceptions/InternalServerException'

describe('use get steps effect', () => {
  const mockGetStepsParams = {
    params: {
      pipelineName: 'mock pipeline name',
      repository: 'mock repository',
      orgName: 'mock orgName',
      startTime: 1212112121212,
      endTime: 1313131313131,
    },
    buildId: 'mockBuildId',
    organizationId: 'mockOrganizationId',
    pipelineType: 'BuildKite',
    token: 'mockToken',
  }

  const { params, buildId, organizationId, pipelineType, token } = mockGetStepsParams
  it('should init data state when render hook', async () => {
    const { result } = renderHook(() => useGetMetricsStepsEffect())

    expect(result.current.isLoading).toEqual(false)
  })

  it('should set error message when get steps throw error', async () => {
    jest.useFakeTimers()
    metricsClient.getSteps = jest.fn().mockImplementation(() => {
      throw new Error('error')
    })
    const { result } = renderHook(() => useGetMetricsStepsEffect())

    expect(result.current.isLoading).toEqual(false)

    act(() => {
      result.current.getSteps(params, buildId, organizationId, pipelineType, token)
      jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION)
    })

    expect(result.current.errorMessage).toEqual('')
  })

  it('should set error message when get steps response status 500', async () => {
    metricsClient.getSteps = jest.fn().mockImplementation(() => {
      throw new InternalServerException('error message')
    })
    const { result } = renderHook(() => useGetMetricsStepsEffect())

    act(() => {
      result.current.getSteps(params, buildId, organizationId, pipelineType, token)
    })

    expect(result.current.errorMessage).toEqual('BuildKite Get steps failed: error message')
  })
})
