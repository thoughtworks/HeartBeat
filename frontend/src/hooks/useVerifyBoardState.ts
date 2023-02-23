import { useState } from 'react'
import { boardService } from '@src/services/BoardService'

export interface useVerifyBoardStateInterface {
  verifyJira: () => Promise<void>
  isVerifyLoading: boolean
}

export const useVerifyBoardState = (): useVerifyBoardStateInterface => {
  const [isVerifyLoading, setIsVerifyLoading] = useState(false)

  const verifyJira = async (): Promise<void> => {
    setIsVerifyLoading(true)
    try {
      await boardService.getVerifyBoard()
    } catch (e) {
      // showErrorNotification({ message: 'Jira verify failed' })
    } finally {
      setIsVerifyLoading(false)
    }
  }
  return {
    verifyJira,
    isVerifyLoading,
  }
}
