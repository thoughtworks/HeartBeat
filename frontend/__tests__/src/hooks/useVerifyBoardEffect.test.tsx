import { act, renderHook } from '@testing-library/react'
import { useVerifyBoardEffect } from '@src/hooks/useVerifyBoardEffect'
import { boardClient } from '@src/clients/BoardClient'
import { MOCK_BOARD_VERIFY_REQUEST_PARAMS } from '../fixtures'
import { ERROR_MESSAGE_TIME_DURATION } from '@src/constants'

describe('use verify board state', () => {
  it('should initial data state when render hook', async () => {
    const { result } = renderHook(() => useVerifyBoardEffect())

    expect(result.current.isLoading).toEqual(false)
  })
  it('should set error message when get verify board throw error', async () => {
    jest.useFakeTimers()
    boardClient.getVerifyBoard = jest.fn().mockImplementation(() => {
      throw new Error('error')
    })
    const { result } = renderHook(() => useVerifyBoardEffect())

    expect(result.current.isLoading).toEqual(false)

    act(() => {
      result.current.verifyJira(MOCK_BOARD_VERIFY_REQUEST_PARAMS)
      jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION)
    })

    expect(result.current.errorMessage).toEqual('')
  })
})
