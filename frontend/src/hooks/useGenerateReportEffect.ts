import { useState } from 'react'
import { ERROR_MESSAGE_TIME_DURATION } from '@src/constants'
import { reportClient } from '@src/clients/report/ReportClient'
import { ReportRequestDTO } from '@src/clients/report/dto/request'
import { reportMapper } from '@src/hooks/reportMapper/report'
import { ReportDataWithThreeColumns, ReportDataWithTwoColumns } from '@src/hooks/reportMapper/reportUIDataStructure'
import { AxiosError } from 'axios'

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
  isError: boolean
  errorMessage: string
}

export const useGenerateReportEffect = (): useGenerateReportEffectInterface => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const generateReport = async (params: ReportRequestDTO) => {
    setIsLoading(true)
    try {
      const res = await reportClient.report(params)
      return reportMapper(res.response)
    } catch (e) {
      const err = e as AxiosError
      if (!err.message || err.response) {
        setIsError(true)
      } else {
        setErrorMessage(`generate report: ${err.message}`)
        setTimeout(() => {
          setErrorMessage('')
        }, ERROR_MESSAGE_TIME_DURATION)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    generateReport,
    isLoading,
    isError,
    errorMessage,
  }
}
