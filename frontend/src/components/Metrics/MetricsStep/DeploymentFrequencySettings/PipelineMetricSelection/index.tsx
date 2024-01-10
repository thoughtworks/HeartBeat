import React, { useState } from 'react';
import { SingleSelection } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/SingleSelection';
import { useAppDispatch } from '@src/hooks';
import { ButtonWrapper, PipelineMetricSelectionWrapper, RemoveButton, WarningMessage } from './style';
import { Loading } from '@src/components/Loading';
import { useGetMetricsStepsEffect } from '@src/hooks/useGetMetricsStepsEffect';
import { ErrorNotification } from '@src/components/ErrorNotification';
import {
  selectPipelineNames,
  selectPipelineOrganizations,
  selectSteps,
  selectStepsParams,
  updatePipelineToolVerifyResponseSteps,
} from '@src/context/config/configSlice';
import { store } from '@src/store';
import {
  selectOrganizationWarningMessage,
  selectPipelineNameWarningMessage,
  selectStepWarningMessage,
  updatePipelineStep,
} from '@src/context/Metrics/metricsSlice';
import { WarningNotification } from '@src/components/Common/WarningNotification';
import { BranchSelection } from '@src/components/Metrics/ConfigStep/BranchSelection';
import { MESSAGE } from '@src/constants/resources';

interface pipelineMetricSelectionProps {
  type: string;
  pipelineSetting: {
    id: number;
    organization: string;
    pipelineName: string;
    step: string;
    branches: string[];
  };
  isShowRemoveButton: boolean;
  onRemovePipeline: (id: number) => void;
  onUpdatePipeline: (id: number, label: string, value: any) => void;
  isDuplicated: boolean;
}

export const PipelineMetricSelection = ({
  type,
  pipelineSetting,
  isShowRemoveButton,
  onRemovePipeline,
  onUpdatePipeline,
  isDuplicated,
}: pipelineMetricSelectionProps) => {
  const { id, organization, pipelineName, step } = pipelineSetting;
  const dispatch = useAppDispatch();
  const { isLoading, errorMessage, getSteps } = useGetMetricsStepsEffect();
  const organizationNameOptions = selectPipelineOrganizations(store.getState());
  const pipelineNameOptions = selectPipelineNames(store.getState(), organization);
  const stepsOptions = selectSteps(store.getState(), organization, pipelineName);
  const organizationWarningMessage = selectOrganizationWarningMessage(store.getState(), id, type);
  const pipelineNameWarningMessage = selectPipelineNameWarningMessage(store.getState(), id, type);
  const stepWarningMessage = selectStepWarningMessage(store.getState(), id, type);
  const [isShowNoStepWarning, setIsShowNoStepWarning] = useState(false);

  const handleRemoveClick = () => {
    onRemovePipeline(id);
  };

  const handleGetPipelineData = (_pipelineName: string) => {
    const { params, buildId, organizationId, pipelineType, token } = selectStepsParams(
      store.getState(),
      organization,
      _pipelineName
    );
    getSteps(params, organizationId, buildId, pipelineType, token).then((res) => {
      if (res && !res.haveStep) {
        isShowRemoveButton && handleRemoveClick();
      } else {
        const steps = res?.response ?? [];
        const branches = res?.branches ?? [];
        const pipelineCrews = res?.pipelineCrews ?? [];
        dispatch(
          updatePipelineToolVerifyResponseSteps({
            organization,
            pipelineName: _pipelineName,
            steps,
            branches,
            pipelineCrews,
          })
        );
        res?.haveStep && dispatch(updatePipelineStep({ steps, id, type, branches, pipelineCrews }));
      }
      res && setIsShowNoStepWarning(!res.haveStep);
    });
  };

  return (
    <PipelineMetricSelectionWrapper>
      {organizationWarningMessage && <WarningNotification message={organizationWarningMessage} />}
      {pipelineNameWarningMessage && <WarningNotification message={pipelineNameWarningMessage} />}
      {stepWarningMessage && <WarningNotification message={stepWarningMessage} />}
      {isShowNoStepWarning && <WarningNotification message={MESSAGE.NO_STEP_WARNING} />}
      {isLoading && <Loading />}
      {isDuplicated && <WarningMessage>This pipeline is the same as another one!</WarningMessage>}
      {errorMessage && <ErrorNotification message={errorMessage} />}
      <SingleSelection
        id={id}
        options={organizationNameOptions}
        label={'Organization'}
        value={organization}
        onUpDatePipeline={(id, label, value) => onUpdatePipeline(id, label, value)}
      />
      {organization && (
        <SingleSelection
          id={id}
          options={pipelineNameOptions}
          label={'Pipeline Name'}
          value={pipelineName}
          step={step}
          onGetSteps={handleGetPipelineData}
          onUpDatePipeline={(id, label, value) => onUpdatePipeline(id, label, value)}
        />
      )}
      {organization && pipelineName && (
        <SingleSelection
          id={id}
          options={stepsOptions}
          label={'Step'}
          value={step}
          onUpDatePipeline={(id, label, value) => onUpdatePipeline(id, label, value)}
        />
      )}
      {organization && pipelineName && <BranchSelection {...pipelineSetting} onUpdatePipeline={onUpdatePipeline} />}
      <ButtonWrapper>
        {isShowRemoveButton && (
          <RemoveButton data-test-id={'remove-button'} onClick={handleRemoveClick}>
            Remove
          </RemoveButton>
        )}
      </ButtonWrapper>
    </PipelineMetricSelectionWrapper>
  );
};
