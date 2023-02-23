import { useState } from 'react'
import { boardService } from '@src/services/BoardService'

export interface useVerifyBoardStateInterface {
  verifyJira: () => Promise<void>
  isVerifyLoading: boolean
  isErrorNotification: boolean
  showErrorMessage: string
}

export const useVerifyBoardState = (): useVerifyBoardStateInterface => {
  const [isVerifyLoading, setIsVerifyLoading] = useState(false)
  const [isErrorNotification, setIsErrorNotification] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState('')

  const verifyJira = async (): Promise<void> => {
    setIsVerifyLoading(true)
    try {
      const response = await boardService.getVerifyBoard().then((res) => res)
      console.log('response', response)
    } catch (e) {
      setShowErrorMessage('Jira verify failed')
      setIsErrorNotification(true)
    } finally {
      setIsVerifyLoading(false)
    }
  }
  return {
    verifyJira,
    isVerifyLoading,
    isErrorNotification,
    showErrorMessage,
  }
}
