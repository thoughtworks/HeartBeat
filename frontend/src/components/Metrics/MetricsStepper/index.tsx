import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import { MetricsStepperContent, MetricsStepLabel, ButtonGroup, NextButton, ExportButton, BackButton } from './style'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
import { backStep, nextStep, selectStepNumber } from '@src/context/stepper/StepperSlice'
import { ConfigStep } from '@src/components/Metrics/ConfigStep'
import { STEPS } from '@src/constants'
import { MetricsStep } from '@src/components/Metrics/MetricsStep'
import { ConfirmDialog } from '@src/components/Metrics/MetricsStepper/ConfirmDialog'
import { useNavigate } from 'react-router-dom'

const MetricsStepper = () => {
  const dispatch = useAppDispatch()
  const activeStep = useAppSelector(selectStepNumber)
  const [isDialogShowing, setIsDialogShowing] = useState(false)
  const navigate = useNavigate()
  const handleNext = () => {
    dispatch(nextStep())
  }

  const handleBack = () => {
    setIsDialogShowing(true)
    dispatch(backStep())
  }

  const confirmDialog = () => {
    navigate('/home')
    setIsDialogShowing(false)
  }

  const CancelDialog = () => {
    setIsDialogShowing(false)
  }

  return (
    <Box>
      <Stepper activeStep={activeStep}>
        {STEPS.map((label) => (
          <Step key={label}>
            <MetricsStepLabel>{label}</MetricsStepLabel>
          </Step>
        ))}
      </Stepper>
      <MetricsStepperContent>
        {activeStep === 0 && <ConfigStep />}
        {activeStep === 1 && <MetricsStep />}
      </MetricsStepperContent>
      <ButtonGroup>
        <BackButton onClick={handleBack}>Back</BackButton>
        {activeStep === STEPS.length - 1 ? (
          <ExportButton>Export board data</ExportButton>
        ) : (
          <NextButton onClick={handleNext}>Next</NextButton>
        )}
      </ButtonGroup>
      {isDialogShowing && (
        <ConfirmDialog isDialogShowing={isDialogShowing} onConfirm={confirmDialog} onClose={CancelDialog} />
      )}
    </Box>
  )
}

export default MetricsStepper
