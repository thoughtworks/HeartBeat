import { styled } from '@mui/material/styles'
import { Backdrop } from '@mui/material'
import { theme } from '@src/theme'

export const LoadingDrop = styled(Backdrop)({
  position: 'absolute',
  zIndex: '999',
  backgroundColor: 'rgba(199,199,199,0.43)',
  color: theme.main.backgroundColor,
})
