import { NotificationIconWrapper, sx, TooltipWrapper } from '@src/components/Common/NotificationButton/style'
import { useState } from 'react'
import { ClickAwayListener, Tooltip } from '@mui/material'

export interface NotificationButtonProps {
  open?: boolean
  title: string
}

export const NotificationButton = (props: NotificationButtonProps) => {
  const [open, setOpen] = useState(props.open)
  const handleTooltipClose = () => {
    setOpen(false)
  }
  const toggleTooltip = () => {
    setOpen(!open)
  }

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Tooltip
        {...props}
        arrow
        onClick={toggleTooltip}
        onClose={handleTooltipClose}
        open={open}
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
