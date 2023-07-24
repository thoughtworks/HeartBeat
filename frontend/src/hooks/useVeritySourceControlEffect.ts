import { useState } from 'react'
import { sourceControlClient } from '@src/clients/sourceControl/SourceControlClient'
import { VERIFY_FAILED_ERROR_MESSAGE } from '@src/constants'
import { SourceControlRequestDTO } from '@src/clients/sourceControl/dto/request'
import { handleApiRequest } from '@src/hooks/HandleApiRequest/handleApiRequest'

export interface useVerifySourceControlStateInterface {
  verifyGitHub: (params: SourceControlRequestDTO) => Promise<
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

  const verifyGitHub = async (params: SourceControlRequestDTO) => {
    const errorHandler = (err: Error) => {
      setErrorMessage(`${params.type} ${VERIFY_FAILED_ERROR_MESSAGE}: ${err.message}`)
    }

    return await handleApiRequest(
      () => sourceControlClient.getVerifySourceControl(params),
      errorHandler,
      setIsLoading,
      setIsServerError,
      setErrorMessage
    )
  }

  return {
    verifyGitHub,
    isLoading,
    isServerError,
    errorMessage,
  }
}
