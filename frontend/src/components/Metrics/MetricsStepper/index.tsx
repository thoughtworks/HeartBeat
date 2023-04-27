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
import { PIPELINE_SETTING_TYPES, SAVE_CONFIG_TIPS, STEPS } from '@src/constants'
import { MetricsStep } from '@src/components/Metrics/MetricsStep'
import { ConfirmDialog } from '@src/components/Metrics/MetricsStepper/ConfirmDialog'
import { useNavigate } from 'react-router-dom'
import { selectConfig } from '@src/context/config/configSlice'
import { useMetricsStepValidationCheckContext } from '@src/hooks/useMetricsStepValidationCheckContext'
import { ReportStep } from '@src/components/Metrics/ReportStep'
import { Tooltip } from '@mui/material'
import { exportToJsonFile } from '@src/utils/util'
import { selectMetricsContent, updateMetricsState } from '@src/context/Metrics/metricsSlice'

const MetricsStepper = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const activeStep = useAppSelector(selectStepNumber)
  const [isDialogShowing, setIsDialogShowing] = useState(false)
  const config = useAppSelector(selectConfig)
  const metricsConfig = useAppSelector(selectMetricsContent)
  const [isDisableNextButton, setIsDisableNextButton] = useState(true)

  const { isShow: isShowBoard, isVerified: isBoardVerified } = config.board
  const { isShow: isShowPipeline, isVerified: isPipelineToolVerified } = config.pipelineTool
  const { isShow: isShowSourceControl, isVerified: isSourceControlVerified } = config.sourceControl
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
  const handleSave = () => {
    const { projectName, dateRange, calendarType, metrics } = config.basic
    const configData = {
      projectName,
      dateRange,
      calendarType,
      metrics,
      board: isShowBoard ? config.board.config : undefined,
      pipelineTool: isShowPipeline ? config.pipelineTool.config : undefined,
      sourceControl: isShowSourceControl ? config.sourceControl.config : undefined,
    }

    const {
      leadTimeForChanges,
      deploymentFrequencySettings,
      users,
      doneColumn,
      targetFields,
      boardColumns,
      treatFlagCardAsBlock,
    } = Object.fromEntries(
      Object.entries(metricsConfig).filter(
        ([key, value]) =>
          !Array.isArray(value) ||
          (Array.isArray(value) &&
            !value.every((item) => item.organization === '') &&
            value.length > 0 &&
            !value.every((item) => item.flag === false))
      )
    )

    const metricsData = {
      deployment: deploymentFrequencySettings,
      leadTime: leadTimeForChanges,
      doneStatus: doneColumn,
      crews: users,
      cycleTime: boardColumns
        ? {
            jiraColumns: boardColumns?.map(({ name, value }: { name: string; value: string }) => ({ [name]: value })),
            treatFlagCardAsBlock,
          }
        : undefined,
      classification: targetFields
        ?.filter((item: { name: string; key: string; flag: boolean }) => item.flag)
        ?.map((item: { name: string; key: string; flag: boolean }) => item.key),
    }
    const jsonData = activeStep === 0 ? configData : { ...configData, ...metricsData }
    exportToJsonFile('config', jsonData)
  }

  const handleNext = () => {
    if (activeStep === 0) {
      dispatch(updateMetricsState(config))
      dispatch(nextStep())
    }

    if (activeStep === 1) {
      isPipelineValid(PIPELINE_SETTING_TYPES.LEAD_TIME_FOR_CHANGES_TYPE) &&
        isPipelineValid(PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE) &&
        dispatch(nextStep())
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
        {activeStep !== 2 && (
          <Tooltip title={SAVE_CONFIG_TIPS} placement={'right'}>
            <SaveButton onClick={handleSave}>Save</SaveButton>
          </Tooltip>
        )}
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
