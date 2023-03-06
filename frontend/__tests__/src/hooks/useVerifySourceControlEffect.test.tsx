import { act, renderHook } from '@testing-library/react'
import { useVerifySourceControlEffect } from '@src/hooks/useVeritySourceControlEffect'
import { sourceControlClient } from '@src/clients/SourceControlClient'
import { MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS } from '../fixtures'

describe('use verify sourceControl state', () => {
  it('should initial data state when render hook', async () => {
    const { result } = renderHook(() => useVerifySourceControlEffect())

    expect(result.current.isLoading).toEqual(false)
  })

  it('should set error message when get verify sourceControl throw error', async () => {
    jest.useFakeTimers()
    sourceControlClient.getVerifySourceControl = jest.fn().mockImplementation(() => {
      throw new Error('error')
    })
    const { result } = renderHook(() => useVerifySourceControlEffect())

    expect(result.current.isLoading).toEqual(false)

    act(() => {
      result.current.verifyGithub(MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS)
      jest.advanceTimersByTime(2000)
    })

    expect(result.current.errorMessage).toEqual('')
  })
})
