import { useState } from 'react'
import { sourceControlClient } from '@src/clients/sourceControl/SourceControlClient'
import { ERROR_MESSAGE_TIME_DURATION, UNKNOWN_EXCEPTION, VERIFY_FAILED_ERROR_MESSAGE } from '@src/constants'
import { SourceControlRequestDTO } from '@src/clients/sourceControl/dto/request'

export interface useVerifySourceControlStateInterface {
  verifyGithub: (params: SourceControlRequestDTO) => Promise<
    | {
        isSourceControlVerify: boolean
        response: object
      }
    | undefined
  >
  isLoading: boolean
  isServerError: boolean
  errorMessage: string
}

export const useVerifySourceControlEffect = (): useVerifySourceControlStateInterface => {
  const [isLoading, setIsLoading] = useState(false)
  const [isServerError, setIsServerError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const verifyGithub = async (params: SourceControlRequestDTO) => {
    setIsLoading(true)
    try {
      return await sourceControlClient.getVerifySourceControl(params)
    } catch (e) {
      const err = e as Error
      if (err.message === UNKNOWN_EXCEPTION) {
        setIsServerError(true)
      } else {
        setErrorMessage(`${params.type} ${VERIFY_FAILED_ERROR_MESSAGE}: ${err.message}`)
        setTimeout(() => {
          setErrorMessage('')
        }, ERROR_MESSAGE_TIME_DURATION)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    verifyGithub,
    isLoading,
    isServerError,
    errorMessage,
  }
}
