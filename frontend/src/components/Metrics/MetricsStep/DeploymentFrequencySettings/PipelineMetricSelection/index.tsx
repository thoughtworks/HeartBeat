import React, { useEffect, useState } from 'react'
import { SingleSelection } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/SingleSelection'
import { useAppDispatch, useAppSelector } from '@src/hooks'
import { deleteADeploymentFrequencySetting } from '@src/context/Metrics/metricsSlice'
import { ButtonWrapper, PipelineMetricSelectionWrapper, RemoveButton } from './style'
import { Loading } from '@src/components/Loading'
import { useGetMetricsStepsEffect } from '@src/hooks/useGetMetricsStepsEffect'
import { ErrorNotification } from '@src/components/ErrorNotification'
import { selectPipelineNames, selectPipelineOrganizations, selectStepsParams } from '@src/context/config/configSlice'
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
  const [stepsOptions, setStepsOptions] = useState<string[]>([])
  const dispatch = useAppDispatch()
  const { isLoading, errorMessage, getSteps } = useGetMetricsStepsEffect()
  const organizationNameOptions = useAppSelector(selectPipelineOrganizations)
  const pipelineNameOptions = useAppSelector(() => selectPipelineNames(store.getState(), organization))

  useEffect(() => {
    organization && pipelineName && handleGetSteps()
  }, [organization, pipelineName])

  const handleClick = () => {
    dispatch(deleteADeploymentFrequencySetting(id))
  }

  const handleGetSteps = () => {
    const { params, buildId, organizationId, pipelineType, token } = selectStepsParams(
      store.getState(),
      organization,
      pipelineName
    )
    getSteps(params, organizationId, buildId, pipelineType, token).then((res) => {
      res && setStepsOptions([...Object.values(res)])
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
