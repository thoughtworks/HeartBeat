import { useRef, useState } from 'react'
import { reportClient } from '@src/clients/report/ReportClient'
import { BoardReportRequestDTO, ReportRequestDTO } from '@src/clients/report/dto/request'
import { UnknownException } from '@src/exceptions/UnkonwException'
import { InternalServerException } from '@src/exceptions/InternalServerException'
import { HttpStatusCode } from 'axios'
import { boardReportMapper, reportMapper } from '@src/hooks/reportMapper/report'
import { ReportResponse } from '@src/clients/report/dto/response'
import { DURATION } from '@src/constants/commons'

export interface useGenerateReportEffectInterface {
  startPollingReports: (params: ReportRequestDTO) => void
  stopPollingReports: () => void
  isLoading: boolean
  isBoardLoading: boolean
  isServerError: boolean
  errorMessage: string
  reports: ReportResponse | undefined
  boardReport: ReportResponse | undefined
}

export const useGenerateReportEffect = (): useGenerateReportEffectInterface => {
  const [isLoading, setIsLoading] = useState(false)
  const [isBoardLoading, setIsBoardLoading] = useState(false)
  const [isServerError, setIsServerError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [reports, setReports] = useState<ReportResponse>()
  const [boardReport, setBoardReport] = useState<ReportResponse>()
  const boardTimerRef = useRef<NodeJS.Timer>()
  const timerIdRef = useRef<number>()

  const startPollingReports = (params: ReportRequestDTO) => {
    setIsLoading(true)
    reportClient
      .retrieveReport(params)
      .then((res) => pollingReport(res.response.callbackUrl, res.response.interval))
      .catch((e) => {
        const err = e as Error
        if (err instanceof InternalServerException || err instanceof UnknownException) {
          setIsServerError(true)
        } else {
          setErrorMessage(`generate report: ${err.message}`)
          setTimeout(() => {
            setErrorMessage('')
          }, DURATION.ERROR_MESSAGE_TIME)
        }
        stopPollingReports()
      })
  }

  const startPollingBoardReport = (params: BoardReportRequestDTO) => {
    setIsBoardLoading(true)
    reportClient
      .getBorderReport(params)
      .then((res) => pollingBoardReport(res.response.callbackUrl, res.response.interval))
      .catch((e) => {
        const err = e as Error
        if (err instanceof InternalServerException || err instanceof UnknownException) {
          setIsServerError(true)
        } else {
          setErrorMessage(`generate report: ${err.message}`)
          setTimeout(() => {
            setErrorMessage('')
          }, DURATION.ERROR_MESSAGE_TIME)
        }
        stopPollingReports()
      })
  }

  const pollingBoardReport = (url: string, interval: number) => {
    reportClient
      .pollingReport(url)
      .then((res) => {
        if (res.status === HttpStatusCode.Created) {
          setIsBoardLoading(false)
          clearInterval(boardTimerRef.current)
          setBoardReport(boardReportMapper(res.response))
        } else {
          boardTimerRef.current = setTimeout(() => pollingReport(url, interval), interval * 1000)
        }
      })
      .catch((e) => {
        const err = e as Error
        if (err instanceof InternalServerException || err instanceof UnknownException) {
          setIsServerError(true)
        } else {
          setErrorMessage(`generate report: ${err.message}`)
          setTimeout(() => {
            setErrorMessage('')
          }, DURATION.ERROR_MESSAGE_TIME)
        }
        setIsBoardLoading(false)
        clearInterval(boardTimerRef.current)
      })
  }

  const pollingReport = (url: string, interval: number) => {
    reportClient
      .pollingReport(url)
      .then((res) => {
        if (res.status === HttpStatusCode.Created) {
          stopPollingReports()
          setReports(reportMapper(res.response))
        } else {
          timerIdRef.current = window.setTimeout(() => pollingReport(url, interval), interval * 1000)
        }
      })
      .catch((e) => {
        const err = e as Error
        if (err instanceof InternalServerException || err instanceof UnknownException) {
          setIsServerError(true)
        } else {
          setErrorMessage(`generate report: ${err.message}`)
          setTimeout(() => {
            setErrorMessage('')
          }, DURATION.ERROR_MESSAGE_TIME)
        }
        stopPollingReports()
      })
  }

  const stopPollingReports = () => {
    setIsLoading(false)
    window.clearTimeout(timerIdRef.current)
  }

  return {
    startPollingReports,
    stopPollingReports,
    reports,
    isLoading,
    isBoardLoading,
    boardReport,
    isServerError,
    errorMessage,
  }
}
