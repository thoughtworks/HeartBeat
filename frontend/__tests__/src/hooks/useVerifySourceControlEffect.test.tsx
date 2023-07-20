import { act, renderHook } from '@testing-library/react'
import { useVerifySourceControlEffect } from '@src/hooks/useVeritySourceControlEffect'
import { sourceControlClient } from '@src/clients/sourceControl/SourceControlClient'
import { ERROR_MESSAGE_TIME_DURATION, MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS, VERIFY_FAILED } from '../fixtures'
import { NotFoundException } from '@src/exceptions/NotFoundException'

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
      jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION)
    })

    expect(result.current.errorMessage).toEqual('')
  })

  it('should set error message when get verify sourceControl response status 404', async () => {
    sourceControlClient.getVerifySourceControl = jest.fn().mockImplementation(() => {
      throw new NotFoundException('error message')
    })
    const { result } = renderHook(() => useVerifySourceControlEffect())

    act(() => {
      result.current.verifyGithub(MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS)
    })

    expect(result.current.errorMessage).toEqual(
      `${MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS.type} ${VERIFY_FAILED}: error message`
    )
  })
  it('should set isServerError is true when error has response', async () => {
    const error = {
      response: {
        status: 500,
      },
    }

    sourceControlClient.getVerifySourceControl = jest.fn().mockImplementation(() => {
      throw error
    })
    const { result } = renderHook(() => useVerifySourceControlEffect())

    act(() => {
      result.current.verifyGithub(MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS)
    })

    expect(result.current.isServerError).toEqual(true)
  })

  it('should set isServerError is true when error is empty', async () => {
    const error = {}

    sourceControlClient.getVerifySourceControl = jest.fn().mockImplementation(() => {
      throw error
    })
    const { result } = renderHook(() => useVerifySourceControlEffect())

    act(() => {
      result.current.verifyGithub(MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS)
    })

    expect(result.current.isServerError).toEqual(true)
  })
})
