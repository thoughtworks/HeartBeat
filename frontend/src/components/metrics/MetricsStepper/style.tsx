import { styled } from '@mui/material/styles'
import Button, { ButtonProps } from '@mui/material/Button'
import theme from '@src/theme'
import StepLabel from '@mui/material/StepLabel'

const basicButtonStyle = {
  boxShadow: '0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)',
  height: '2rem',
  padding: '0 1rem',
  margin: '0 0.5rem',
  fontFamily: 'Roboto,Helvetica Neue,sans-serif',
  fontSize: '0.875rem',
  fontWeight: '500',
  textTransform: theme.typography.button.textTransform,
}

export const MetricsStepLabel = styled(StepLabel)({
  padding: '0 24px',
  height: '72px',
  circle: {
    color: theme.main.backgroundColor,
  },
  path: {
    color: theme.main.backgroundColor,
  },
  span: {
    fontFamily: 'Roboto,Helvetica Neue,sans-serif',
  },
})

export const BackButton = styled(Button)<ButtonProps>({
  ...basicButtonStyle,
  width: '2.25rem',
  backgroundColor: theme.main.color,
  color: 'black',
})

export const NextButton = styled(Button)<ButtonProps>({
  ...basicButtonStyle,
  width: '2.25rem',
  backgroundColor: theme.main.backgroundColor,
  color: theme.main.color,
  '&:hover': {
    ...basicButtonStyle,
    backgroundColor: theme.main.backgroundColor,
    color: theme.main.color,
  },
})

export const ExportButton = styled(Button)<ButtonProps>({
  ...basicButtonStyle,
  width: '10rem',
  backgroundColor: theme.main.backgroundColor,
  color: theme.main.color,
  '&:hover': {
    ...basicButtonStyle,
    backgroundColor: theme.main.backgroundColor,
    color: theme.main.color,
  },
})

export const MetricsStepperBody = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})
