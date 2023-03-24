import React, { createContext, useContext, useState } from 'react'
import { useAppSelector } from '@src/hooks/index'
import { selectDeploymentFrequencySettings } from '@src/context/Metrics/metricsSlice'

interface Error {
  organization: string
  pipelineName: string
  steps: string
}

interface ErrorMessagesProps {
  id: number
  error: Error
}

type ProviderContextType = {
  errorMessages: ErrorMessagesProps[]
  clearErrorMessage: (changedSelectionId: number, label: string) => void
  checkDuplicatedPipeLine: () => void
  isPipelineValid: () => boolean
}

export interface ContextProviderProps {
  children: React.ReactNode
}

export const ValidationContext = createContext<ProviderContextType>({
  errorMessages: [],
  clearErrorMessage: () => null,
  checkDuplicatedPipeLine: () => null,
  isPipelineValid: () => false,
})

const getMessage = (label: string, value: string, id: number, duplicatedPipeLineIds: number[]) =>
  !value ? `${label} is required` : duplicatedPipeLineIds.includes(id) ? `duplicated ${label}` : ''

const getDuplicatedValidationMessage = (
  label: string,
  errorMessage: string,
  id: number,
  duplicatedPipeLineIds: number[]
) =>
  duplicatedPipeLineIds.includes(id)
    ? `duplicated ${label}`
    : errorMessage === `duplicated ${label}`
    ? ''
    : errorMessage

const getDuplicatedPipeLineIds = (
  deploymentFrequencySettings: { id: number; organization: string; pipelineName: string; steps: string }[]
) => {
  const errors = new Map<string, number[]>()
  deploymentFrequencySettings.forEach(({ id, organization, pipelineName, steps }) => {
    if (!organization || !pipelineName || !steps) return
    const errorString = `${organization}-${pipelineName}-${steps}`
    if (errors.has(errorString)) {
      errors.get(errorString)?.push(id)
    } else {
      errors.set(errorString, [id])
    }
  })
  return Array.from(errors.values())
    .filter((ids) => ids.length > 1)
    .flat()
}

export const ContextProvider = ({ children }: ContextProviderProps) => {
  const deploymentFrequencySettings = useAppSelector(selectDeploymentFrequencySettings)
  const [errorMessages, setErrorMessages] = useState([] as ErrorMessagesProps[])
  const duplicatedPipeLineIds: number[] = getDuplicatedPipeLineIds(deploymentFrequencySettings)

  const clearErrorMessage = (changedSelectionId: number, label: string) => {
    setErrorMessages([
      ...errorMessages.map((errorMessage) => {
        if (errorMessage.id === changedSelectionId) {
          errorMessage.error[label as keyof Error] = ''
        }
        return errorMessage
      }),
    ])
  }

  const checkDuplicatedPipeLine = () => {
    setErrorMessages([
      ...deploymentFrequencySettings.map(({ id }) => {
        const _error = errorMessages.find((errorMessage) => errorMessage.id === id)?.error || {
          organization: '',
          pipelineName: '',
          steps: '',
        }
        _error.organization = getDuplicatedValidationMessage(
          'organization',
          _error.organization,
          id,
          duplicatedPipeLineIds
        )
        _error.pipelineName = getDuplicatedValidationMessage(
          'pipelineName',
          _error.pipelineName,
          id,
          duplicatedPipeLineIds
        )
        _error.steps = getDuplicatedValidationMessage('steps', _error.steps, id, duplicatedPipeLineIds)

        return {
          id,
          error: _error,
        }
      }),
    ])
  }

  const isPipelineValid = () => {
    const newErrorMessages = [
      ...deploymentFrequencySettings.map(({ id, organization, pipelineName, steps }) => ({
        id,
        error: {
          organization: getMessage('organization', organization, id, duplicatedPipeLineIds),
          pipelineName: getMessage('pipelineName', pipelineName, id, duplicatedPipeLineIds),
          steps: getMessage('steps', steps, id, duplicatedPipeLineIds),
        },
      })),
    ]
    setErrorMessages(newErrorMessages)
    return newErrorMessages.every(({ error }) => Object.values(error).every((val) => val === ''))
  }

  const value = {
    errorMessages,
    clearErrorMessage,
    checkDuplicatedPipeLine,
    isPipelineValid,
  }

  return <ValidationContext.Provider value={value}>{children}</ValidationContext.Provider>
}

export const useMetricsStepValidationCheckContext = () => useContext(ValidationContext)
