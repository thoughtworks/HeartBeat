import { useState } from 'react'
import { sourceControlClient, getVerifySourceControlParams } from '@src/clients/SourceControlClient'
import { ERROR_MESSAGE_TIME_DURATION } from '@src/constants'

export interface useVerifySourceControlStateInterface {
  verifyGithub: (params: getVerifySourceControlParams) => Promise<
    | {
        isSourceControlVerify: boolean
        response: object
      }
    | undefined
  >
  isLoading: boolean
  errorMessage: string
}

export const useVerifySourceControlEffect = (): useVerifySourceControlStateInterface => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const verifyGithub = async (params: getVerifySourceControlParams) => {
    setIsLoading(true)
    try {
      return await sourceControlClient.getVerifySourceControl(params)
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
    verifyGithub,
    isLoading,
    errorMessage,
  }
}
