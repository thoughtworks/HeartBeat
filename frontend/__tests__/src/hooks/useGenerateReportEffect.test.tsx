import { act, renderHook, waitFor } from '@testing-library/react'
import { ERROR_MESSAGE_TIME_DURATION } from '@src/constants'
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect'
import { INTERNAL_SERVER_ERROR_MESSAGE, MOCK_GENERATE_REPORT_REQUEST_PARAMS, MOCK_REPORT_RESPONSE } from '../fixtures'
import { reportClient } from '@src/clients/report/ReportClient'
import { reportMapper } from '@src/hooks/reportMapper/report'
import { NotFoundException } from '@src/exceptions/NotFoundException'
import { UnknownException } from '@src/exceptions/UnkonwException'
import { InternalServerException } from '@src/exceptions/InternalServerException'

jest.mock('@src/hooks/reportMapper/report', () => ({
  reportMapper: jest.fn(),
}))

describe('use generate report effect', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should init data state when render hook', async () => {
    const { result } = renderHook(() => useGenerateReportEffect())

    expect(result.current.isLoading).toEqual(false)
  })
  it('should set error message when generate report throw error', async () => {
    jest.useFakeTimers()
    reportClient.report = jest.fn().mockImplementation(() => {
      throw new Error('error')
    })
    const { result } = renderHook(() => useGenerateReportEffect())

    expect(result.current.isLoading).toEqual(false)

    act(() => {
      result.current.generateReport(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
      jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION)
    })

    expect(result.current.errorMessage).toEqual('')
  })

  it('should set error message when generate report response status 404', async () => {
    reportClient.report = jest.fn().mockImplementation(() => {
      throw new NotFoundException('error message')
    })
    const { result } = renderHook(() => useGenerateReportEffect())

    act(() => {
      result.current.generateReport(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
    })

    await waitFor(() => expect(result.current.errorMessage).toEqual('generate report: error message'))
  })

  it('should call reportMapper method when generate report response status 200', async () => {
    reportClient.report = jest.fn().mockReturnValue(MOCK_REPORT_RESPONSE)

    const { result } = renderHook(() => useGenerateReportEffect())

    act(() => {
      result.current.generateReport(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
    })

    await waitFor(() => {
      expect(reportMapper).toHaveBeenCalledTimes(1)
    })
  })

  it('should set error message when generate report response status 500', async () => {
    reportClient.report = jest.fn().mockImplementation(() => {
      throw new InternalServerException(INTERNAL_SERVER_ERROR_MESSAGE)
    })
    const { result } = renderHook(() => useGenerateReportEffect())

    act(() => {
      result.current.generateReport(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
    })

    await waitFor(() => expect(result.current.isServerError).toEqual(true))
  })

  it('should set isServerError is true when throw unknownException', async () => {
    reportClient.report = jest.fn().mockImplementation(() => {
      throw new UnknownException()
    })

    const { result } = renderHook(() => useGenerateReportEffect())

    act(() => {
      result.current.generateReport(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
    })

    await waitFor(() => expect(result.current.isServerError).toEqual(true))
  })
})
