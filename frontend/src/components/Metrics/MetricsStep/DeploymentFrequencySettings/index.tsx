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
import { PIPELINE_SETTING_TYPES } from '@src/constants'

export const DeploymentFrequencySettings = () => {
  const dispatch = useAppDispatch()
  const deploymentFrequencySettings = useAppSelector(selectDeploymentFrequencySettings)
  const { deploymentFrequencySettingsErrorMessages, checkDuplicatedPipeline, clearErrorMessage } =
    useMetricsStepValidationCheckContext()

  useEffect(() => {
    checkDuplicatedPipeline(deploymentFrequencySettings, PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE)
  }, [deploymentFrequencySettings])

  const handleAddPipeline = () => {
    dispatch(addADeploymentFrequencySetting())
  }

  const handleRemovePipeline = (id: number) => {
    dispatch(deleteADeploymentFrequencySetting(id))
  }

  const handleUpdatePipeline = (id: number, label: string, value: string) => {
    dispatch(updateDeploymentFrequencySettings({ updateId: id, label, value }))
  }

  const handleClearErrorMessage = (id: number, label: string) => {
    clearErrorMessage(id, camelCase(label), PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE)
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
          type={PIPELINE_SETTING_TYPES.DEPLOYMENT_FREQUENCY_SETTINGS_TYPE}
          pipelineSetting={deploymentFrequencySetting}
          isShowRemoveButton={deploymentFrequencySettings.length > 1}
          errorMessages={getErrorMessage(deploymentFrequencySetting.id)}
          onRemovePipeline={(id) => handleRemovePipeline(id)}
          onUpdatePipeline={(id, label, value) => handleUpdatePipeline(id, label, value)}
          onClearErrorMessage={(id, label) => handleClearErrorMessage(id, label)}
        />
      ))}
      <MetricsSettingAddButton onAddPipeline={handleAddPipeline} />
    </>
  )
}
