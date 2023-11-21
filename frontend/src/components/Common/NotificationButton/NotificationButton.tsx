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

export const NotificationButton = ({
  notificationProps = { title: '', open: false },
  setNotificationProps,
}: NotificationButtonProps) => {
  const handleTooltipClose = () => {
    setNotificationProps?.(() => ({
      title: notificationProps.title,
      open: false,
    }))
  }
  const toggleTooltip = () => {
    setNotificationProps?.((prevState) => ({
      title: prevState.title,
      open: !prevState.open,
    }))
  }

  return (
    <>
      {notificationProps && (
        <ClickAwayListener onClickAway={handleTooltipClose}>
          <Tooltip
            arrow
            onClick={toggleTooltip}
            onClose={handleTooltipClose}
            open={notificationProps.open}
            title={notificationProps.title}
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
      )}
    </>
  )
}
