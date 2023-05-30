import { useEffect, useState } from 'react'
import { StyledAlert, WarningBar } from './style'
import { ERROR_MESSAGE_TIME_DURATION } from '@src/constants'

export const WarningNotification = (props: { message: string }) => {
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
    <WarningBar open={open}>
      <StyledAlert severity='warning'>{message}</StyledAlert>
    </WarningBar>
  )
}
