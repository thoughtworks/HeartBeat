import { useState } from 'react'
import { boardService } from '@src/services/BoardService'

export interface useVerifyBoardStateInterface {
  verifyJira: () => Promise<any>
  isVerifyLoading: boolean
}

export const useVerifyBoardState = (): useVerifyBoardStateInterface => {
  const [isVerifyLoading, setIsVerifyLoading] = useState(false)

  const verifyJira = async () => {
    setIsVerifyLoading(true)
    try {
      return await boardService.getVerifyBoard()
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
