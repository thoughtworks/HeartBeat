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

interface ProviderContextType {
  errorMessages: ErrorMessagesProps[]
  clearErrorMessage: (changedSelectionId: number, label: string) => void
  checkDuplicatedPipeLine: () => void
  isPipelineValid: () => boolean
}

interface ContextProviderProps {
  children: React.ReactNode
}

export const ValidationContext = createContext<ProviderContextType>({
  errorMessages: [],
  clearErrorMessage: () => null,
  checkDuplicatedPipeLine: () => null,
  isPipelineValid: () => false,
})

const emptyErrorMessages = {
  organization: '',
  pipelineName: '',
  steps: '',
}

const getErrorMessage = (label: string, value: string, id: number, duplicatedPipeLineIds: number[]) =>
  !value ? `${label} is required` : duplicatedPipeLineIds.includes(id) ? `duplicated ${label}` : ''

const getDuplicatedPipeLineIds = (
  deploymentFrequencySettings: { id: number; organization: string; pipelineName: string; steps: string }[]
) => {
  const errors: { [key: string]: number[] } = {}
  deploymentFrequencySettings.forEach(({ id, organization, pipelineName, steps }) => {
    if (organization && pipelineName && steps) {
      const errorString = `${organization}${pipelineName}${steps}`
      if (errors[errorString]) errors[errorString].push(id)
      else errors[errorString] = [id]
    }
  })
  return Object.values(errors)
    .filter((ids) => ids.length > 1)
    .flat()
}

export const ContextProvider = ({ children }: ContextProviderProps) => {
  const deploymentFrequencySettings = useAppSelector(selectDeploymentFrequencySettings)
  const [errorMessages, setErrorMessages] = useState([] as ErrorMessagesProps[])

  const isPipelineValid = () => {
    const duplicatedPipeLineIds: number[] = getDuplicatedPipeLineIds(deploymentFrequencySettings)
    const newErrorMessages = deploymentFrequencySettings.map(({ id, organization, pipelineName, steps }) => ({
      id,
      error: {
        organization: getErrorMessage('organization', organization, id, duplicatedPipeLineIds),
        pipelineName: getErrorMessage('pipelineName', pipelineName, id, duplicatedPipeLineIds),
        steps: getErrorMessage('steps', steps, id, duplicatedPipeLineIds),
      },
    }))
    setErrorMessages(newErrorMessages)
    return newErrorMessages.every(({ error }) => Object.values(error).every((val) => !val))
  }

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
    const duplicatedPipeLineIds: number[] = getDuplicatedPipeLineIds(deploymentFrequencySettings)
    const errorMessages = deploymentFrequencySettings.map((deploymentFrequencySetting) =>
      getDuplicatedErrorMessage(deploymentFrequencySetting, duplicatedPipeLineIds)
    )
    setErrorMessages(errorMessages)
  }

  const getDuplicatedErrorMessage = (
    deploymentFrequencySetting: { id: number; organization: string; pipelineName: string; steps: string },
    duplicatedPipeLineIds: number[]
  ) => {
    const { id, organization, pipelineName, steps } = deploymentFrequencySetting
    if (!organization || !pipelineName || !steps) {
      return { id, error: errorMessages.find((x) => x.id === id)?.error ?? emptyErrorMessages }
    }

    if (duplicatedPipeLineIds.includes(id)) {
      return {
        id,
        error: {
          organization: 'duplicated organization',
          pipelineName: 'duplicated pipelineName',
          steps: 'duplicated steps',
        },
      }
    }

    return { id, error: emptyErrorMessages }
  }

  return (
    <ValidationContext.Provider
      value={{
        errorMessages,
        clearErrorMessage,
        checkDuplicatedPipeLine,
        isPipelineValid,
      }}
    >
      {children}
    </ValidationContext.Provider>
  )
}

export const useMetricsStepValidationCheckContext = () => useContext(ValidationContext)
