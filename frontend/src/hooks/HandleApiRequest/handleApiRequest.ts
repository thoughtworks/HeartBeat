import { Dispatch, SetStateAction } from 'react'
import { ERROR_MESSAGE_TIME_DURATION, UNKNOWN_EXCEPTION } from '@src/constants'

export const handleApiRequest = async <T>(
  apiCall: () => Promise<T>,
  errorHandler: (err: Error) => void,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setIsServerError: Dispatch<SetStateAction<boolean>>,
  setErrorMessage: Dispatch<SetStateAction<string>>
) => {
  setIsLoading(true)
  try {
    return await apiCall()
  } catch (e) {
    const err = e as Error
    if (err.message === UNKNOWN_EXCEPTION) {
      setIsServerError(true)
    } else {
      errorHandler(err)
      setTimeout(() => {
        setErrorMessage('')
      }, ERROR_MESSAGE_TIME_DURATION)
    }
  } finally {
    setIsLoading(false)
  }
}
