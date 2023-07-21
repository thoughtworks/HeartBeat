import { useState } from 'react'
import { boardClient } from '@src/clients/board/BoardClient'
import { ERROR_MESSAGE_TIME_DURATION, UNKNOWN_EXCEPTION, VERIFY_FAILED_ERROR_MESSAGE } from '@src/constants'
import { BoardRequestDTO } from '@src/clients/board/dto/request'

export interface useVerifyBoardStateInterface {
  verifyJira: (params: BoardRequestDTO) => Promise<
    | {
        isBoardVerify: boolean
        haveDoneCard: boolean
        response: object
      }
    | undefined
  >
  isLoading: boolean
  isServerError: boolean
  errorMessage: string
}

export const useVerifyBoardEffect = (): useVerifyBoardStateInterface => {
  const [isLoading, setIsLoading] = useState(false)
  const [isServerError, setIsServerError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const verifyJira = async (params: BoardRequestDTO) => {
    setIsLoading(true)
    try {
      return await boardClient.getVerifyBoard(params)
    } catch (e) {
      const err = e as Error
      if (err.message === UNKNOWN_EXCEPTION) {
        setIsServerError(true)
      } else {
        setErrorMessage(`${params.type} ${VERIFY_FAILED_ERROR_MESSAGE}: ${err.message}`)
        setTimeout(() => {
          setErrorMessage('')
        }, ERROR_MESSAGE_TIME_DURATION)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    verifyJira,
    isLoading,
    isServerError,
    errorMessage,
  }
}
