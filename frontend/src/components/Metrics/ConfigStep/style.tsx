import { theme } from '@src/theme'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import { TextField } from '@mui/material'

const basicButtonStyle = {
  boxShadow:
    '0 0.2rem 0.1rem -0.1rem rgb(0 0 0 / 20%), 0 0.1rem 0.1rem 0 rgb(0 0 0 / 14%), 0 0.1rem 0.3rem 0 rgb(0 0 0 / 12%)',
  height: '2rem',
  padding: '0 1rem',
  margin: '0 1rem',
  fontSize: '1rem',
  fontWeight: '500',
  textTransform: theme.typography.button.textTransform,
}

export const ConfigStepWrapper = styled('div')({
  width: '100%',
})

export const BackButton = styled(Button)({
  ...basicButtonStyle,
  width: '3rem',
  color: theme.main.secondColor,
})

export const NextButton = styled(Button)({
  ...basicButtonStyle,
  width: '3rem',
  backgroundColor: theme.main.backgroundColor,
  color: theme.main.color,
  '&:hover': {
    ...basicButtonStyle,
    backgroundColor: theme.main.backgroundColor,
    color: theme.main.color,
  },
})

export const ExportButton = styled(Button)({
  ...basicButtonStyle,
  width: '11rem',
  backgroundColor: theme.main.backgroundColor,
  color: theme.main.color,
  '&:hover': {
    ...basicButtonStyle,
    backgroundColor: theme.main.backgroundColor,
    color: theme.main.color,
  },
})

export const ProjectNameInput = styled(TextField)({
  minWidth: '30rem',
  maxWidth: '40rem',
})

export const ButtonGroup = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '1rem',
})
