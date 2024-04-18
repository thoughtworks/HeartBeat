import {
  BackButton,
  ButtonContainer,
  MetricsStepperContent,
  NextButton,
  SaveButton,
  StyledStep,
  StyledStepLabel,
  StyledStepper,
} from './style';
import {
  ISavedMetricsSettingState,
  selectCycleTimeSettings,
  selectMetricsContent,
} from '@src/context/Metrics/metricsSlice';
import { CYCLE_TIME_SETTINGS_TYPES, DONE, METRICS_CONSTANTS, REQUIRED_DATA, TIPS } from '@src/constants/resources';
import { backStep, nextStep, selectStepNumber, updateTimeStamp } from '@src/context/stepper/StepperSlice';
import { useMetricsStepValidationCheckContext } from '@src/hooks/useMetricsStepValidationCheckContext';
import { convertCycleTimeSettings, exportToJsonFile, onlyEmptyAndDoneState } from '@src/utils/util';
import { selectConfig, selectMetrics, selectPipelineList } from '@src/context/config/configSlice';
import { COMMON_BUTTONS, METRICS_STEPS, STEPS } from '@src/constants/commons';
import { ConfirmDialog } from '@src/containers/MetricsStepper/ConfirmDialog';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { getFormMeta } from '@src/context/meta/metaSlice';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useNavigate } from 'react-router-dom';
import { ROUTE } from '@src/constants/router';
import { Tooltip } from '@mui/material';
import isEmpty from 'lodash/isEmpty';
import every from 'lodash/every';
import omit from 'lodash/omit';

const ConfigStep = lazy(() => import('@src/containers/ConfigStep'));
const MetricsStep = lazy(() => import('@src/containers/MetricsStep'));
const ReportStep = lazy(() => import('@src/containers/ReportStep'));

/* istanbul ignore next */
const MetricsStepper = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const activeStep = useAppSelector(selectStepNumber);
  const [isDialogShowing, setIsDialogShowing] = useState(false);
  const requiredData = useAppSelector(selectMetrics);
  const config = useAppSelector(selectConfig);
  const metricsConfig = useAppSelector(selectMetricsContent);
  const cycleTimeSettings = useAppSelector(selectCycleTimeSettings);
  const [isDisableNextButton, setIsDisableNextButton] = useState(true);
  const { getDuplicatedPipeLineIds } = useMetricsStepValidationCheckContext();
  const formMeta = useAppSelector(getFormMeta);
  const pipelineList = useAppSelector(selectPipelineList);

  const { isShow: isShowBoard, isVerified: isBoardVerified } = config.board;
  const { isShow: isShowPipeline, isVerified: isPipelineToolVerified } = config.pipelineTool;
  const { isShow: isShowSourceControl, isVerified: isSourceControlVerified } = config.sourceControl;
  const isShowCycleTimeSettings =
    requiredData.includes(REQUIRED_DATA.CYCLE_TIME) ||
    requiredData.includes(REQUIRED_DATA.CLASSIFICATION) ||
    requiredData.includes(REQUIRED_DATA.VELOCITY);
  const isCycleTimeSettingsVerified = cycleTimeSettings.some((e) => e.value === DONE);
  const boardingMappingStatus = [...new Set(cycleTimeSettings.map((item) => item.value))];
  const isOnlyEmptyAndDoneState = onlyEmptyAndDoneState(boardingMappingStatus);
  const onlyIncludeReworkMetrics = requiredData.includes(REQUIRED_DATA.REWORK_TIMES) && requiredData.length === 1;
  const isShowClassificationSetting = requiredData.includes(REQUIRED_DATA.CLASSIFICATION);
  const isShowReworkSettings = requiredData.includes(REQUIRED_DATA.REWORK_TIMES);
  const isClassificationSettingVerified = metricsConfig.targetFields.some((item) => item.flag);
  const isReworkStateSelected = !!metricsConfig.importedData.reworkTimesSettings.reworkState;
  const { metrics, projectName, dateRange } = config.basic;

  const isShowRealDone =
    isShowBoard &&
    metricsConfig.cycleTimeSettingsType === CYCLE_TIME_SETTINGS_TYPES.BY_COLUMN &&
    metricsConfig.cycleTimeSettings.filter(({ value }) => value === METRICS_CONSTANTS.doneValue).length > 1;
  const isShowDeploymentFrequency =
    requiredData.includes(REQUIRED_DATA.DEPLOYMENT_FREQUENCY) ||
    requiredData.includes(REQUIRED_DATA.DEV_CHANGE_FAILURE_RATE) ||
    requiredData.includes(REQUIRED_DATA.LEAD_TIME_FOR_CHANGES) ||
    requiredData.includes(REQUIRED_DATA.DEV_MEAN_TIME_TO_RECOVERY);
  const isCrewsSettingValid = metricsConfig.users.length > 0;
  const isRealDoneValid = metricsConfig.doneColumn.length > 0;

  const isDeploymentFrequencyValid = useMemo(() => {
    const pipelines = metricsConfig.deploymentFrequencySettings;
    const pipelinesFormMeta = formMeta.metrics.pipelines;
    const selectedPipelines = pipelineList.filter((pipeline) => {
      const selectedPipelineName = pipelines.map((item) => item.pipelineName);
      const selectedPipelineOrgName = pipelines.map((item) => item.organization);
      return selectedPipelineName.includes(pipeline.name) && selectedPipelineOrgName.includes(pipeline.orgName);
    });

    return (
      !isEmpty(selectedPipelines) &&
      pipelines.every(({ step }) => !isEmpty(step)) &&
      pipelines.every(({ branches }) => !isEmpty(branches)) &&
      selectedPipelines.every(({ steps }) => !isEmpty(steps)) &&
      selectedPipelines.every(({ branches }) => !isEmpty(branches)) &&
      getDuplicatedPipeLineIds(pipelines).length === 0 &&
      every(pipelinesFormMeta, (item) => every(item.branches, (branch) => !branch.error && !branch.needVerify))
    );
  }, [pipelineList, formMeta.metrics.pipelines, getDuplicatedPipeLineIds, metricsConfig.deploymentFrequencySettings]);

  useEffect(() => {
    if (activeStep === METRICS_STEPS.CONFIG) {
      const nextButtonValidityOptions = [
        { isShow: isShowBoard, isValid: isBoardVerified },
        { isShow: isShowPipeline, isValid: isPipelineToolVerified },
        { isShow: isShowSourceControl, isValid: isSourceControlVerified },
      ];
      const activeNextButtonValidityOptions = nextButtonValidityOptions.filter(({ isShow }) => isShow);
      projectName && dateRange && dateRange.length && metrics.length
        ? setIsDisableNextButton(!activeNextButtonValidityOptions.every(({ isValid }) => isValid))
        : setIsDisableNextButton(true);
    }

    if (activeStep === METRICS_STEPS.METRICS) {
      const nextButtonValidityOptions = [
        { isShow: isShowBoard, isValid: isCrewsSettingValid },
        { isShow: isShowRealDone, isValid: isRealDoneValid },
        { isShow: isShowDeploymentFrequency, isValid: isDeploymentFrequencyValid },
        { isShow: isShowCycleTimeSettings, isValid: isCycleTimeSettingsVerified },
        { isShow: isShowClassificationSetting, isValid: isClassificationSettingVerified },
        {
          isShow: isShowReworkSettings,
          isValid: isReworkStateSelected || (isOnlyEmptyAndDoneState && !onlyIncludeReworkMetrics),
        },
      ];
      const activeNextButtonValidityOptions = nextButtonValidityOptions.filter(({ isShow }) => isShow);
      activeNextButtonValidityOptions.every(({ isValid }) => isValid)
        ? setIsDisableNextButton(false)
        : setIsDisableNextButton(true);
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
    metricsConfig,
    isCrewsSettingValid,
    isShowRealDone,
    isRealDoneValid,
    isShowDeploymentFrequency,
    isDeploymentFrequencyValid,
    isShowCycleTimeSettings,
    isCycleTimeSettingsVerified,
    isShowClassificationSetting,
    isClassificationSettingVerified,
    isReworkStateSelected,
    isShowReworkSettings,
    isOnlyEmptyAndDoneState,
    onlyIncludeReworkMetrics,
  ]);

  const filterMetricsConfig = (metricsConfig: ISavedMetricsSettingState) => {
    return Object.fromEntries(
      Object.entries(metricsConfig).filter(([, value]) => {
        /* istanbul ignore next */
        if (Array.isArray(value)) {
          return (
            !value.every((item) => item.organization === '') &&
            !value.every((item) => item.flag === false) &&
            value.length > 0
          );
        } else {
          return true;
        }
      }),
    );
  };

  /* istanbul ignore next */
  const handleSave = () => {
    const { projectName, dateRange, calendarType, metrics } = config.basic;
    const configData = {
      projectName,
      dateRange,
      calendarType,
      metrics,

      board: isShowBoard ? omit(config.board.config, ['projectKey']) : undefined,
      /* istanbul ignore next */
      pipelineTool: isShowPipeline ? config.pipelineTool.config : undefined,
      /* istanbul ignore next */
      sourceControl: isShowSourceControl ? config.sourceControl.config : undefined,
    };

    const {
      leadTimeForChanges,
      deploymentFrequencySettings,
      users,
      pipelineCrews,
      doneColumn,
      targetFields,
      cycleTimeSettings,
      cycleTimeSettingsType,
      treatFlagCardAsBlock,
      assigneeFilter,
      importedData,
    } = filterMetricsConfig(metricsConfig);

    const metricsData = {
      crews: users,
      assigneeFilter: assigneeFilter,
      pipelineCrews,
      cycleTime: cycleTimeSettings
        ? {
            type: cycleTimeSettingsType,
            jiraColumns: convertCycleTimeSettings(cycleTimeSettingsType, cycleTimeSettings),
            treatFlagCardAsBlock,
          }
        : undefined,
      doneStatus: doneColumn,
      classification: targetFields
        ?.filter((item: { name: string; key: string; flag: boolean }) => item.flag)
        ?.map((item: { name: string; key: string; flag: boolean }) => item.key),
      advancedSettings: importedData.importedAdvancedSettings,
      deployment: deploymentFrequencySettings,
      leadTime: leadTimeForChanges,
      reworkTimesSettings: importedData.reworkTimesSettings,
    };
    const jsonData = activeStep === METRICS_STEPS.CONFIG ? configData : { ...configData, ...metricsData };
    exportToJsonFile('config', jsonData);
  };

  const handleNext = () => {
    if (activeStep === METRICS_STEPS.METRICS) {
      dispatch(updateTimeStamp(new Date().getTime()));
    }
    dispatch(nextStep());
  };

  const handleBack = () => {
    setIsDialogShowing(!activeStep);
    dispatch(backStep());
  };

  const backToHomePage = () => {
    navigate(ROUTE.BASE_PAGE);
    setIsDialogShowing(false);
    window.location.reload();
  };

  const CancelDialog = () => {
    setIsDialogShowing(false);
  };

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
          {activeStep === METRICS_STEPS.REPORT && <ReportStep handleSave={handleSave} />}
        </Suspense>
      </MetricsStepperContent>
      <ButtonContainer>
        {activeStep !== METRICS_STEPS.REPORT && (
          <>
            <Tooltip title={TIPS.SAVE_CONFIG} placement={'right'}>
              <SaveButton variant='text' onClick={handleSave} startIcon={<SaveAltIcon />}>
                {COMMON_BUTTONS.SAVE}
              </SaveButton>
            </Tooltip>
            <div>
              <BackButton variant='outlined' onClick={handleBack}>
                {COMMON_BUTTONS.BACK}
              </BackButton>
              <NextButton onClick={handleNext} disabled={isDisableNextButton}>
                {COMMON_BUTTONS.NEXT}
              </NextButton>
            </div>
          </>
        )}
      </ButtonContainer>
      {isDialogShowing && (
        <ConfirmDialog isDialogShowing={isDialogShowing} onConfirm={backToHomePage} onClose={CancelDialog} />
      )}
    </>
  );
};

export default MetricsStepper;
