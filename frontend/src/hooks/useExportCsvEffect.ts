import { useState } from 'react'
import { CSVReportRequestDTO } from '@src/clients/report/dto/request'
import { csvClient } from '@src/clients/report/CSVClient'
import { ERROR_MESSAGE_TIME_DURATION } from '@src/constants'
import { NotFoundException } from '@src/exceptions/NotFoundException'

export interface useExportCsvEffectInterface {
  fetchExportData: (params: CSVReportRequestDTO) => void
  errorMessage: string
  isExpired: boolean
}

export const useExportCsvEffect = (): useExportCsvEffectInterface => {
  const [errorMessage, setErrorMessage] = useState('')
  const [isExpired, setIsExpired] = useState(false)

  const fetchExportData = async (params: CSVReportRequestDTO) => {
    try {
      setIsExpired(false)
      return await csvClient.exportCSVData(params)
    } catch (e) {
      const err = e as Error
      if (err instanceof NotFoundException) {
        setIsExpired(true)
      } else {
        setErrorMessage(`failed to export csv: ${err.message}`)
        setTimeout(() => {
          setErrorMessage('')
        }, ERROR_MESSAGE_TIME_DURATION)
      }
    }
  }

  return { fetchExportData, errorMessage, isExpired }
}
