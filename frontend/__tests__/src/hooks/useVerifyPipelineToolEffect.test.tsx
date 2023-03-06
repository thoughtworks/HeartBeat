import { act, renderHook } from '@testing-library/react'
import { useVerifyPipelineToolEffect } from '@src/hooks/useVerifyPipelineToolEffect'
import { pipelineToolClient } from '@src/clients/PipelineToolClient'
import { MOCK_PIPELINE_VERIFY_REQUEST_PARAMS } from '../fixtures'

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
      jest.advanceTimersByTime(2000)
    })

    expect(result.current.errorMessage).toEqual('')
  })
})
