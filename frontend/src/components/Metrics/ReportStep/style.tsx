import { styled } from '@mui/material/styles'
import { Z_INDEX } from '@src/constants/commons'
import { theme } from '@src/theme'

export const StyledErrorNotification = styled('div')({
  zIndex: Z_INDEX.MODAL_BACKDROP,
})

export const StyledSpacing = styled('div')({
  height: '1.5rem',
})

export const basicButtonStyle = {
  height: '2.5rem',
  padding: '0 1rem',
  marginLeft: '0.5rem',
  fontSize: '1rem',
  fontWeight: '500',
  textTransform: theme.typography.button.textTransform,
}
