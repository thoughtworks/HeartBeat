import { NotificationIconWrapper, sx } from '@src/components/Common/NotificationButton/style'
import { ClickAwayListener, Tooltip } from '@mui/material'
import { useNotificationLayoutEffectInterface } from '@src/hooks/useNotificationLayoutEffect'

export const NotificationButton = ({ notificationProps, updateProps }: useNotificationLayoutEffectInterface) => {
  const handleTooltipClose = () => {
    if (notificationProps === undefined) return
    updateProps?.({
      title: notificationProps.title,
      open: false,
    })
  }
  const toggleTooltip = () => {
    if (notificationProps === undefined) return
    updateProps?.({
      title: notificationProps.title,
      open: !notificationProps.open,
    })
  }

  return (
    <>
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
    </>
  )
}
