import React from 'react'
import { SingleSelection } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/SingleSelection'
import { useAppDispatch } from '@src/hooks'
import { deleteADeploymentFrequencySetting } from '@src/context/Metrics/metricsSlice'
import { ButtonWrapper, PipelineMetricSelectionWrapper, RemoveButton } from './style'

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

  return (
    <PipelineMetricSelectionWrapper>
      <SingleSelection
        id={id}
        options={['o1', 'o2']}
        label={'Organization'}
        value={organization}
        errorMessage={errorMessages?.organization}
      />
      <SingleSelection
        id={id}
        options={['p1', 'p2']}
        label={'Pipeline Name'}
        value={pipelineName}
        errorMessage={errorMessages?.pipelineName}
      />
      <SingleSelection
        id={id}
        options={['s1', 's2']}
        label={'Steps'}
        value={steps}
        errorMessage={errorMessages?.steps}
      />
      <ButtonWrapper>{isShowRemoveButton && <RemoveButton onClick={handleClick}>Remove</RemoveButton>}</ButtonWrapper>
    </PipelineMetricSelectionWrapper>
  )
}
