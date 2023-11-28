import { useState } from 'react'

export interface NotificationTipProps {
  title: string
  open: boolean
}

export interface useNotificationLayoutEffectInterface {
  notificationProps?: NotificationTipProps
  resetProps?: () => void
  updateProps?: (notificationProps: NotificationTipProps) => void
}

export const useNotificationLayoutEffect = (): useNotificationLayoutEffectInterface => {
  const [notificationProps, setNotificationProps] = useState({ open: false, title: '' })

  const resetProps = () => {
    setNotificationProps(() => ({
      open: false,
      title: '',
    }))
  }

  const updateProps = (notificationProps: NotificationTipProps) => {
    setNotificationProps(() => notificationProps)
  }

  return { notificationProps, resetProps, updateProps }
}
