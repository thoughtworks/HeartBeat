import React, { useEffect, useState } from 'react'
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
import { selectConfig } from '@src/context/config/configSlice'

const MetricsStepper = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const activeStep = useAppSelector(selectStepNumber)
  const [isDialogShowing, setIsDialogShowing] = useState(false)
  const config = useAppSelector(selectConfig)
  const [isDisableNextButton, setIsDisableNextButton] = useState(true)
  const {
    isShowBoard,
    isBoardVerified,
    isShowPipeline,
    isPipelineToolVerified,
    isShowSourceControl,
    isSourceControlVerified,
  } = config
  useEffect(() => {
    if (!activeStep) {
      const showNextButtonParams = [
        {
          key: isShowBoard,
          value: isBoardVerified,
        },
        {
          key: isShowPipeline,
          value: isPipelineToolVerified,
        },
        {
          key: isShowSourceControl,
          value: isSourceControlVerified,
        },
      ]
      const result: { key: boolean; value: boolean }[] = []
      showNextButtonParams.map((target) => {
        if (target.key) result.push(target)
      })
      setIsDisableNextButton(!result.every((item) => item.value))
    }
  }, [
    activeStep,
    isBoardVerified,
    isPipelineToolVerified,
    isShowBoard,
    isShowSourceControl,
    isShowPipeline,
    isSourceControlVerified,
  ])

  const handleNext = () => {
    dispatch(nextStep())
  }

  const handleBack = () => {
    setIsDialogShowing(!activeStep)
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
          <NextButton onClick={handleNext} disabled={isDisableNextButton}>
            Next
          </NextButton>
        )}
      </ButtonGroup>
      {isDialogShowing && (
        <ConfirmDialog isDialogShowing={isDialogShowing} onConfirm={confirmDialog} onClose={CancelDialog} />
      )}
    </Box>
  )
}

export default MetricsStepper
