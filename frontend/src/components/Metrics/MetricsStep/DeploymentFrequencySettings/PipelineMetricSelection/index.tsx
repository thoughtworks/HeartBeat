import { RemoveButton } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/style'
import React from 'react'
import { SingleSelection } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/SingleSelection'
import { useAppDispatch } from '@src/hooks'
import { deleteADeploymentFrequencySetting } from '@src/context/pipelineMetricsSettings/pipelineMetricsSettingsSlice'

interface pipelineMetricSelectionProps {
  deploymentFrequencySetting: {
    organization: string
    pipelineName: string
    steps: string
  }
  index: number
  isShowRemoveButton: boolean
}

export const PipelineMetricSelection = ({
  deploymentFrequencySetting,
  index,
  isShowRemoveButton,
}: pipelineMetricSelectionProps) => {
  const dispatch = useAppDispatch()

  const handleClick = () => {
    dispatch(deleteADeploymentFrequencySetting(index))
  }

  return (
    <>
      {isShowRemoveButton && <RemoveButton onClick={handleClick}>Remove this pipeline</RemoveButton>}
      <SingleSelection
        options={['o1', 'o2']}
        label={'Organization'}
        value={deploymentFrequencySetting.organization}
        index={index}
      />
      <SingleSelection
        options={['p1', 'p2']}
        label={'Pipeline Name'}
        value={deploymentFrequencySetting.pipelineName}
        index={index}
      />
      <SingleSelection options={['s1', 's2']} label={'Steps'} value={deploymentFrequencySetting.steps} index={index} />
    </>
  )
}
