import React from 'react'
import { AddButton, Divider, Title } from './style'
import { PipelineMetricSelection } from './PipelineMetricSelection'
import { useAppSelector } from '@src/hooks'
import { selectDeploymentFrequencySettings } from '@src/context/pipelineMetricsSettings/pipelineMetricsSettingsSlice'

export const DeploymentFrequencySettings = () => {
  const deploymentFrequencySettings = useAppSelector(selectDeploymentFrequencySettings)

  return (
    <>
      <Divider>
        <Title>Deployment frequency settings</Title>
      </Divider>
      {deploymentFrequencySettings.map((deploymentFrequencySetting, index) => (
        <PipelineMetricSelection key={index} deploymentFrequencySetting={deploymentFrequencySetting} />
      ))}
      <AddButton variant='contained'> Add another pipeline</AddButton>
    </>
  )
}
