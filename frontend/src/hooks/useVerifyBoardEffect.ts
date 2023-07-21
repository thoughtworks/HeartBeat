import { useState } from 'react'
import { boardClient } from '@src/clients/board/BoardClient'
import { VERIFY_FAILED_ERROR_MESSAGE } from '@src/constants'
import { BoardRequestDTO } from '@src/clients/board/dto/request'
import { handleApiRequest } from '@src/utils/util'

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
    const errorHandler = (err: Error) => {
      setErrorMessage(`${params.type} ${VERIFY_FAILED_ERROR_MESSAGE}: ${err.message}`)
    }

    return await handleApiRequest(
      () => boardClient.getVerifyBoard(params),
      errorHandler,
      setIsLoading,
      setIsServerError,
      setErrorMessage
    )
  }

  return {
    verifyJira,
    isLoading,
    isServerError,
    errorMessage,
  }
}
