import { Dispatch, SetStateAction, useState } from 'react'
import { changeBoardVerifyState } from '@src/features/board/boardSlice'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { boardClient } from '@src/clients/BoardClient'

export interface useVerifyBoardStateInterface {
  verifyJira: () => Promise<void>
  isVerifyLoading: boolean
  isErrorNotification: boolean
  showErrorMessage: string
  setIsErrorNotification: Dispatch<SetStateAction<boolean>>
}

export const useVerifyBoardState = (): useVerifyBoardStateInterface => {
  const [isVerifyLoading, setIsVerifyLoading] = useState(false)
  const [isErrorNotification, setIsErrorNotification] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState('')
  const dispatch = useAppDispatch()

  const verifyJira = async (): Promise<void> => {
    setIsVerifyLoading(true)
    try {
      const response = await boardClient.getVerifyBoard().then((res) => res)
      console.log('response', response)
      dispatch(changeBoardVerifyState(true))
    } catch (e) {
      setShowErrorMessage('Jira verify failed')
      setIsErrorNotification(true)
    } finally {
      setIsVerifyLoading(false)
    }
  }
  return {
    verifyJira,
    isVerifyLoading,
    isErrorNotification,
    showErrorMessage,
    setIsErrorNotification,
  }
}
