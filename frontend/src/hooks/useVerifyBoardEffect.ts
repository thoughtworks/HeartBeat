import { useState } from 'react'

import { boardClient } from '@src/clients/BoardClient'
import { BadRequestException } from '../exceptions/BadRequestException'
import { BadServerException } from '@src/exceptions/BasServerException'

export interface useVerifyBoardStateInterface {
  verifyJira: () => Promise<
    | {
        isBoardVerify: boolean
        isNoDoneCard: boolean
        response: object
      }
    | undefined
  >
  isVerifyLoading: boolean
  showError: boolean
  errorMessage: string
}

export const useVerifyBoardEffect = (): useVerifyBoardStateInterface => {
  const [isVerifyLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showError, setShowError] = useState(false)

  const verifyJira = async () => {
    setIsLoading(true)
    try {
      return await boardClient.getVerifyBoard()
    } catch (ex: unknown) {
      if (ex instanceof BadRequestException) {
        setErrorMessage(ex.message)
        setShowError(true)
      }
      if (ex instanceof BadServerException) {
        setErrorMessage(ex.message)
        setShowError(true)
      }
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
    isVerifyLoading,
    showError,
    errorMessage,
  }
}
