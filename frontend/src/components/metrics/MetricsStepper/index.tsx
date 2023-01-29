import { useState } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import { NextButton, BackButton, ExportButton, MetricsStepperBody } from './style'

const steps = ['config', 'metrics', 'export']

const MetricsStepper = () => {
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
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
      <MetricsStepperBody>
        <Typography>Step {activeStep + 1}</Typography>
        <Box>
          <BackButton color='inherit' disabled={activeStep === 0} onClick={handleBack}>
            Back
          </BackButton>
          {activeStep === steps.length - 1 ? (
            <ExportButton> Export board data</ExportButton>
          ) : (
            <NextButton onClick={handleNext}>Next</NextButton>
          )}
        </Box>
      </MetricsStepperBody>
    </Box>
  )
}

export default MetricsStepper
