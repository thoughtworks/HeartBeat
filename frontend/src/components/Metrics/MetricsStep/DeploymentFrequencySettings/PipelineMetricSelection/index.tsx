import React from 'react'
import { SingleSelection } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/SingleSelection'
import { useAppDispatch, useAppSelector } from '@src/hooks'
import { deleteADeploymentFrequencySetting } from '@src/context/Metrics/metricsSlice'
import { ButtonWrapper, PipelineMetricSelectionWrapper, RemoveButton } from './style'
import { selectPipelineList } from '@src/context/response/responseSlic'

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
  const dispatch = useAppDispatch()

  const { id, organization, pipelineName, steps } = deploymentFrequencySetting

  const handleClick = () => {
    dispatch(deleteADeploymentFrequencySetting(id))
  }

  const pipelineList = useAppSelector(selectPipelineList)

  const getOrganizationNameOptions = () => pipelineList.map((item) => item.orgName)

  const getPipelineNameOptions = () =>
    pipelineList.filter((pipeline) => pipeline.orgName === organization).map((item) => item.name)

  return (
    <PipelineMetricSelectionWrapper>
      <SingleSelection
        id={id}
        options={getOrganizationNameOptions()}
        label={'Organization'}
        value={organization}
        errorMessage={errorMessages?.organization}
      />
      {deploymentFrequencySetting.organization && (
        <SingleSelection
          id={id}
          options={getPipelineNameOptions()}
          label={'Pipeline Name'}
          value={pipelineName}
          errorMessage={errorMessages?.pipelineName}
        />
      )}
      {deploymentFrequencySetting.organization && deploymentFrequencySetting.pipelineName && (
        <SingleSelection
          id={id}
          options={['s1', 's2']}
          label={'Steps'}
          value={steps}
          errorMessage={errorMessages?.steps}
        />
      )}
      <ButtonWrapper>{isShowRemoveButton && <RemoveButton onClick={handleClick}>Remove</RemoveButton>}</ButtonWrapper>
    </PipelineMetricSelectionWrapper>
  )
}
