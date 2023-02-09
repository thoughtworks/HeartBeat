import { theme } from '@src/theme'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import { TextField } from '@mui/material'

const basicButtonStyle = {
  boxShadow: '0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)',
  height: '2rem',
  padding: '0 1rem',
  margin: '0 1rem',
  fontSize: '1rem',
  fontWeight: '500',
  textTransform: theme.typography.button.textTransform,
}

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
  minWidth: '8rem',
  maxWidth: '20rem',
})

export const ButtonGroup = styled('div')({
  padding: '1rem',
  display: 'flex',
  justifyContent: 'flex-end',
})
