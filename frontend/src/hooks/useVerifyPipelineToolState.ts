import { useState } from 'react'
import { pipeLineToolService } from '@src/services/PipeLineToolService'

export interface useVerifyPipeLineToolServiceStateInterface {
  verifyPipelineTool: () => Promise<void>
  isVerifyLoading: boolean
}

export const useVerifyPipelineToolState = (): useVerifyPipeLineToolServiceStateInterface => {
  const [isVerifyLoading, setIsVerifyLoading] = useState(false)

  const verifyPipelineTool = async (): Promise<void> => {
    setIsVerifyLoading(true)
    try {
      await pipeLineToolService.verifyPipelineTool()
    } catch (e) {
      // showErrorNotification({ message: 'PipelineTool verify failed' })
    } finally {
      setIsVerifyLoading(false)
    }
  }
  return {
    verifyPipelineTool,
    isVerifyLoading,
  }
}
