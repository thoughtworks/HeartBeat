import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'
import { theme } from '@src/theme'
import { ErrorNotification } from '@src/components/ErrorNotification'

export const basicButtonStyle = {
  boxShadow: theme.main.boxShadow,
  height: '2rem',
  padding: '0 1rem',
  margin: '0 1rem',
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
  padding: '1rem',
  display: 'block',
  textAlign: 'center',
  margin: '0 auto',
  justifyContent: 'space-around',
  width: '100%',
})

export const ErrorNotificationContainer = styled(ErrorNotification)({
  top: '50%',
  width: '100%',
  height: '20rem',
  display: 'flex',
  justifyContent: 'center',
})

export const ParentContainer = styled('div')({
  position: 'relative',
})
