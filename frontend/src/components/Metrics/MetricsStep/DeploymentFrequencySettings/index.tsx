import React, { useEffect } from 'react'
import { PipelineMetricSelection } from './PipelineMetricSelection'
import { useAppDispatch, useAppSelector } from '@src/hooks'
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle'
import {
  addADeploymentFrequencySetting,
  deleteADeploymentFrequencySetting,
  selectDeploymentFrequencySettings,
  updateDeploymentFrequencySettings,
} from '@src/context/Metrics/metricsSlice'
import { useMetricsStepValidationCheckContext } from '@src/hooks/useMetricsStepValidationCheckContext'
import { MetricsSettingAddButton } from '@src/components/Common/MetricsSettingButton'

export const DeploymentFrequencySettings = () => {
  const dispatch = useAppDispatch()
  const deploymentFrequencySettings = useAppSelector(selectDeploymentFrequencySettings)
  const { errorMessages, checkDuplicatedPipeLine } = useMetricsStepValidationCheckContext()

  useEffect(() => {
    checkDuplicatedPipeLine()
  }, [deploymentFrequencySettings])

  const handleClickAddButton = () => {
    dispatch(addADeploymentFrequencySetting())
  }

  const handleClickRemoveButton = (id: number) => {
    dispatch(deleteADeploymentFrequencySetting(id))
  }

  const UpdatePipeline = (id: number, label: string, value: string) => {
    dispatch(updateDeploymentFrequencySettings({ updateId: id, label, value }))
  }

  const getErrorMessage = (deploymentFrequencySettingId: number) => {
    return errorMessages.filter(({ id }) => id === deploymentFrequencySettingId)[0]?.error
  }

  return (
    <>
      <MetricsSettingTitle title={'Deployment Frequency Settings'} />
      {deploymentFrequencySettings.map((deploymentFrequencySetting) => (
        <PipelineMetricSelection
          key={deploymentFrequencySetting.id}
          pipelineSetting={deploymentFrequencySetting}
          isShowRemoveButton={deploymentFrequencySettings.length > 1}
          errorMessages={getErrorMessage(deploymentFrequencySetting.id)}
          handleClickRemoveButton={(id) => handleClickRemoveButton(id)}
          onUpdatePipeline={(id, label, value) => UpdatePipeline(id, label, value)}
        />
      ))}
      <MetricsSettingAddButton handleClickAddButton={handleClickAddButton} />
    </>
  )
}
