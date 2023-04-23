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
import camelCase from 'lodash.camelcase'

export const DeploymentFrequencySettings = () => {
  const dispatch = useAppDispatch()
  const deploymentFrequencySettings = useAppSelector(selectDeploymentFrequencySettings)
  const { deploymentFrequencySettingsErrorMessages, checkDuplicatedPipeline, clearErrorMessage } =
    useMetricsStepValidationCheckContext()

  useEffect(() => {
    checkDuplicatedPipeline(deploymentFrequencySettings, 'DeploymentFrequencySettings')
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

  const handleClearErrorMessage = (id: number, label: string) => {
    clearErrorMessage(id, camelCase(label), 'DeploymentFrequencySettings')
  }

  const getErrorMessage = (deploymentFrequencySettingId: number) => {
    return deploymentFrequencySettingsErrorMessages.filter(({ id }) => id === deploymentFrequencySettingId)[0]?.error
  }

  return (
    <>
      <MetricsSettingTitle title={'Deployment frequency settings'} />
      {deploymentFrequencySettings.map((deploymentFrequencySetting) => (
        <PipelineMetricSelection
          key={deploymentFrequencySetting.id}
          pipelineSetting={deploymentFrequencySetting}
          isShowRemoveButton={deploymentFrequencySettings.length > 1}
          errorMessages={getErrorMessage(deploymentFrequencySetting.id)}
          handleClickRemoveButton={(id) => handleClickRemoveButton(id)}
          onUpdatePipeline={(id, label, value) => UpdatePipeline(id, label, value)}
          onClearErrorMessage={(id, label) => handleClearErrorMessage(id, label)}
        />
      ))}
      <MetricsSettingAddButton handleClickAddButton={handleClickAddButton} />
    </>
  )
}
