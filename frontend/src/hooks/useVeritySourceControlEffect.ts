import { useState } from 'react'
import { sourceControlClient } from '@src/clients/sourceControl/SourceControlClient'
import { VERIFY_FAILED_ERROR_MESSAGE } from '@src/constants'
import { SourceControlRequestDTO } from '@src/clients/sourceControl/dto/request'
import { handleApiRequest } from '@src/utils/util'

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
    verifyGithub,
    isLoading,
    isServerError,
    errorMessage,
  }
}
