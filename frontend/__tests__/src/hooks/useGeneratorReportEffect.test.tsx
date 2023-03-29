import { act, renderHook } from '@testing-library/react'
import { ERROR_MESSAGE_TIME_DURATION } from '@src/constants'
import { useGeneratorReportEffect } from '@src/hooks/useGeneratorReportEffect'
import { reportClient } from '@src/clients/ReportClient'

describe('use generator report effect', () => {
  it('should initial data state when render hook', async () => {
    const { result } = renderHook(() => useGeneratorReportEffect())

    expect(result.current.isLoading).toEqual(false)
  })
  it('should set error message when get verify board throw error', async () => {
    jest.useFakeTimers()
    reportClient.generateReporter = jest.fn().mockImplementation(() => {
      throw new Error('error')
    })
    const { result } = renderHook(() => useGeneratorReportEffect())

    expect(result.current.isLoading).toEqual(false)

    act(() => {
      result.current.generatorReport()
      jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION)
    })

    expect(result.current.errorMessage).toEqual('')
  })
})
