import { styled } from '@mui/material/styles'
import { Z_INDEX } from '@src/constants/commons'

export const ErrorNotificationContainer = styled('div')({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: Z_INDEX.MODAL_BACKDROP,
  width: '80%',
})
