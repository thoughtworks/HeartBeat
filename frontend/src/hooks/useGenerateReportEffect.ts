import { useState } from 'react'
import { ERROR_MESSAGE_TIME_DURATION } from '@src/constants'
import { reportClient } from '@src/clients/ReportClient'
import { VelocityInterface } from '@src/types/reportResponse'

export interface useGenerateReportEffectInterface {
  generateReport: () => Promise<
    | {
        response: {
          velocity: VelocityInterface
        }
      }
    | undefined
  >
  isLoading: boolean
  errorMessage: string
}

export const useGenerateReportEffect = (): useGenerateReportEffectInterface => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const generateReport = async () => {
    setIsLoading(true)
    try {
      return await reportClient.generateReporter()
    } catch (e) {
      const err = e as Error
      setErrorMessage(err.message)
      setTimeout(() => {
        setErrorMessage('')
      }, ERROR_MESSAGE_TIME_DURATION)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    generateReport,
    isLoading,
    errorMessage,
  }
}
