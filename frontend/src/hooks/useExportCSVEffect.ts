import { useState } from 'react'
import { ERROR_MESSAGE_TIME_DURATION } from '@src/constants'
import { csvExportClient } from '@src/clients/report/CSVExportClient'
import { CSVReportRequestDTO } from '@src/clients/report/dto/request'

export interface useExportCSVEffectInterface {
  fetchExportData: (params: CSVReportRequestDTO) => void
  errorMessage: string
}

export const useExportCSVEffect = (): useExportCSVEffectInterface => {
  const [errorMessage, setErrorMessage] = useState('')

  const fetchExportData = async (params: CSVReportRequestDTO) => {
    try {
      return await csvExportClient.fetchExportData(params)
    } catch (e) {
      const err = e as Error
      setErrorMessage('failed')
      setTimeout(() => {
        setErrorMessage(`${err}failed`)
      }, ERROR_MESSAGE_TIME_DURATION)
    }
  }

  return { fetchExportData, errorMessage }
}
