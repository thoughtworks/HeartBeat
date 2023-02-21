import React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import { MetricsStepperContent, MetricsStepLabel } from './style'
import { useAppSelector } from '@src/hooks'
import { selectStep } from '@src/features/stepper/StepperSlice'
import { ConfigStep } from '@src/components/Metrics/ConfigStep'
import { STEPS } from '@src/constants'

const MetricsStepper = () => {
  const activeStep = useAppSelector(selectStep)

  return (
    <Box>
      <Stepper activeStep={activeStep}>
        {STEPS.map((label) => {
          return (
            <Step key={label}>
              <MetricsStepLabel>{label}</MetricsStepLabel>
            </Step>
          )
        })}
      </Stepper>
      <MetricsStepperContent>
        <ConfigStep />
      </MetricsStepperContent>
    </Box>
  )
}

export default MetricsStepper
