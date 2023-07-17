import { useState } from 'react'
import { pipelineToolClient } from '@src/clients/pipeline/PipelineToolClient'
import { ERROR_MESSAGE_TIME_DURATION, VERIFY_FAILED_ERROR_MESSAGE } from '@src/constants'
import { PipelineRequestDTO } from '@src/clients/pipeline/dto/request'
import { AxiosError } from 'axios'

export interface useVerifyPipeLineToolStateInterface {
  verifyPipelineTool: (params: PipelineRequestDTO) => Promise<
    | {
        isPipelineToolVerified: boolean
        response: object
      }
    | undefined
  >
  isLoading: boolean
  isError: boolean
  errorMessage: string
}

export const useVerifyPipelineToolEffect = (): useVerifyPipeLineToolStateInterface => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const verifyPipelineTool = async (params: PipelineRequestDTO) => {
    setIsLoading(true)
    try {
      return await pipelineToolClient.verifyPipelineTool(params)
    } catch (e) {
      const err = e as AxiosError
      if (!err.message || err.response) {
        setIsError(true)
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
    verifyPipelineTool,
    isLoading,
    isError,
    errorMessage,
  }
}
