import { useRef, useState } from 'react'
import { reportClient } from '@src/clients/report/ReportClient'
import { ReportRequestDTO } from '@src/clients/report/dto/request'
import { UnknownException } from '@src/exceptions/UnkonwException'
import { InternalServerException } from '@src/exceptions/InternalServerException'
import { HttpStatusCode } from 'axios'
import { ReportResponseDTO } from '@src/clients/report/dto/response'
import { DURATION } from '@src/constants/commons'

export interface useGenerateReportEffectInterface {
  startPollingReports: (boardParams: ReportRequestDTO, doraParams: ReportRequestDTO) => void
  stopPollingReports: () => void
  errorMessage: string
  isServerError: boolean
  reportData: ReportResponseDTO | undefined
}

export const useGenerateReportEffect = (): useGenerateReportEffectInterface => {
  const [isServerError, setIsServerError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [reportData, setReportData] = useState<ReportResponseDTO>()
  const timerIdRef = useRef<number>()

  const startPollingReports = (boardParams: ReportRequestDTO, doraParams: ReportRequestDTO) => {
    Promise.race([
      reportClient.retrieveReportByUrl(doraParams, '/dora-reports'),
      reportClient.retrieveReportByUrl(boardParams, '/board-reports'),
    ])
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

  const pollingReport = (url: string, interval: number) => {
    reportClient
      .pollingReport(url)
      .then((res: { status: number; response: ReportResponseDTO }) => {
        setReportData(res.response)
        if (res.status === HttpStatusCode.Created) {
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
  }

  return {
    startPollingReports,
    stopPollingReports,
    reportData,
    isServerError,
    errorMessage,
  }
}
