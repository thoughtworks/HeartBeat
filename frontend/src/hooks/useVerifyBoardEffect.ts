import { useState } from 'react'
import { boardClient } from '@src/clients/BoardClient'

export interface useVerifyBoardStateInterface {
  verifyJira: () => Promise<
    | {
        isBoardVerify: boolean
        isNoDoneCard: boolean
        response: object
      }
    | undefined
  >
  isLoading: boolean
  showError: boolean
  errorMessage: string
}

export const useVerifyBoardEffect = (): useVerifyBoardStateInterface => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showError, setShowError] = useState(false)

  const verifyJira = async () => {
    setIsLoading(true)
    try {
      return await boardClient.getVerifyBoard()
    } catch (e) {
      const err = e as Error
      setErrorMessage(err.message)
      setShowError(true)
      setTimeout(() => {
        setShowError(false)
        setErrorMessage('')
      }, 2000)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    verifyJira,
    isLoading,
    showError,
    errorMessage,
  }
}
