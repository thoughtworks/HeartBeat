import { NotificationIconWrapper, sx } from '@src/components/Common/NotificationButton/style'
import { ClickAwayListener, Tooltip } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'

interface NotificationTipProps {
  title: string
  open: boolean
}

export interface NotificationButtonProps {
  notificationProps?: NotificationTipProps
  setNotificationProps?: Dispatch<SetStateAction<NotificationTipProps>>
}

export const NotificationButton = (props: NotificationButtonProps) => {
  const { notificationProps, setNotificationProps } = props
  const handleTooltipClose = () => {
    setNotificationProps &&
      notificationProps &&
      setNotificationProps({
        ...notificationProps,
        open: false,
      })
  }
  const toggleTooltip = () => {
    setNotificationProps &&
      notificationProps &&
      setNotificationProps({
        title: notificationProps.title,
        open: !notificationProps.open,
      })
  }

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Tooltip
        arrow
        onClick={toggleTooltip}
        onClose={handleTooltipClose}
        open={notificationProps?.open}
        title={notificationProps?.title}
        placement={'bottom-start'}
        PopperProps={{
          disablePortal: true,
        }}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        disableInteractive
        slotProps={{
          tooltip: {
            sx: { ...sx },
          },
        }}
      >
        <NotificationIconWrapper data-testid='NotificationIcon' />
      </Tooltip>
    </ClickAwayListener>
  )
}
