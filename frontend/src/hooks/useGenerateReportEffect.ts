import { useState } from 'react'
import { reportClient } from '@src/clients/report/ReportClient'
import { ReportRequestDTO } from '@src/clients/report/dto/request'
import { ReportDataWithThreeColumns, ReportDataWithTwoColumns } from '@src/hooks/reportMapper/reportUIDataStructure'
import { handleApiRequest } from '@src/utils/util'
import { reportMapper } from '@src/hooks/reportMapper/report'

export interface useGenerateReportEffectInterface {
  generateReport: (params: ReportRequestDTO) => Promise<
    | {
        velocityList?: ReportDataWithTwoColumns[]
        cycleTimeList?: ReportDataWithTwoColumns[]
        classification?: ReportDataWithThreeColumns[]
        deploymentFrequencyList?: ReportDataWithThreeColumns[]
        leadTimeForChangesList?: ReportDataWithThreeColumns[]
        changeFailureRateList?: ReportDataWithThreeColumns[]
      }
    | undefined
  >
  isLoading: boolean
  isServerError: boolean
  errorMessage: string
}

export const useGenerateReportEffect = (): useGenerateReportEffectInterface => {
  const [isLoading, setIsLoading] = useState(false)
  const [isServerError, setIsServerError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const generateReport = async (params: ReportRequestDTO) => {
    const errorHandler = (err: Error) => {
      setErrorMessage(`generate report: ${err.message}`)
    }

    const reportApiCall = async () => {
      const res = await reportClient.report(params)
      return reportMapper(res.response)
    }

    return await handleApiRequest(reportApiCall, errorHandler, setIsLoading, setIsServerError, setErrorMessage)
  }

  return {
    generateReport,
    isLoading,
    isServerError,
    errorMessage,
  }
}
