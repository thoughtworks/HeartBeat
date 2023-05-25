import React from 'react'
import { SingleSelection } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/SingleSelection'
import { useAppDispatch } from '@src/hooks'
import { ButtonWrapper, PipelineMetricSelectionWrapper, RemoveButton } from './style'
import { Loading } from '@src/components/Loading'
import { useGetMetricsStepsEffect } from '@src/hooks/useGetMetricsStepsEffect'
import { ErrorNotification } from '@src/components/ErrorNotification'
import {
  selectPipelineNames,
  selectPipelineOrganizations,
  selectSteps,
  selectStepsParams,
  updatePipelineToolVerifyResponseSteps,
} from '@src/context/config/configSlice'
import { store } from '@src/store'
import { updatePipelineStep } from '@src/context/Metrics/metricsSlice'

interface pipelineMetricSelectionProps {
  type: string
  pipelineSetting: {
    id: number
    organization: string
    pipelineName: string
    step: string
  }
  isShowRemoveButton: boolean
  errorMessages: { organization: string; pipelineName: string; step: string } | undefined
  onRemovePipeline: (id: number) => void
  onUpdatePipeline: (id: number, label: string, value: string) => void
  onClearErrorMessage: (id: number, label: string) => void
}

export const PipelineMetricSelection = ({
  type,
  pipelineSetting,
  isShowRemoveButton,
  errorMessages,
  onRemovePipeline,
  onUpdatePipeline,
  onClearErrorMessage,
}: pipelineMetricSelectionProps) => {
  const { id, organization, pipelineName, step } = pipelineSetting
  const dispatch = useAppDispatch()
  const { isLoading, errorMessage, getSteps } = useGetMetricsStepsEffect()
  const organizationNameOptions = selectPipelineOrganizations(store.getState())
  const pipelineNameOptions = selectPipelineNames(store.getState(), organization)
  const stepsOptions = selectSteps(store.getState(), organization, pipelineName)

  const handleClick = () => {
    onRemovePipeline(id)
  }

  const handleGetSteps = (_pipelineName: string) => {
    const { params, buildId, organizationId, pipelineType, token } = selectStepsParams(
      store.getState(),
      organization,
      _pipelineName
    )
    getSteps(params, organizationId, buildId, pipelineType, token).then((res) => {
      const steps = res ? Object.values(res) : []
      dispatch(updatePipelineToolVerifyResponseSteps({ organization, pipelineName: _pipelineName, steps }))
      dispatch(updatePipelineStep({ steps, id, type }))
    })
  }

  return (
    <PipelineMetricSelectionWrapper>
      {isLoading && <Loading />}
      {errorMessage && <ErrorNotification message={errorMessage} />}
      <SingleSelection
        id={id}
        options={organizationNameOptions}
        label={'Organization'}
        value={organization}
        errorMessage={errorMessages?.organization}
        onUpDatePipeline={(id, label, value) => onUpdatePipeline(id, label, value)}
        onClearErrorMessage={(id, label) => onClearErrorMessage(id, label)}
      />
      {organization && (
        <SingleSelection
          id={id}
          options={pipelineNameOptions}
          label={'Pipeline Name'}
          value={pipelineName}
          errorMessage={errorMessages?.pipelineName}
          step={step}
          onGetSteps={handleGetSteps}
          onUpDatePipeline={(id, label, value) => onUpdatePipeline(id, label, value)}
          onClearErrorMessage={(id, label) => onClearErrorMessage(id, label)}
        />
      )}
      {organization && pipelineName && (
        <SingleSelection
          id={id}
          options={stepsOptions}
          label={'Step'}
          value={step}
          errorMessage={errorMessages?.step}
          onUpDatePipeline={(id, label, value) => onUpdatePipeline(id, label, value)}
          onClearErrorMessage={(id, label) => onClearErrorMessage(id, label)}
        />
      )}
      <ButtonWrapper>
        {isShowRemoveButton && (
          <RemoveButton data-test-id={'remove-button'} onClick={handleClick}>
            Remove
          </RemoveButton>
        )}
      </ButtonWrapper>
    </PipelineMetricSelectionWrapper>
  )
}
