import { useRef, useState } from 'react'
import { reportClient } from '@src/clients/report/ReportClient'
import { BoardReportRequestDTO, ReportRequestDTO } from '@src/clients/report/dto/request'
import { UnknownException } from '@src/exceptions/UnkonwException'
import { InternalServerException } from '@src/exceptions/InternalServerException'
import { ReportResponseDTO } from '@src/clients/report/dto/response'
import { DURATION } from '@src/constants/commons'

export interface useGenerateReportEffectInterface {
  startToRequestBoardData: (boardParams: BoardReportRequestDTO) => void
  startToRequestDoraData: (doraParams: ReportRequestDTO) => void
  stopPollingReports: () => void
  isServerError: boolean
  errorMessage: string
  reportData: ReportResponseDTO | undefined
}

export const useGenerateReportEffect = (): useGenerateReportEffectInterface => {
  const [isServerError, setIsServerError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [reportData, setReportData] = useState<ReportResponseDTO>()
  const timerIdRef = useRef<number>()
  let hasPollingStarted = false

  const startToRequestBoardData = async (boardParams: ReportRequestDTO) => {
    reportClient
      .retrieveReportByUrl(boardParams, '/board-reports')
      .then((res) => {
        if (hasPollingStarted) return
        hasPollingStarted = true
        pollingReport(res.response.callbackUrl, res.response.interval)
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

  const startToRequestDoraData = async (doraParams: ReportRequestDTO) => {
    reportClient
      .retrieveReportByUrl(doraParams, '/dora-reports')
      .then((res) => {
        if (hasPollingStarted) return
        hasPollingStarted = true
        pollingReport(res.response.callbackUrl, res.response.interval)
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

  const pollingReport = (url: string, interval: number) => {
    reportClient
      .pollingReport(url)
      .then((res: { status: number; response: ReportResponseDTO }) => {
        const response = res.response
        setReportData(response)
        if (response.allMetricsReady) {
          stopPollingReports()
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
    window.clearTimeout(timerIdRef.current)
    hasPollingStarted = false
  }

  return {
    startToRequestBoardData,
    startToRequestDoraData,
    stopPollingReports,
    reportData,
    isServerError,
    errorMessage,
  }
}
