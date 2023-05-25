import { styled } from '@mui/material/styles'
import { Button, Step, StepLabel, Stepper } from '@mui/material'
import { theme } from '@src/theme'

export const StyledStepper = styled(Stepper)({
  marginTop: '1rem',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    fontSize: '0.5rem',
  },
})

export const StyledStep = styled(Step)({
  [theme.breakpoints.down('md')]: {
    padding: '0.25rem 0',
  },
})

export const StyledStepLabel = styled(StepLabel)({
  width: '5rem',
  padding: '0 1rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.5rem',
  },
})

export const MetricsStepperContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '60%',
  margin: '0 auto',
  textAlign: 'left',
  [theme.breakpoints.down('md')]: {
    width: '80%',
  },
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

export const SaveButton = styled(Button)({
  ...basicButtonStyle,
  width: '3rem',
  backgroundColor: theme.main.backgroundColor,
  color: 'white',
  '&:hover': {
    background: theme.main.backgroundColor,
  },
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
  '&:disabled': {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    color: 'rgba(0,0,0,0.35)',
  },
  '&:hover': {
    backgroundColor: theme.main.backgroundColor,
  },
})

export const ButtonGroup = styled('div')({
  padding: '1rem',
})

export const ButtonContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  margin: '0 auto',
  padding: '2rem 0',
  width: '100%',
})
