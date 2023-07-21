import { useState } from 'react'
import { CSVReportRequestDTO } from '@src/clients/report/dto/request'
import { csvClient } from '@src/clients/report/CSVClient'
import { ERROR_MESSAGE_TIME_DURATION, UNKNOWN_EXCEPTION } from '@src/constants'

export interface useExportCsvEffectInterface {
  fetchExportData: (params: CSVReportRequestDTO) => void
  errorMessage: string
  isServerError: boolean
}

export const useExportCsvEffect = (): useExportCsvEffectInterface => {
  const [errorMessage, setErrorMessage] = useState('')
  const [isServerError, setIsServerError] = useState(false)

  const fetchExportData = async (params: CSVReportRequestDTO) => {
    try {
      return await csvClient.exportCSVData(params)
    } catch (e) {
      const err = e as Error
      if (err.message === UNKNOWN_EXCEPTION) {
        setIsServerError(true)
      } else {
        setErrorMessage(`failed to export csv: ${err.message}`)
        setTimeout(() => {
          setErrorMessage('')
        }, ERROR_MESSAGE_TIME_DURATION)
      }
    }
  }

  return { fetchExportData, errorMessage, isServerError }
}
