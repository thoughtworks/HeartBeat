import { useEffect, useState } from 'react'
import { DURATION } from '@src/constants/commons'

export interface NotificationTipProps {
  title: string
  open: boolean
  closeAutomatically: boolean
  durationTimeout?: number
}

export interface useNotificationLayoutEffectInterface {
  notificationProps?: NotificationTipProps
  resetProps?: () => void
  updateProps?: (notificationProps: NotificationTipProps) => void
}

export const useNotificationLayoutEffect = (): useNotificationLayoutEffectInterface => {
  const [notificationProps, setNotificationProps] = useState<NotificationTipProps>({
    open: false,
    title: '',
    closeAutomatically: false,
    durationTimeout: DURATION.NOTIFICATION_TIME,
  })

  const resetProps = () => {
    setNotificationProps(() => ({
      open: false,
      title: '',
      closeAutomatically: false,
      durationTimeout: DURATION.NOTIFICATION_TIME,
    }))
  }

  const updateProps = (notificationProps: NotificationTipProps) => {
    setNotificationProps(notificationProps)
  }

  const closeAutomatically = () => {
    const durationTimeout = notificationProps.durationTimeout
      ? notificationProps.durationTimeout
      : DURATION.NOTIFICATION_TIME
    const timerId: NodeJS.Timer = setTimeout(() => {
      resetProps()
      return clearTimeout(timerId)
    }, durationTimeout)
  }

  useEffect(() => {
    notificationProps?.closeAutomatically && closeAutomatically()
  }, [notificationProps])

  return { notificationProps, resetProps, updateProps }
}
