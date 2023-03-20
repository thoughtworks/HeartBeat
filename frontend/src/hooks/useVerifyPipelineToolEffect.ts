import { useState } from 'react'
import { pipelineToolClient, getVerifyPipelineToolParams } from '@src/clients/PipelineToolClient'
import { ERROR_MESSAGE_TIME_DURATION } from '@src/constants'

export interface useVerifyPipeLineToolStateInterface {
  verifyPipelineTool: (params: getVerifyPipelineToolParams) => Promise<
    | {
        isPipelineToolVerified: boolean
        response: object
      }
    | undefined
  >
  isLoading: boolean
  errorMessage: string
}

export const useVerifyPipelineToolEffect = (): useVerifyPipeLineToolStateInterface => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const verifyPipelineTool = async (params: getVerifyPipelineToolParams) => {
    setIsLoading(true)
    try {
      return await pipelineToolClient.verifyPipelineTool(params)
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
    verifyPipelineTool,
    isLoading,
    errorMessage,
  }
}
