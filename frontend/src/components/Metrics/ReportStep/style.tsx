import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'
import { theme } from '@src/theme'
import { Z_INDEX } from '@src/constants'

export const basicButtonStyle = {
  height: '2.5rem',
  padding: '0 1rem',
  marginLeft: '0.5rem',
  fontSize: '1rem',
  fontWeight: '500',
  textTransform: theme.typography.button.textTransform,
}

export const ExportButton = styled(Button)({
  ...basicButtonStyle,
  width: '12rem',
  backgroundColor: theme.main.backgroundColor,
  color: theme.main.color,
  '&:hover': {
    ...basicButtonStyle,
    backgroundColor: theme.main.backgroundColor,
    color: theme.main.color,
  },
})

export const ButtonGroupStyle = styled('div')({
  boxSizing: 'border-box',
  display: 'flex',
  textAlign: 'center',
  margin: '0 auto',
  justifyContent: 'flex-end',
  width: '100%',
})

export const ErrorNotificationContainer = styled('div')({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: Z_INDEX.MODAL_BACKDROP,
  width: '80%',
})
