import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle'
import React from 'react'
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
import { PIPELINE_SETTING_TYPES } from '@src/constants'

export const LeadTimeForChanges = () => {
  const dispatch = useAppDispatch()
  const leadTimeForChanges = useAppSelector(selectLeadTimeForChanges)
  const { getDuplicatedPipeLineIds } = useMetricsStepValidationCheckContext()

  const handleAddPipeline = () => {
    dispatch(addALeadTimeForChanges())
  }

  const handleRemovePipeline = (id: number) => {
    dispatch(deleteALeadTimeForChange(id))
  }

  const handleUpdatePipeline = (id: number, label: string, value: string) => {
    dispatch(updateLeadTimeForChanges({ updateId: id, label, value }))
  }

  return (
    <>
      <MetricsSettingTitle title={'Lead time for changes'} />
      {leadTimeForChanges.map((leadTimeForChange) => (
        <PipelineMetricSelection
          key={leadTimeForChange.id}
          type={PIPELINE_SETTING_TYPES.LEAD_TIME_FOR_CHANGES_TYPE}
          pipelineSetting={leadTimeForChange}
          isShowRemoveButton={leadTimeForChanges.length > 1}
          onRemovePipeline={(id) => handleRemovePipeline(id)}
          onUpdatePipeline={(id, label, value) => handleUpdatePipeline(id, label, value)}
          isDuplicated={getDuplicatedPipeLineIds(leadTimeForChanges).includes(leadTimeForChange.id)}
        />
      ))}
      <MetricsSettingAddButton onAddPipeline={handleAddPipeline} />
    </>
  )
}
