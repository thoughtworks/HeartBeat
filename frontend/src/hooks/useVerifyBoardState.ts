import { useState } from 'react'

import { boardClient } from '@src/clients/BoardClient'

export interface useVerifyBoardStateInterface {
  verifyJira: () => Promise<
    | {
        isBoardVerify: boolean
        isNoDoneCard: boolean
        isShowErrorNotification: boolean
        response: object
      }
    | undefined
  >
  isVerifyLoading: boolean
}

export const useVerifyBoardState = (): useVerifyBoardStateInterface => {
  const [isVerifyLoading, setIsLoading] = useState(false)

  const verifyJira = async () => {
    setIsLoading(true)
    const res = await boardClient.getVerifyBoard()
    setIsLoading(false)
    return res
  }

  return {
    verifyJira,
    isVerifyLoading,
  }
}
