import React from 'react'
import { AddButton } from './style'
import { PipelineMetricSelection } from './PipelineMetricSelection'
import { useAppDispatch, useAppSelector } from '@src/hooks'
import MetricsSettingTitle from '@src/components/Common/MetricsSettingTitle'
import { addADeploymentFrequencySetting, selectDeploymentFrequencySettings } from '@src/context/Metrics/metricsSlice'

export const DeploymentFrequencySettings = () => {
  const dispatch = useAppDispatch()
  const deploymentFrequencySettings = useAppSelector(selectDeploymentFrequencySettings)

  const handleClick = () => {
    dispatch(addADeploymentFrequencySetting())
  }

  return (
    <>
      <MetricsSettingTitle title={'Deployment frequency settings'} />
      {deploymentFrequencySettings.map((deploymentFrequencySetting) => (
        <PipelineMetricSelection
          key={deploymentFrequencySetting.id}
          deploymentFrequencySetting={deploymentFrequencySetting}
          isShowRemoveButton={deploymentFrequencySettings.length > 1}
        />
      ))}
      <AddButton onClick={handleClick}> Add another pipeline</AddButton>
    </>
  )
}
