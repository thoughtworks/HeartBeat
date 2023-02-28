import { useState } from 'react'

import { boardClient } from '@src/clients/BoardClient'
import { changeBoardVerifyState } from '@src/features/board/boardSlice'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { updateJiraVerifyResponse } from '@src/features/jiraVerifyResponse/jiraVerifyResponseSlice'

export interface useVerifyBoardStateInterface {
  verifyJira: () => Promise<void>
  isVerifyLoading: boolean
  isErrorNotification: boolean
  showErrorMessage: string
}

export const useVerifyBoardState = (): useVerifyBoardStateInterface => {
  const dispatch = useAppDispatch()
  const [isVerifyLoading, setIsLoading] = useState(false)
  const [isErrorNotification, setIsShowErrorNotification] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState('')

  const verifyJira = async () => {
    setIsLoading(true)
    try {
      const response = await boardClient.getVerifyBoard()
      console.log(response)
      if (response.status === 444) {
        handleBoardNoDoneCard()
      } else if (response.status == 200) {
        handleBoardVerifySucceed(response.data)
      } else {
        handleBoardVerifyFailed()
      }
    } catch (e) {
      handleBoardVerifyFailed()
      // throw new Error('error')
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        setIsShowErrorNotification(false)
      }, 2000)
    }
  }

  const handleBoardNoDoneCard = () => {
    console.log('404')
  }

  const handleBoardVerifySucceed = (res: Array<object>) => {
    dispatch(changeBoardVerifyState(true))
    dispatch(updateJiraVerifyResponse(res))
  }

  const handleBoardVerifyFailed = () => {
    setShowErrorMessage('Jira verify failed')
    setIsShowErrorNotification(true)
  }

  return {
    verifyJira,
    isVerifyLoading,
    isErrorNotification,
    showErrorMessage,
  }
}
