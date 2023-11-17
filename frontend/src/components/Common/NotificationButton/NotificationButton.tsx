import { NotificationIconWrapper, sx } from '@src/components/Common/NotificationButton/style'
import { ClickAwayListener, Tooltip } from '@mui/material'
import { NotificationContextType } from '@src/hooks/useNotificationContext'

export const NotificationButton = (props: NotificationContextType) => {
  const { notificationProps, setNotificationProps } = props

  const handleTooltipClose = () => {
    setTimeout(() => {
      setNotificationProps({
        ...notificationProps,
        open: false,
      })
    }, 50)
  }
  const toggleTooltip = () => {
    setNotificationProps({
      ...notificationProps,
      open: !notificationProps.open,
    })
  }

  return (
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
        slotProps={{
          tooltip: {
            sx: { ...sx },
          },
        }}
      >
        <NotificationIconWrapper />
      </Tooltip>
    </ClickAwayListener>
  )
}
