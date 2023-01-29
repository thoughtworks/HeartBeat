import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import Typography from '@mui/material/Typography'
import { NextButton, BackButton, ExportButton, MetricsStepperBody, MetricsStepLabel } from './style'

const steps = ['Config', 'Metrics', 'Export']
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
              <MetricsStepLabel>{label}</MetricsStepLabel>
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
