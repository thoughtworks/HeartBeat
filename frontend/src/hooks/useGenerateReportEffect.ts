import { useRef, useState } from 'react'
import { ERROR_MESSAGE_TIME_DURATION } from '@src/constants'
import { reportClient } from '@src/clients/report/ReportClient'
import { ReportRequestDTO } from '@src/clients/report/dto/request'
import { UnknownException } from '@src/exceptions/UnkonwException'
import { InternalServerException } from '@src/exceptions/InternalServerException'
import { HttpStatusCode } from 'axios'
import { reportMapper } from '@src/hooks/reportMapper/report'
import { ReportResponse } from '@src/clients/report/dto/response'

export interface useGenerateReportEffectInterface {
  startPollingReports: (params: ReportRequestDTO) => void
  stopPollingReports: () => void
  isLoading: boolean
  isServerError: boolean
  errorMessage: string
  reports: ReportResponse | undefined
}

export const useGenerateReportEffect = (): useGenerateReportEffectInterface => {
  const [isLoading, setIsLoading] = useState(false)
  const [isServerError, setIsServerError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [reports, setReports] = useState<ReportResponse>()
  const timerIdRef = useRef<NodeJS.Timer>()

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
          }, ERROR_MESSAGE_TIME_DURATION)
        }
        stopPollingReports()
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
          timerIdRef.current = setTimeout(() => pollingReport(url, interval), interval * 1000)
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
          }, ERROR_MESSAGE_TIME_DURATION)
        }
        stopPollingReports()
      })
  }

  const stopPollingReports = () => {
    setIsLoading(false)
    clearInterval(timerIdRef.current)
  }

  return {
    startPollingReports,
    stopPollingReports,
    reports,
    isLoading,
    isServerError,
    errorMessage,
  }
}
