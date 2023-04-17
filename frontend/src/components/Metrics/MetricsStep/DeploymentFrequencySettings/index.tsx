import React, { useEffect } from 'react'
import { PipelineMetricSelection } from './PipelineMetricSelection'
import { useAppDispatch, useAppSelector } from '@src/hooks'
import { MetricsSettingTitle, MetricsSettingButtonContainer } from '@src/components/Common/MetricsSettingTitle'
import { addADeploymentFrequencySetting, selectDeploymentFrequencySettings } from '@src/context/Metrics/metricsSlice'
import { useMetricsStepValidationCheckContext } from '@src/hooks/useMetricsStepValidationCheckContext'
import { IconButton } from '@mui/material'
import { Add } from '@mui/icons-material'

export const DeploymentFrequencySettings = () => {
  const dispatch = useAppDispatch()
  const deploymentFrequencySettings = useAppSelector(selectDeploymentFrequencySettings)
  const { errorMessages, checkDuplicatedPipeLine } = useMetricsStepValidationCheckContext()

  useEffect(() => {
    checkDuplicatedPipeLine()
  }, [deploymentFrequencySettings])

  const handleClick = () => {
    dispatch(addADeploymentFrequencySetting())
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
          deploymentFrequencySetting={deploymentFrequencySetting}
          isShowRemoveButton={deploymentFrequencySettings.length > 1}
          errorMessages={getErrorMessage(deploymentFrequencySetting.id)}
        />
      ))}
      <MetricsSettingButtonContainer>
        <IconButton onClick={handleClick}>
          <Add />
        </IconButton>
      </MetricsSettingButtonContainer>
    </>
  )
}
