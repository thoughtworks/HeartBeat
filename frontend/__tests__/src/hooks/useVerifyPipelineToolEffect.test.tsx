import { act, renderHook } from '@testing-library/react'
import { useVerifyPipelineToolEffect } from '@src/hooks/useVerifyPipelineToolEffect'
import { pipelineToolClient } from '@src/clients/pipeline/PipelineToolClient'
import { MOCK_PIPELINE_VERIFY_REQUEST_PARAMS, VERIFY_FAILED } from '../fixtures'
import { ERROR_MESSAGE_TIME_DURATION } from '@src/constants'
import { NotFoundException } from '@src/exceptions/NotFoundException'

describe('use verify pipelineTool state', () => {
  it('should initial data state when render hook', async () => {
    const { result } = renderHook(() => useVerifyPipelineToolEffect())

    expect(result.current.isLoading).toEqual(false)
  })
  it('should set error message when get verify pipelineTool throw error', async () => {
    jest.useFakeTimers()
    pipelineToolClient.verifyPipelineTool = jest.fn().mockImplementation(() => {
      throw new Error('error')
    })
    const { result } = renderHook(() => useVerifyPipelineToolEffect())

    expect(result.current.isLoading).toEqual(false)

    act(() => {
      result.current.verifyPipelineTool(MOCK_PIPELINE_VERIFY_REQUEST_PARAMS)
      jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION)
    })

    expect(result.current.errorMessage).toEqual('')
  })

  it('should set error message when get verify pipeline response status 404', async () => {
    pipelineToolClient.verifyPipelineTool = jest.fn().mockImplementation(() => {
      throw new NotFoundException('error message')
    })
    const { result } = renderHook(() => useVerifyPipelineToolEffect())

    act(() => {
      result.current.verifyPipelineTool(MOCK_PIPELINE_VERIFY_REQUEST_PARAMS)
    })

    expect(result.current.errorMessage).toEqual(
      `${MOCK_PIPELINE_VERIFY_REQUEST_PARAMS.type} ${VERIFY_FAILED}: error message`
    )
  })

  it('should set isServerError is true when error has response', async () => {
    const error = {
      response: {
        status: 500,
      },
    }

    pipelineToolClient.verifyPipelineTool = jest.fn().mockImplementation(() => {
      throw error
    })
    const { result } = renderHook(() => useVerifyPipelineToolEffect())

    act(() => {
      result.current.verifyPipelineTool(MOCK_PIPELINE_VERIFY_REQUEST_PARAMS)
    })

    expect(result.current.isServerError).toEqual(true)
  })

  it('should set isServerError is true when error is empty', async () => {
    const error = {}

    pipelineToolClient.verifyPipelineTool = jest.fn().mockImplementation(() => {
      throw error
    })
    const { result } = renderHook(() => useVerifyPipelineToolEffect())

    act(() => {
      result.current.verifyPipelineTool(MOCK_PIPELINE_VERIFY_REQUEST_PARAMS)
    })

    expect(result.current.isServerError).toEqual(true)
  })
})
