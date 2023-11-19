import React, { lazy, Suspense, useEffect, useState } from 'react'
import {
  BackButton,
  ButtonContainer,
  ButtonGroup,
  MetricsStepperContent,
  NextButton,
  SaveButton,
  StyledStep,
  StyledStepLabel,
  StyledStepper,
} from './style'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
import { backStep, nextStep, selectStepNumber, updateTimeStamp } from '@src/context/stepper/StepperSlice'
import {
  BOARD_TYPES,
  HOME_PAGE_ROUTE,
  METRICS_CONSTANTS,
  METRICS_STEPS,
  PIPELINE_SETTING_TYPES,
  PIPELINE_TOOL_TYPES,
  REQUIRED_DATA,
  SAVE_CONFIG_TIPS,
  SOURCE_CONTROL_TYPES,
  STEPS,
} from '@src/constants'
import { ConfirmDialog } from '@src/components/Metrics/MetricsStepper/ConfirmDialog'
import { useNavigate } from 'react-router-dom'
import {
  selectConfig,
  selectMetrics,
  updateBoard,
  updateBoardVerifyState,
  updatePipelineTool,
  updatePipelineToolVerifyState,
  updateSourceControl,
  updateSourceControlVerifyState,
} from '@src/context/config/configSlice'
import { useMetricsStepValidationCheckContext } from '@src/hooks/useMetricsStepValidationCheckContext'
import { Tooltip } from '@mui/material'
import { exportToJsonFile } from '@src/utils/util'
import {
  savedMetricsSettingState,
  selectCycleTimeSettings,
  selectMetricsContent,
} from '@src/context/Metrics/metricsSlice'
import _ from 'lodash'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import { NotificationButtonProps } from '@src/components/Common/NotificationButton/NotificationButton'

const ConfigStep = lazy(() => import('@src/components/Metrics/ConfigStep'))
const MetricsStep = lazy(() => import('@src/components/Metrics/MetricsStep'))
const ReportStep = lazy(() => import('@src/components/Metrics/ReportStep'))

/* istanbul ignore next */
const MetricsStepper = (props: NotificationButtonProps) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const activeStep = useAppSelector(selectStepNumber)
  const [isDialogShowing, setIsDialogShowing] = useState(false)
  const requiredData = useAppSelector(selectMetrics)
  const config = useAppSelector(selectConfig)
  const metricsConfig = useAppSelector(selectMetricsContent)
  const [isDisableNextButton, setIsDisableNextButton] = useState(true)
  const { getDuplicatedPipeLineIds } = useMetricsStepValidationCheckContext()

  const { isShow: isShowBoard, isVerified: isBoardVerified } = config.board
  const { isShow: isShowPipeline, isVerified: isPipelineToolVerified } = config.pipelineTool
  const { isShow: isShowSourceControl, isVerified: isSourceControlVerified } = config.sourceControl
  const { metrics, projectName, dateRange } = config.basic

  const selectedBoardColumns = useAppSelector(selectCycleTimeSettings)
  const verifyPipeline = (type: string) => {
    const pipelines =
      type === PIPELINE_SETTING_TYPES.LEAD_TIME_FOR_CHANGES_TYPE
        ? metricsConfig.leadTimeForChanges
        : metricsConfig.deploymentFrequencySettings
    return (
      pipelines.every(({ step }) => step !== '') &&
      pipelines.every(({ branches }) => !_.isEmpty(branches)) &&
      getDuplicatedPipeLineIds(pipelines).length === 0
    )
  }

  const isShowCrewsSetting = isShowBoard
  const isShowRealDone =
    isShowBoard && selectedBoardColumns.filter((column) => column.value === METRICS_CONSTANTS.doneValue).length > 0
  const isShowDeploymentFrequency =
    requiredData.includes(REQUIRED_DATA.DEPLOYMENT_FREQUENCY) ||
    requiredData.includes(REQUIRED_DATA.CHANGE_FAILURE_RATE) ||
    requiredData.includes(REQUIRED_DATA.MEAN_TIME_TO_RECOVERY)
  const isCrewsSettingValid = metricsConfig.users.length > 0
  const isRealDoneValid = metricsConfig.doneColumn.length > 0
  const isDeploymentFrequencyValid = verifyPipeline(PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE)

  useEffect(() => {
    if (!activeStep) {
      const nextButtonValidityOptions = [
        { isShow: isShowBoard, isValid: isBoardVerified },
        { isShow: isShowPipeline, isValid: isPipelineToolVerified },
        { isShow: isShowSourceControl, isValid: isSourceControlVerified },
      ]
      const activeNextButtonValidityOptions = nextButtonValidityOptions.filter(({ isShow }) => isShow)
      projectName && dateRange.startDate && dateRange.endDate && metrics.length
        ? setIsDisableNextButton(!activeNextButtonValidityOptions.every(({ isValid }) => isValid))
        : setIsDisableNextButton(true)
    } else if (activeStep === METRICS_STEPS.METRICS) {
      const nextButtonValidityOptions = [
        { isShow: isShowCrewsSetting, isValid: isCrewsSettingValid },
        { isShow: isShowRealDone, isValid: isRealDoneValid },
        { isShow: isShowDeploymentFrequency, isValid: isDeploymentFrequencyValid },
      ]
      const activeNextButtonValidityOptions = nextButtonValidityOptions.filter(({ isShow }) => isShow)
      activeNextButtonValidityOptions.every(({ isValid }) => isValid)
        ? setIsDisableNextButton(false)
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
    selectedBoardColumns,
    metricsConfig,
  ])

  const filterMetricsConfig = (metricsConfig: savedMetricsSettingState) => {
    return Object.fromEntries(
      Object.entries(metricsConfig).filter(([, value]) => {
        /* istanbul ignore next */
        if (Array.isArray(value)) {
          return (
            !value.every((item) => item.organization === '') &&
            !value.every((item) => item.flag === false) &&
            value.length > 0
          )
        } else {
          return true
        }
      })
    )
  }

  /* istanbul ignore next */
  const handleSave = () => {
    const { projectName, dateRange, calendarType, metrics } = config.basic
    const configData = {
      projectName,
      dateRange,
      calendarType,
      metrics,

      board: isShowBoard ? config.board.config : undefined,
      /* istanbul ignore next */
      pipelineTool: isShowPipeline ? config.pipelineTool.config : undefined,
      /* istanbul ignore next */
      sourceControl: isShowSourceControl ? config.sourceControl.config : undefined,
    }

    const {
      leadTimeForChanges,
      deploymentFrequencySettings,
      users,
      pipelineCrews,
      doneColumn,
      targetFields,
      cycleTimeSettings,
      treatFlagCardAsBlock,
      assigneeFilter,
    } = filterMetricsConfig(metricsConfig)

    /* istanbul ignore next */
    const metricsData = {
      crews: users,
      assigneeFilter: assigneeFilter,
      /* istanbul ignore next */
      pipelineCrews,
      cycleTime: cycleTimeSettings
        ? {
            /* istanbul ignore next */
            jiraColumns: cycleTimeSettings?.map(({ name, value }: { name: string; value: string }) => ({
              [name]: value,
            })),
            treatFlagCardAsBlock,
          }
        : undefined,
      doneStatus: doneColumn,
      classification: targetFields
        ?.filter((item: { name: string; key: string; flag: boolean }) => item.flag)
        ?.map((item: { name: string; key: string; flag: boolean }) => item.key),
      deployment: deploymentFrequencySettings,
      leadTime: leadTimeForChanges,
    }
    const jsonData = activeStep === METRICS_STEPS.CONFIG ? configData : { ...configData, ...metricsData }
    exportToJsonFile('config', jsonData)
  }

  const handleNext = () => {
    if (activeStep === METRICS_STEPS.METRICS) {
      dispatch(updateTimeStamp(new Date().getTime()))
    }
    if (activeStep === METRICS_STEPS.CONFIG) {
      cleanBoardState()
      cleanPipelineToolConfiguration()
      cleanSourceControlState()
    }
    dispatch(nextStep())
  }

  const handleBack = () => {
    setIsDialogShowing(!activeStep)
    dispatch(backStep())
  }

  const backToHomePage = () => {
    navigate(HOME_PAGE_ROUTE)
    setIsDialogShowing(false)
    window.location.reload()
  }

  const CancelDialog = () => {
    setIsDialogShowing(false)
  }

  const cleanPipelineToolConfiguration = () => {
    !isShowPipeline && dispatch(updatePipelineTool({ type: PIPELINE_TOOL_TYPES.BUILD_KITE, token: '' }))
    isShowPipeline
      ? dispatch(updatePipelineToolVerifyState(isPipelineToolVerified))
      : dispatch(updatePipelineToolVerifyState(false))
  }

  const cleanSourceControlState = () => {
    !isShowSourceControl && dispatch(updateSourceControl({ type: SOURCE_CONTROL_TYPES.GITHUB, token: '' }))
    isShowSourceControl
      ? dispatch(updateSourceControlVerifyState(isSourceControlVerified))
      : dispatch(updateSourceControlVerifyState(false))
  }

  const cleanBoardState = () => {
    !isShowBoard &&
      dispatch(
        updateBoard({
          type: BOARD_TYPES.JIRA,
          boardId: '',
          email: '',
          projectKey: '',
          site: '',
          token: '',
        })
      )
    isShowBoard ? dispatch(updateBoardVerifyState(isBoardVerified)) : dispatch(updateBoardVerifyState(false))
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
        <Suspense>
          {activeStep === METRICS_STEPS.CONFIG && <ConfigStep />}
          {activeStep === METRICS_STEPS.METRICS && <MetricsStep />}
          {activeStep === METRICS_STEPS.REPORT && <ReportStep {...props} />}
        </Suspense>
      </MetricsStepperContent>
      <ButtonContainer>
        {activeStep !== METRICS_STEPS.REPORT && (
          <>
            <Tooltip title={SAVE_CONFIG_TIPS} placement={'right'}>
              <SaveButton variant='text' onClick={handleSave} startIcon={<SaveAltIcon />}>
                Save
              </SaveButton>
            </Tooltip>
            <ButtonGroup>
              <BackButton variant='outlined' onClick={handleBack}>
                Previous
              </BackButton>
              <NextButton onClick={handleNext} disabled={isDisableNextButton}>
                Next
              </NextButton>
            </ButtonGroup>
          </>
        )}
      </ButtonContainer>
      {isDialogShowing && (
        <ConfirmDialog isDialogShowing={isDialogShowing} onConfirm={backToHomePage} onClose={CancelDialog} />
      )}
    </>
  )
}

export default MetricsStepper
