import { useEffect, useState } from 'react'
import { ErrorBarAutoDismiss, StyledAlert } from './style'
import { ERROR_MESSAGE_TIME_DURATION } from '@src/constants'

export const ErrorNotificationAutoDismiss = (props: { message: string }) => {
  const { message } = props
  const [open, setOpen] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false)
    }, ERROR_MESSAGE_TIME_DURATION)

    return () => {
      clearTimeout(timer)
    }
  }, [])
  return (
    <ErrorBarAutoDismiss open={open}>
      <StyledAlert severity='warning'>{message}</StyledAlert>
    </ErrorBarAutoDismiss>
  )
}
