import { styled } from '@mui/material/styles'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import { theme } from '@src/theme'

export const MetricsStepLabel = styled(StepLabel)({
  padding: '0 2rem',
  height: '4rem',
})

export const MetricsStepperContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '60%',
  margin: '0 auto',
  textAlign: 'left',
})

export const basicButtonStyle = {
  boxShadow: theme.main.boxShadow,
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

export const ButtonGroup = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  width: '60%',
  margin: '0 auto',
  padding: '1rem',
})
