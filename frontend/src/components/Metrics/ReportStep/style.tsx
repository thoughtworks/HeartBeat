import { styled } from '@mui/material/styles'
import { Z_INDEX } from '@src/constants/commons'

export const StyledErrorNotification = styled('div')({
  zIndex: Z_INDEX.MODAL_BACKDROP,
})

export const StyledSpacing = styled('div')({
  height: '2rem',
})
