import React from 'react'
import { SingleSelection } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/SingleSelection'
import { useAppDispatch } from '@src/hooks'
import { deleteADeploymentFrequencySetting } from '@src/context/Metrics/metricsSlice'
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

interface pipelineMetricSelectionProps {
  deploymentFrequencySetting: {
    id: number
    organization: string
    pipelineName: string
    steps: string
  }
  isShowRemoveButton: boolean
  errorMessages: { organization: string; pipelineName: string; steps: string } | undefined
}

export const PipelineMetricSelection = ({
  deploymentFrequencySetting,
  isShowRemoveButton,
  errorMessages,
}: pipelineMetricSelectionProps) => {
  const { id, organization, pipelineName, steps } = deploymentFrequencySetting
  const dispatch = useAppDispatch()
  const { isLoading, errorMessage, getSteps } = useGetMetricsStepsEffect()
  const organizationNameOptions = selectPipelineOrganizations(store.getState())
  const pipelineNameOptions = selectPipelineNames(store.getState(), organization)
  const stepsOptions = selectSteps(store.getState(), organization, pipelineName)

  const handleClick = () => {
    dispatch(deleteADeploymentFrequencySetting(id))
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
      />
      {organization && (
        <SingleSelection
          id={id}
          options={pipelineNameOptions}
          label={'Pipeline Name'}
          value={pipelineName}
          errorMessage={errorMessages?.pipelineName}
          onGetSteps={handleGetSteps}
        />
      )}
      {organization && pipelineName && (
        <SingleSelection
          id={id}
          options={stepsOptions}
          label={'Steps'}
          value={steps}
          errorMessage={errorMessages?.steps}
        />
      )}
      <ButtonWrapper>{isShowRemoveButton && <RemoveButton onClick={handleClick}>Remove</RemoveButton>}</ButtonWrapper>
    </PipelineMetricSelectionWrapper>
  )
}
