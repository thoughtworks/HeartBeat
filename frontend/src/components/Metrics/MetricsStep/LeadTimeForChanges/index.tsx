import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle'
import React, { useEffect } from 'react'
import {
  addALeadTimeForChanges,
  deleteALeadTimeForChange,
  selectLeadTimeForChanges,
  updateLeadTimeForChanges,
} from '@src/context/Metrics/metricsSlice'
import { useAppDispatch, useAppSelector } from '@src/hooks'
import { MetricsSettingAddButton } from '@src/components/Common/MetricsSettingButton'
import { PipelineMetricSelection } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/PipelineMetricSelection'
import { useMetricsStepValidationCheckContext } from '@src/hooks/useMetricsStepValidationCheckContext'
import camelCase from 'lodash.camelcase'
import { PIPELINE_SETTING_TYPES } from '@src/constants'

export const LeadTimeForChanges = () => {
  const dispatch = useAppDispatch()
  const leadTimeForChanges = useAppSelector(selectLeadTimeForChanges)
  const { leadTimeForChangesErrorMessages, checkDuplicatedPipeline, clearErrorMessage } =
    useMetricsStepValidationCheckContext()

  useEffect(() => {
    checkDuplicatedPipeline(leadTimeForChanges, PIPELINE_SETTING_TYPES.LEAD_TIME_FOR_CHANGES_TYPE)
  }, [leadTimeForChanges])

  const handleAddPipeline = () => {
    dispatch(addALeadTimeForChanges())
  }

  const handleRemovePipeline = (id: number) => {
    dispatch(deleteALeadTimeForChange(id))
  }

  const handleUpdatePipeline = (id: number, label: string, value: string) => {
    dispatch(updateLeadTimeForChanges({ updateId: id, label, value }))
  }

  const handleClearErrorMessage = (id: number, label: string) => {
    clearErrorMessage(id, camelCase(label), PIPELINE_SETTING_TYPES.LEAD_TIME_FOR_CHANGES_TYPE)
  }

  const getErrorMessage = (leadTimeForChangeId: number) => {
    return leadTimeForChangesErrorMessages.filter(({ id }) => id === leadTimeForChangeId)[0]?.error
  }

  return (
    <>
      <MetricsSettingTitle title={'Lead time for changes'} />
      {leadTimeForChanges.map((leadTimeForChange) => (
        <PipelineMetricSelection
          key={leadTimeForChange.id}
          pipelineSetting={leadTimeForChange}
          isShowRemoveButton={leadTimeForChanges.length > 1}
          errorMessages={getErrorMessage(leadTimeForChange.id)}
          onRemovePipeline={(id) => handleRemovePipeline(id)}
          onUpdatePipeline={(id, label, value) => handleUpdatePipeline(id, label, value)}
          onClearErrorMessage={(id, label) => handleClearErrorMessage(id, label)}
        />
      ))}
      <MetricsSettingAddButton onAddPipeline={handleAddPipeline} />
    </>
  )
}
