import { RemoveButton } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/style'
import React from 'react'
import { SingleSelection } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/SingleSelection'
import { useAppDispatch } from '@src/hooks'
import { deleteADeploymentFrequencySetting } from '@src/context/Metrics/metricsSlice'

interface pipelineMetricSelectionProps {
  deploymentFrequencySetting: {
    id: number
    organization: string
    pipelineName: string
    steps: string
  }
  isShowRemoveButton: boolean
}

export const PipelineMetricSelection = ({
  deploymentFrequencySetting,
  isShowRemoveButton,
}: pipelineMetricSelectionProps) => {
  const dispatch = useAppDispatch()
  const { id, organization, pipelineName, steps } = deploymentFrequencySetting

  const handleClick = () => {
    dispatch(deleteADeploymentFrequencySetting(id))
  }

  return (
    <>
      {isShowRemoveButton && <RemoveButton onClick={handleClick}>Remove this pipeline</RemoveButton>}
      <SingleSelection id={id} options={['o1', 'o2']} label={'Organization'} value={organization} />
      <SingleSelection id={id} options={['p1', 'p2']} label={'Pipeline Name'} value={pipelineName} />
      <SingleSelection id={id} options={['s1', 's2']} label={'Steps'} value={steps} />
    </>
  )
}
