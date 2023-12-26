import { renderHook, waitFor } from '@testing-library/react'
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect'
import {
  ERROR_MESSAGE_TIME_DURATION,
  INTERNAL_SERVER_ERROR_MESSAGE,
  MOCK_GENERATE_REPORT_REQUEST_PARAMS,
  MOCK_REPORT_RESPONSE,
  MOCK_RETRIEVE_REPORT_RESPONSE,
} from '../fixtures'
import { reportClient } from '@src/clients/report/ReportClient'
import { NotFoundException } from '@src/exceptions/NotFoundException'
import { UnknownException } from '@src/exceptions/UnkonwException'
import { InternalServerException } from '@src/exceptions/InternalServerException'
import { HttpStatusCode } from 'axios'
import clearAllMocks = jest.clearAllMocks
import resetAllMocks = jest.resetAllMocks

jest.mock('@src/hooks/reportMapper/report', () => ({
  pipelineReportMapper: jest.fn(),
  sourceControlReportMapper: jest.fn(),
}))

describe('use generate report effect', () => {
  afterAll(() => {
    clearAllMocks()
  })
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    resetAllMocks()
    jest.useRealTimers()
  })

  it('should set error message when generate report throw error', async () => {
    const { result } = renderHook(() => useGenerateReportEffect())
    reportClient.retrieveReportByUrl = jest.fn().mockImplementation(async () => {
      throw new Error('error')
    })
    await waitFor(() => {
      result.current.startToRequestBoardData(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
      expect(result.current.errorMessage).toEqual('generate report: error')
    })

    jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION)

    await waitFor(() => {
      expect(result.current.errorMessage).toEqual('')
    })
  })

  it('should set error message when generate report response status 404', async () => {
    const { result } = renderHook(() => useGenerateReportEffect())
    reportClient.retrieveReportByUrl = jest.fn().mockImplementation(async () => {
      throw new NotFoundException('error message')
    })
    await waitFor(() => {
      result.current.startToRequestBoardData(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
      expect(result.current.errorMessage).toEqual('generate report: error message')
    })

    jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION)

    await waitFor(() => {
      expect(result.current.errorMessage).toEqual('')
    })
  })

  it('should set error message when generate report response status 500', async () => {
    const { result } = renderHook(() => useGenerateReportEffect())
    reportClient.retrieveReportByUrl = jest.fn().mockImplementation(async () => {
      throw new InternalServerException(INTERNAL_SERVER_ERROR_MESSAGE)
    })
    await waitFor(() => {
      result.current.startToRequestBoardData(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
      expect(result.current.isServerError).toEqual(true)
    })
  })

  it('should set isServerError is true when throw unknownException', async () => {
    const { result } = renderHook(() => useGenerateReportEffect())
    reportClient.retrieveReportByUrl = jest.fn().mockImplementation(async () => {
      throw new UnknownException()
    })

    await waitFor(() => {
      result.current.startToRequestBoardData(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
      expect(result.current.isServerError).toEqual(true)
    })
  })

  it('should return error message when calling startToRequestBoardData given pollingReport response return 5xx ', async () => {
    const { result } = renderHook(() => useGenerateReportEffect())
    reportClient.pollingReport = jest.fn().mockImplementation(async () => {
      throw new InternalServerException('error')
    })

    reportClient.retrieveReportByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }))

    await waitFor(() => {
      result.current.startToRequestBoardData(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
      expect(reportClient.pollingReport).toBeCalledTimes(1)
      expect(result.current.isServerError).toEqual(true)
    })
  })

  it('should return error message when calling startToRequestBoardData given pollingReport response return 4xx ', async () => {
    const { result } = renderHook(() => useGenerateReportEffect())
    result.current.stopPollingReports = jest.fn()
    reportClient.pollingReport = jest.fn().mockImplementation(async () => {
      throw new NotFoundException('file not found')
    })
    reportClient.retrieveReportByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }))

    await waitFor(() => {
      result.current.startToRequestBoardData(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
      expect(result.current.errorMessage).toEqual('generate report: file not found')
    })

    jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION)

    await waitFor(() => {
      expect(result.current.errorMessage).toEqual('')
    })
  })

  it('should call polling report and setTimeout when calling startToRequestBoardData given pollingReport response return 204 ', async () => {
    const { result } = renderHook(() => useGenerateReportEffect())
    reportClient.pollingReport = jest
      .fn()
      .mockImplementation(async () => ({ status: HttpStatusCode.NoContent, response: MOCK_REPORT_RESPONSE }))

    reportClient.retrieveReportByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }))

    await waitFor(() => {
      result.current.startToRequestBoardData(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
    })

    jest.runOnlyPendingTimers()

    await waitFor(() => {
      expect(reportClient.pollingReport).toHaveBeenCalledTimes(1)
    })
  })

  it('should call polling report more than one time when allMetricsReady field in response is false', async () => {
    const { result } = renderHook(() => useGenerateReportEffect())
    reportClient.pollingReport = jest.fn().mockImplementation(async () => ({
      status: HttpStatusCode.NoContent,
      response: { ...MOCK_REPORT_RESPONSE, allMetricsReady: false },
    }))

    reportClient.retrieveReportByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }))

    await waitFor(() => {
      result.current.startToRequestBoardData(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
    })

    jest.advanceTimersByTime(10000)

    await waitFor(() => {
      expect(reportClient.pollingReport).toHaveBeenCalledTimes(2)
    })
  })

  it('should call polling report only once when calling startToRequestBoardData but startToRequestDoraData called before', async () => {
    const { result } = renderHook(() => useGenerateReportEffect())
    reportClient.pollingReport = jest
      .fn()
      .mockImplementation(async () => ({ status: HttpStatusCode.NoContent, response: MOCK_REPORT_RESPONSE }))

    reportClient.retrieveReportByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }))

    await waitFor(() => {
      result.current.startToRequestDoraData(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
      result.current.startToRequestBoardData(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
    })

    jest.runOnlyPendingTimers()

    await waitFor(() => {
      expect(reportClient.pollingReport).toHaveBeenCalledTimes(1)
    })
  })

  it('should set error message when generate report throw error', async () => {
    const { result } = renderHook(() => useGenerateReportEffect())
    reportClient.retrieveReportByUrl = jest.fn().mockImplementation(async () => {
      throw new Error('error')
    })
    await waitFor(() => {
      result.current.startToRequestDoraData(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
      expect(result.current.errorMessage).toEqual('generate report: error')
    })

    jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION)

    await waitFor(() => {
      expect(result.current.errorMessage).toEqual('')
    })
  })

  it('should set error message when generate report response status 404', async () => {
    const { result } = renderHook(() => useGenerateReportEffect())
    reportClient.retrieveReportByUrl = jest.fn().mockImplementation(async () => {
      throw new NotFoundException('error message')
    })
    await waitFor(() => {
      result.current.startToRequestDoraData(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
      expect(result.current.errorMessage).toEqual('generate report: error message')
    })

    jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION)

    await waitFor(() => {
      expect(result.current.errorMessage).toEqual('')
    })
  })

  it('should set error message when generate report response status 500', async () => {
    const { result } = renderHook(() => useGenerateReportEffect())
    reportClient.retrieveReportByUrl = jest.fn().mockImplementation(async () => {
      throw new InternalServerException(INTERNAL_SERVER_ERROR_MESSAGE)
    })
    await waitFor(() => {
      result.current.startToRequestDoraData(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
      expect(result.current.isServerError).toEqual(true)
    })
  })

  it('should set isServerError is true when throw unknownException', async () => {
    const { result } = renderHook(() => useGenerateReportEffect())
    reportClient.retrieveReportByUrl = jest.fn().mockImplementation(async () => {
      throw new UnknownException()
    })

    await waitFor(() => {
      result.current.startToRequestDoraData(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
      expect(result.current.isServerError).toEqual(true)
    })
  })

  it('should return error message when calling startToRequestDoraData given pollingReport response return 5xx ', async () => {
    const { result } = renderHook(() => useGenerateReportEffect())
    reportClient.pollingReport = jest.fn().mockImplementation(async () => {
      throw new InternalServerException('error')
    })

    reportClient.retrieveReportByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }))

    await waitFor(() => {
      result.current.startToRequestDoraData(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
      expect(reportClient.pollingReport).toBeCalledTimes(1)
      expect(result.current.isServerError).toEqual(true)
    })
  })

  it('should return error message when calling startToRequestDoraData given pollingReport response return 4xx ', async () => {
    const { result } = renderHook(() => useGenerateReportEffect())
    result.current.stopPollingReports = jest.fn()
    reportClient.pollingReport = jest.fn().mockImplementation(async () => {
      throw new NotFoundException('file not found')
    })
    reportClient.retrieveReportByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }))

    await waitFor(() => {
      result.current.startToRequestDoraData(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
      expect(result.current.errorMessage).toEqual('generate report: file not found')
    })

    jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION)

    await waitFor(() => {
      expect(result.current.errorMessage).toEqual('')
    })
  })

  it('should call polling report and setTimeout when calling startToRequestDoraData given pollingReport response return 204 ', async () => {
    const { result } = renderHook(() => useGenerateReportEffect())
    reportClient.pollingReport = jest
      .fn()
      .mockImplementation(async () => ({ status: HttpStatusCode.NoContent, response: MOCK_REPORT_RESPONSE }))

    reportClient.retrieveReportByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }))

    await waitFor(() => {
      result.current.startToRequestDoraData(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
    })

    jest.runOnlyPendingTimers()

    await waitFor(() => {
      expect(reportClient.pollingReport).toHaveBeenCalledTimes(1)
    })
  })

  it('should call polling report only once when calling startToRequestDoraData but startToRequestBoardData called before', async () => {
    const { result } = renderHook(() => useGenerateReportEffect())
    reportClient.pollingReport = jest
      .fn()
      .mockImplementation(async () => ({ status: HttpStatusCode.NoContent, response: MOCK_REPORT_RESPONSE }))

    reportClient.retrieveReportByUrl = jest
      .fn()
      .mockImplementation(async () => ({ response: MOCK_RETRIEVE_REPORT_RESPONSE }))

    await waitFor(() => {
      result.current.startToRequestBoardData(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
      result.current.startToRequestDoraData(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
    })

    jest.runOnlyPendingTimers()

    await waitFor(() => {
      expect(reportClient.pollingReport).toHaveBeenCalledTimes(1)
    })
  })
})
