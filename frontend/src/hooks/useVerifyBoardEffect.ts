import { useState } from 'react'
import { boardClient, getVerifyBoardParams } from '@src/clients/BoardClient'
import { ERROR_MESSAGE_TIME_DURATION, VERIFY_FAILED_ERROR_MESSAGE } from '@src/constants'

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
      setErrorMessage(`${params.type} ${VERIFY_FAILED_ERROR_MESSAGE}: ${err.message}`)
      setTimeout(() => {
        setErrorMessage('')
      }, ERROR_MESSAGE_TIME_DURATION)
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
