import { RemoveButton } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/style'
import React from 'react'
import { SingleSelection } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/SingleSelection'

interface pipelineMetricSelectionProps {
  deploymentFrequencySetting: {
    organization: string
    pipelineName: string
    steps: string
  }
}

export const PipelineMetricSelection = ({ deploymentFrequencySetting }: pipelineMetricSelectionProps) => {
  return (
    <>
      <RemoveButton> Remove this pipeline</RemoveButton>
      <SingleSelection options={['o1', 'o2']} label={'Organization'} value={deploymentFrequencySetting.organization} />
      <SingleSelection options={['p1', 'p2']} label={'Pipeline Name'} value={deploymentFrequencySetting.pipelineName} />
      <SingleSelection options={['s1', 's2']} label={'Steps'} value={deploymentFrequencySetting.steps} />
    </>
  )
}
