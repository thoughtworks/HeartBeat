import { act, renderHook } from '@testing-library/react'
import { useVerifyBoardEffect } from '@src/hooks/useVerifyBoardEffect'
import { boardClient } from '@src/clients/BoardClient'
import { mockBoardVerifyRequestParams } from '../fixtures'

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
      result.current.verifyJira(mockBoardVerifyRequestParams)
      jest.advanceTimersByTime(2000)
    })

    expect(result.current.showError).toEqual(false)
    expect(result.current.errorMessage).toEqual('')
  })
})
