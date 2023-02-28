import { useState } from 'react'

import { pipelineToolClient } from '@src/clients/PipelineToolClient'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { changePipelineToolVerifyState } from '@src/features/pipelineTool/pipelineToolSlice'
import { updatePipelineToolVerifyResponse } from '@src/features/pipelineToolVerifyResponse/pipelineToolVerifyResponseSlice'

export interface useVerifyPipeLineToolServiceStateInterface {
  verifyPipelineTool: () => Promise<void>
  isVerifyLoading: boolean
  isErrorNotification: boolean
  showErrorMessage: string
}

export const useVerifyPipelineToolState = (): useVerifyPipeLineToolServiceStateInterface => {
  const dispatch = useAppDispatch()
  const [isVerifyLoading, setIsLoading] = useState(false)
  const [isErrorNotification, setIsShowErrorNotification] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState('')

  const verifyPipelineTool = async (): Promise<void> => {
    setIsLoading(true)
    try {
      const response = await pipelineToolClient.verifyPipelineTool()
      if (response.status == 200) {
        handlePipelineVerifySucceed(response.data)
      } else {
        handlePipelineVerifyFailed()
      }
    } catch (e) {
      handlePipelineVerifyFailed()
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        setIsShowErrorNotification(false)
      }, 2000)
    }
  }

  const handlePipelineVerifySucceed = (res: Array<object>) => {
    dispatch(changePipelineToolVerifyState(true))
    dispatch(updatePipelineToolVerifyResponse(res))
  }

  const handlePipelineVerifyFailed = () => {
    setShowErrorMessage('PipelineTool verify failed')
    setIsShowErrorNotification(true)
  }

  return {
    verifyPipelineTool,
    isVerifyLoading,
    isErrorNotification,
    showErrorMessage,
  }
}
