import { styled } from '@mui/material/styles'
import { theme } from '@src/theme'
import { Z_INDEX } from '@src/constants'
import { NotificationsRounded } from '@mui/icons-material'

export const NotificationIconWrapper = styled(NotificationsRounded)({
  color: theme.main.color,
  marginRight: '0.5rem',
})

export const sx = {
  width: '20vh',
  padding: '1rem',
  fontSize: '1rem',
  fontWeight: '250',
  fontFamily: theme.typography.fontFamily,
  backgroundColor: theme.components ? theme.components.tip.color : theme.main.backgroundColor,
  '& .MuiTooltip-arrow': {
    color: theme.components ? theme.components.tip.color : theme.main.backgroundColor,
  },
  zIndex: Z_INDEX.TOOLTIP,
}