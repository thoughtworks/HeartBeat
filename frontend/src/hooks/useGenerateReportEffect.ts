import { useRef, useState } from 'react'
import { reportClient } from '@src/clients/report/ReportClient'
import { ReportRequestDTO } from '@src/clients/report/dto/request'
import { UnknownException } from '@src/exceptions/UnkonwException'
import { InternalServerException } from '@src/exceptions/InternalServerException'
import { HttpStatusCode } from 'axios'
import { pipelineReportMapper, sourceControlReportMapper } from '@src/hooks/reportMapper/report'
import { ReportResponse, ReportResponseDTO } from '@src/clients/report/dto/response'
import { DURATION } from '@src/constants/commons'

export interface useGenerateReportEffectInterface {
  startPollingReports: (boardParams: ReportRequestDTO, doraParams: ReportRequestDTO) => void
  stopPollingReports: () => void
  isBoardLoading: boolean
  isServerError: boolean
  isPipelineLoading: boolean
  isSourceControlLoading: boolean
  errorMessage: string
  reportData: ReportResponseDTO | undefined
}

export const useGenerateReportEffect = (): useGenerateReportEffectInterface => {
  const [isBoardLoading, setIsBoardLoading] = useState(false)
  const [isPipelineLoading, setIsPipelineLoading] = useState(false)
  const [isSourceControlLoading, setIsSourceControlLoading] = useState(false)
  const [isServerError, setIsServerError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [reportData, setReportData] = useState<ReportResponseDTO>()
  const timerIdRef = useRef<number>()

  const startPollingReports = (boardParams: ReportRequestDTO, doraParams: ReportRequestDTO) => {
    setIsBoardLoading(true)
    setIsPipelineLoading(true)
    setIsSourceControlLoading(true)
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
        const { sourceControlMetricsReady, pipelineMetricsReady, boardMetricsReady } = res.response
        setReportData(res.response)
        if (sourceControlMetricsReady) {
          setIsSourceControlLoading(false)
        }
        if (pipelineMetricsReady) {
          setIsPipelineLoading(false)
        }
        if (boardMetricsReady) {
          setIsBoardLoading(false)
        }
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
    isPipelineLoading,
    isSourceControlLoading,
    isBoardLoading,
    reportData,
    isServerError,
    errorMessage,
  }
}
