import React, { createContext, useContext, useState } from 'react'
import { useAppSelector } from '@src/hooks/index'
import { selectDeploymentFrequencySettings, selectLeadTimeForChanges } from '@src/context/Metrics/metricsSlice'
import { PIPELINE_SETTING_TYPES } from '@src/constants'

interface Error {
  organization: string
  pipelineName: string
  step: string
}

interface ErrorMessagesProps {
  id: number
  error: Error
}

interface ProviderContextType {
  deploymentFrequencySettingsErrorMessages: ErrorMessagesProps[]
  leadTimeForChangesErrorMessages: ErrorMessagesProps[]
  clearErrorMessage: (changedSelectionId: number, label: string, type: string) => void
  checkDuplicatedPipeline: (
    pipelineSettings: { id: number; organization: string; pipelineName: string; step: string }[],
    type: string
  ) => void
  isPipelineValid: (type: string) => boolean
  getDuplicatedPipeLineIds: (
    pipelineSettings: { id: number; organization: string; pipelineName: string; step: string }[]
  ) => number[]
}

interface ContextProviderProps {
  children: React.ReactNode
}

export const ValidationContext = createContext<ProviderContextType>({
  deploymentFrequencySettingsErrorMessages: [],
  leadTimeForChangesErrorMessages: [],
  clearErrorMessage: () => null,
  checkDuplicatedPipeline: () => null,
  isPipelineValid: () => false,
  getDuplicatedPipeLineIds: () => [],
})

const emptyErrorMessages = {
  organization: '',
  pipelineName: '',
  step: '',
}

const assignErrorMessage = (label: string, value: string, id: number, duplicatedPipeLineIds: number[]) =>
  !value ? `${label} is required` : duplicatedPipeLineIds.includes(id) ? `duplicated ${label}` : ''

const getDuplicatedPipeLineIds = (
  pipelineSettings: { id: number; organization: string; pipelineName: string; step: string }[]
) => {
  const errors: { [key: string]: number[] } = {}
  pipelineSettings.forEach(({ id, organization, pipelineName, step }) => {
    if (organization && pipelineName && step) {
      const errorString = `${organization}${pipelineName}${step}`
      if (errors[errorString]) errors[errorString].push(id)
      else errors[errorString] = [id]
    }
  })
  return Object.values(errors)
    .filter((ids) => ids.length > 1)
    .flat()
}

const getErrorMessages = (
  pipelineSettings: { id: number; organization: string; pipelineName: string; step: string }[]
) => {
  const duplicatedPipelineIds: number[] = getDuplicatedPipeLineIds(pipelineSettings)
  return pipelineSettings.map(({ id, organization, pipelineName, step }) => ({
    id,
    error: {
      organization: assignErrorMessage('organization', organization, id, duplicatedPipelineIds),
      pipelineName: assignErrorMessage('pipelineName', pipelineName, id, duplicatedPipelineIds),
      step: assignErrorMessage('step', step, id, duplicatedPipelineIds),
    },
  }))
}

const getDuplicatedErrorMessage = (
  pipelineSetting: { id: number; organization: string; pipelineName: string; step: string },
  duplicatedPipeLineIds: number[],
  errorMessages: { id: number; error: { organization: string; pipelineName: string; step: string } }[]
) => {
  const { id, organization, pipelineName, step } = pipelineSetting
  if (!organization || !pipelineName || !step) {
    return {
      id,
      error: errorMessages.find((x) => x.id === id)?.error ?? emptyErrorMessages,
    }
  }

  if (duplicatedPipeLineIds.includes(id)) {
    return {
      id,
      error: {
        organization: 'duplicated organization',
        pipelineName: 'duplicated pipelineName',
        step: 'duplicated step',
      },
    }
  }

  return { id, error: emptyErrorMessages }
}

export const ContextProvider = ({ children }: ContextProviderProps) => {
  const deploymentFrequencySettings = useAppSelector(selectDeploymentFrequencySettings)
  const leadTimeForChanges = useAppSelector(selectLeadTimeForChanges)
  const [deploymentFrequencySettingsErrorMessages, setDeploymentFrequencySettingsErrorMessages] = useState(
    [] as ErrorMessagesProps[]
  )
  const [leadTimeForChangesErrorMessages, setLeadTimeForChangesErrorMessages] = useState([] as ErrorMessagesProps[])

  const saveErrorMessages = (type: string, errorMessages: ErrorMessagesProps[]) => {
    type === PIPELINE_SETTING_TYPES.LEAD_TIME_FOR_CHANGES_TYPE
      ? setLeadTimeForChangesErrorMessages(errorMessages)
      : setDeploymentFrequencySettingsErrorMessages(errorMessages)
  }

  const isPipelineValid = (type: string) => {
    const pipelines =
      type === PIPELINE_SETTING_TYPES.LEAD_TIME_FOR_CHANGES_TYPE ? leadTimeForChanges : deploymentFrequencySettings
    const errorMessages = getErrorMessages(pipelines)
    saveErrorMessages(type, errorMessages)
    return errorMessages.every(({ error }) => Object.values(error).every((val) => !val))
  }

  const clearErrorMessage = (changedSelectionId: number, label: string, type: string) => {
    const selectedErrorMessages =
      type === PIPELINE_SETTING_TYPES.LEAD_TIME_FOR_CHANGES_TYPE
        ? leadTimeForChangesErrorMessages
        : deploymentFrequencySettingsErrorMessages
    const updatedErrorMessages = selectedErrorMessages.map((errorMessage) => {
      if (errorMessage.id === changedSelectionId) {
        errorMessage.error[label as keyof Error] = ''
      }
      return errorMessage
    })
    type === PIPELINE_SETTING_TYPES.LEAD_TIME_FOR_CHANGES_TYPE
      ? setLeadTimeForChangesErrorMessages(updatedErrorMessages)
      : setDeploymentFrequencySettingsErrorMessages(updatedErrorMessages)
  }

  const checkDuplicatedPipeline = (
    pipelineSettings: { id: number; organization: string; pipelineName: string; step: string }[],
    type: string
  ) => {
    const duplicatedPipeLineIds: number[] = getDuplicatedPipeLineIds(pipelineSettings)
    const errorMessages = pipelineSettings.map((pipelineSetting) =>
      getDuplicatedErrorMessage(pipelineSetting, duplicatedPipeLineIds, deploymentFrequencySettingsErrorMessages)
    )
    saveErrorMessages(type, errorMessages)
  }

  return (
    <ValidationContext.Provider
      value={{
        deploymentFrequencySettingsErrorMessages: deploymentFrequencySettingsErrorMessages,
        leadTimeForChangesErrorMessages: leadTimeForChangesErrorMessages,
        clearErrorMessage,
        checkDuplicatedPipeline,
        isPipelineValid,
        getDuplicatedPipeLineIds,
      }}
    >
      {children}
    </ValidationContext.Provider>
  )
}

export const useMetricsStepValidationCheckContext = () => useContext(ValidationContext)
