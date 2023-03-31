import React, { useEffect, useState } from 'react'
import {
  MetricsStepperContent,
  ButtonGroup,
  NextButton,
  ExportButton,
  BackButton,
  StyledStepper,
  StyledStep,
  StyledStepLabel,
  SaveButton,
  ButtonContainer,
} from './style'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
import { backStep, nextStep, selectStepNumber } from '@src/context/stepper/StepperSlice'
import { ConfigStep } from '@src/components/Metrics/ConfigStep'
import { SAVE_CONFIG_TIPS, STEPS } from '@src/constants'
import { MetricsStep } from '@src/components/Metrics/MetricsStep'
import { ConfirmDialog } from '@src/components/Metrics/MetricsStepper/ConfirmDialog'
import { useNavigate } from 'react-router-dom'
import { selectConfig } from '@src/context/config/configSlice'
import { useMetricsStepValidationCheckContext } from '@src/hooks/useMetricsStepValidationCheckContext'
import { ReportStep } from '@src/components/Metrics/ReportStep'
import { Tooltip } from '@mui/material'
import { exportToJsonFile } from '@src/utils/util'

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
  const { metrics, projectName, dateRange } = config.basic
  useEffect(() => {
    if (!activeStep) {
      const hasMetrics = metrics.length
      const showNextButtonParams = [
        { key: isShowBoard, value: isBoardVerified },
        { key: isShowPipeline, value: isPipelineToolVerified },
        { key: isShowSourceControl, value: isSourceControlVerified },
      ]
      const activeParams = showNextButtonParams.filter(({ key }) => key)
      projectName && dateRange.startDate && dateRange.endDate && hasMetrics
        ? setIsDisableNextButton(!activeParams.every(({ value }) => value))
        : setIsDisableNextButton(true)
    }
  }, [
    activeStep,
    isBoardVerified,
    isPipelineToolVerified,
    isShowBoard,
    isShowSourceControl,
    isShowPipeline,
    isSourceControlVerified,
    metrics,
    projectName,
    dateRange,
  ])
  const { isPipelineValid } = useMetricsStepValidationCheckContext()
  const basicConfig = {
    ...config.basic,
    dateRange: {
      startDate: dateRange.startDate ? new Date(dateRange.startDate) : null,
      endDate: dateRange.endDate ? new Date(dateRange.endDate) : null,
    },
  }
  const handleSave = () => {
    const configData = {
      ...basicConfig,
      board: isShowBoard ? config.boardConfig : undefined,
      pipelineTool: isShowPipeline ? config.pipelineToolConfig : undefined,
      sourceControl: isShowSourceControl ? config.sourceControlConfig : undefined,
    }
    exportToJsonFile('config', configData)
  }

  const handleNext = () => {
    if (activeStep === 0) dispatch(nextStep())

    if (activeStep === 1) {
      isPipelineValid() && dispatch(nextStep())
    }
  }

  const handleBack = () => {
    setIsDialogShowing(!activeStep)
    dispatch(backStep())
  }

  const backToHomePage = () => {
    navigate('/home')
    setIsDialogShowing(false)
    window.location.reload()
  }

  const CancelDialog = () => {
    setIsDialogShowing(false)
  }

  return (
    <>
      <StyledStepper activeStep={activeStep}>
        {STEPS.map((label) => (
          <StyledStep key={label}>
            <StyledStepLabel>{label}</StyledStepLabel>
          </StyledStep>
        ))}
      </StyledStepper>
      <MetricsStepperContent>
        {activeStep === 0 && <ConfigStep />}
        {activeStep === 1 && <MetricsStep />}
        {activeStep === 2 && <ReportStep />}
      </MetricsStepperContent>
      <ButtonContainer>
        <Tooltip title={SAVE_CONFIG_TIPS} placement={'right'}>
          <SaveButton onClick={handleSave}>Save</SaveButton>
        </Tooltip>
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
      </ButtonContainer>
      {isDialogShowing && (
        <ConfirmDialog isDialogShowing={isDialogShowing} onConfirm={backToHomePage} onClose={CancelDialog} />
      )}
    </>
  )
}

export default MetricsStepper
