import { useState } from 'react'
import { CSVReportRequestDTO } from '@src/clients/report/dto/request'
import { csvClient } from '@src/clients/report/CSVClient'
import { handleApiRequest } from '@src/utils/util'

export interface useExportCsvEffectInterface {
  fetchExportData: (params: CSVReportRequestDTO) => void
  errorMessage: string
  isServerError: boolean
  isLoading: boolean
}

export const useExportCsvEffect = (): useExportCsvEffectInterface => {
  const [errorMessage, setErrorMessage] = useState('')
  const [isServerError, setIsServerError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fetchExportData = async (params: CSVReportRequestDTO) => {
    const errorHandler = (err: Error) => {
      setErrorMessage(`failed to export csv: ${err.message}`)
    }

    return await handleApiRequest(
      () => csvClient.exportCSVData(params),
      errorHandler,
      setIsLoading,
      setIsServerError,
      setErrorMessage
    )
  }

  return { fetchExportData, errorMessage, isServerError, isLoading }
}
