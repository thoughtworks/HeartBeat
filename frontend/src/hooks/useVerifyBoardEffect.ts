import { useState } from 'react'
import { boardClient, getVerifyBoardParams } from '@src/clients/BoardClient'

export interface useVerifyBoardStateInterface {
  verifyJira: (params: getVerifyBoardParams) => Promise<
    | {
        isBoardVerify: boolean
        isNoDoneCard: boolean
        response: object
      }
    | undefined
  >
  isLoading: boolean
  errorMessage: string
}

export const useVerifyBoardEffect = (): useVerifyBoardStateInterface => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const verifyJira = async (params: getVerifyBoardParams) => {
    setIsLoading(true)
    try {
      return await boardClient.getVerifyBoard(params)
    } catch (e) {
      const err = e as Error
      setErrorMessage(err.message)
      setTimeout(() => {
        setErrorMessage('')
      }, 2000)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    verifyJira,
    isLoading,
    errorMessage,
  }
}
