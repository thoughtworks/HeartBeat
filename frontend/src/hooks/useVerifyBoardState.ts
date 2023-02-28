import { useState } from 'react'

import { boardClient } from '@src/clients/BoardClient'

export interface useVerifyBoardStateInterface {
  verifyJira: () => Promise<{
    isBoardVerify: boolean
    isNoDoneCard: boolean
    isShowErrorNotification: boolean
    response: object
  }>
  isVerifyLoading: boolean
  showErrorMessage: string
}

export const useVerifyBoardState = (): useVerifyBoardStateInterface => {
  let isBoardVerify = false
  let isNoDoneCard = false
  let isShowErrorNotification = false
  let response = {}
  const [isVerifyLoading, setIsLoading] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState('')

  const verifyJira = async () => {
    setIsLoading(true)
    try {
      const response = await boardClient.getVerifyBoard()
      if (response.status === 444) {
        handleBoardNoDoneCard()
      } else if (response.status == 200) {
        handleBoardVerifySucceed(response.data)
      } else {
        handleBoardVerifyFailed()
      }
    } catch (e) {
      handleBoardVerifyFailed()
    } finally {
      setIsLoading(false)
    }
    return { response, isBoardVerify, isNoDoneCard, isShowErrorNotification }
  }

  const handleBoardNoDoneCard = () => {
    isNoDoneCard = true
  }

  const handleBoardVerifySucceed = (res: object) => {
    isBoardVerify = true
    response = res
  }

  const handleBoardVerifyFailed = () => {
    isBoardVerify = false
    isShowErrorNotification = true
    setShowErrorMessage('Jira verify failed')
  }

  return {
    verifyJira,
    isVerifyLoading,
    showErrorMessage,
  }
}
