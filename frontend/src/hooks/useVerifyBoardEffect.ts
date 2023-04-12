import { useState } from 'react'
import { boardClient } from '@src/clients/BoardClient'
import { ERROR_MESSAGE_TIME_DURATION, VERIFY_FAILED_ERROR_MESSAGE } from '@src/constants'
import { VerifyBoardReq } from '@src/models/request/boardReq'

export interface useVerifyBoardStateInterface {
  verifyJira: (params: VerifyBoardReq) => Promise<
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

  const verifyJira = async (params: VerifyBoardReq) => {
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
