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

export const LeadTimeForChanges = () => {
  const dispatch = useAppDispatch()
  const leadTimeForChanges = useAppSelector(selectLeadTimeForChanges)
  const { leadTimeForChangesErrorMessages, checkDuplicatedPipeline, clearErrorMessage } =
    useMetricsStepValidationCheckContext()

  useEffect(() => {
    checkDuplicatedPipeline(leadTimeForChanges, 'LeadTimeForChanges')
  }, [leadTimeForChanges])

  const handleClickAddButton = () => {
    dispatch(addALeadTimeForChanges())
  }

  const handleClickRemoveButton = (id: number) => {
    dispatch(deleteALeadTimeForChange(id))
  }

  const UpdatePipeline = (id: number, label: string, value: string) => {
    dispatch(updateLeadTimeForChanges({ updateId: id, label, value }))
  }

  const handleClearErrorMessage = (id: number, label: string) => {
    clearErrorMessage(id, camelCase(label), 'LeadTimeForChanges')
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
          handleClickRemoveButton={(id) => handleClickRemoveButton(id)}
          onUpdatePipeline={(id, label, value) => UpdatePipeline(id, label, value)}
          onClearErrorMessage={(id, label) => handleClearErrorMessage(id, label)}
        />
      ))}
      {leadTimeForChanges.map((leadTimeForChange) => (
        <PipelineMetricSelection
          key={leadTimeForChange.id}
          pipelineSetting={leadTimeForChange}
          isShowRemoveButton={leadTimeForChanges.length > 1}
          errorMessages={getErrorMessage(leadTimeForChange.id)}
          handleClickRemoveButton={(id) => handleClickRemoveButton(id)}
          onUpdatePipeline={(id, label, value) => UpdatePipeline(id, label, value)}
          onClearErrorMessage={(id, label) => handleClearErrorMessage(id, label)}
        />
      ))}
      <MetricsSettingAddButton handleClickAddButton={handleClickAddButton} />
    </>
  )
}
