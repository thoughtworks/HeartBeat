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

export const LeadTimeForChanges = () => {
  const dispatch = useAppDispatch()
  const leadTimeForChanges = useAppSelector(selectLeadTimeForChanges)
  const { errorMessages, checkDuplicatedPipeLine } = useMetricsStepValidationCheckContext()

  const handleClickAddButton = () => {
    dispatch(addALeadTimeForChanges())
  }

  const handleClickRemoveButton = (id: number) => {
    dispatch(deleteALeadTimeForChange(id))
  }

  const UpdatePipeline = (id: number, label: string, value: string) => {
    dispatch(updateLeadTimeForChanges({ updateId: id, label, value }))
  }

  const getErrorMessage = (leadTimeForChangeId: number) => {
    return errorMessages.filter(({ id }) => id === leadTimeForChangeId)[0]?.error
  }

  return (
    <>
      <MetricsSettingTitle title={'Lead Time for Changes'} />
      {leadTimeForChanges.map((leadTimeForChange) => (
        <PipelineMetricSelection
          key={leadTimeForChange.id}
          pipelineSetting={leadTimeForChange}
          isShowRemoveButton={leadTimeForChanges.length > 1}
          errorMessages={getErrorMessage(leadTimeForChange.id)}
          handleClickRemoveButton={(id) => handleClickRemoveButton(id)}
          onUpdatePipeline={(id, label, value) => UpdatePipeline(id, label, value)}
        />
      ))}
      <MetricsSettingAddButton handleClickAddButton={handleClickAddButton} />
    </>
  )
}
