import { useState } from 'react'
import { pipelineToolClient } from '@src/clients/pipeline/PipelineToolClient'
import { VERIFY_FAILED_ERROR_MESSAGE } from '@src/constants'
import { PipelineRequestDTO } from '@src/clients/pipeline/dto/request'
import { handleApiRequest } from '@src/utils/util'

export interface useVerifyPipeLineToolStateInterface {
  verifyPipelineTool: (params: PipelineRequestDTO) => Promise<
    | {
        isPipelineToolVerified: boolean
        response: object
      }
    | undefined
  >
  isLoading: boolean
  isServerError: boolean
  errorMessage: string
}

export const useVerifyPipelineToolEffect = (): useVerifyPipeLineToolStateInterface => {
  const [isLoading, setIsLoading] = useState(false)
  const [isServerError, setIsServerError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const verifyPipelineTool = async (params: PipelineRequestDTO) => {
    const errorHandler = (err: Error) => {
      setErrorMessage(`${params.type} ${VERIFY_FAILED_ERROR_MESSAGE}: ${err.message}`)
    }

    return await handleApiRequest(
      () => pipelineToolClient.verifyPipelineTool(params),
      errorHandler,
      setIsLoading,
      setIsServerError,
      setErrorMessage
    )
  }

  return {
    verifyPipelineTool,
    isLoading,
    isServerError,
    errorMessage,
  }
}
