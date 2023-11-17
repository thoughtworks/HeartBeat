import React, { createContext, useContext, useState } from 'react'

export interface NotificationProps {
  title: string
  open: boolean
}

export interface NotificationContextType {
  notificationProps: NotificationProps
  setNotificationProps: (notificationProps: NotificationProps) => void
}

export const NotificationContext = createContext<NotificationContextType>({
  notificationProps: { title: '', open: false },
  setNotificationProps: () => {
    // Do nothing
  },
})

interface NotificationProviderProps {
  children: React.ReactNode
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notificationProps, setNotificationProps] = useState({ open: false, title: '' })
  return (
    <NotificationContext.Provider
      value={{
        notificationProps,
        setNotificationProps,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationContext = () => useContext(NotificationContext)
