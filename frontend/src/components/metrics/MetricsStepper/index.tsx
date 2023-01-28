import { Fragment, useState } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const steps = ['config', 'metrics', 'export']

const MetricsStepper = () => {
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep === steps.length - 1 ? prevActiveStep : prevActiveStep + 1))
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  return (
    <Box>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => {
          return (
            <Step key={label}>
              <StepLabel>{label} </StepLabel>
            </Step>
          )
        })}
      </Stepper>
      <Fragment>
        <Typography>Step {activeStep + 1}</Typography>
        <Box>
          <Button color='inherit' disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Box />
          <Button onClick={handleNext}>{activeStep === steps.length - 1 ? 'Export board data' : 'Next'}</Button>
        </Box>
      </Fragment>
    </Box>
  )
}

export default MetricsStepper
