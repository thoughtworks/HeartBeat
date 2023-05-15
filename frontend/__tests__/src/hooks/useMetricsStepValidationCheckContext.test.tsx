import { act, renderHook } from '@testing-library/react'
import { ContextProvider, useMetricsStepValidationCheckContext } from '@src/hooks/useMetricsStepValidationCheckContext'
import React from 'react'
import {
  addADeploymentFrequencySetting,
  addALeadTimeForChanges,
  updateDeploymentFrequencySettings,
  updateLeadTimeForChanges,
} from '@src/context/Metrics/metricsSlice'
import { Provider } from 'react-redux'
import { setupStore } from '../utils/setupStoreUtil'
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'

describe('useMetricsStepValidationCheckContext', () => {
  const DEPLOYMENT_FREQUENCY_SETTINGS = 'DeploymentFrequencySettings'
  const LEAD_TIME_FOR_CHANGES = 'LeadTimeForChanges'

  const duplicatedData = [
    {
      updateId: 0,
      label: 'organization',
      value: 'mockOrganization',
    },
    { updateId: 0, label: 'pipelineName', value: 'mockPipelineName' },
    { updateId: 0, label: 'step', value: 'mockstep' },
    { updateId: 1, label: 'organization', value: 'mockOrganization' },
    { updateId: 1, label: 'pipelineName', value: 'mockPipelineName' },
    { updateId: 1, label: 'step', value: 'mockstep' },
  ]

  const duplicatedDataErrorMessages = [
    {
      id: 0,
      error: {
        organization: 'duplicated organization',
        pipelineName: 'duplicated pipelineName',
        step: 'duplicated step',
      },
    },
    {
      id: 1,
      error: {
        organization: 'duplicated organization',
        pipelineName: 'duplicated pipelineName',
        step: 'duplicated step',
      },
    },
  ]

  const requiredDataErrorMessages = [
    {
      id: 0,
      error: {
        organization: 'organization is required',
        pipelineName: 'pipelineName is required',
        step: 'step is required',
      },
    },
  ]

  const updatedRequiredDataErrorMessages = [
    {
      id: 0,
      error: {
        organization: '',
        pipelineName: 'pipelineName is required',
        step: 'step is required',
      },
    },
  ]

  const emptyErrorMessages = [
    {
      id: 0,
      error: {
        organization: '',
        pipelineName: '',
        step: '',
      },
    },
    {
      id: 1,
      error: {
        organization: '',
        pipelineName: '',
        step: '',
      },
    },
  ]

  const duplicatedPipelineSettings = [
    { id: 0, organization: 'mockOrganization', pipelineName: 'mockPipelineName', step: 'mockstep' },
    { id: 1, organization: 'mockOrganization', pipelineName: 'mockPipelineName', step: 'mockstep' },
  ]

  const notDuplicatedPipelineSettings = [
    { id: 0, organization: 'mockOrganization', pipelineName: 'mockPipelineName', step: 'mockstep' },
    { id: 1, organization: 'mockOrganization', pipelineName: 'mockPipelineName', step: 'changedMockstep' },
  ]

  const emptyPipelineSettings = [
    { id: 2, organization: '', pipelineName: '', step: '' },
    { id: 3, organization: '', pipelineName: '', step: '' },
  ]

  const setup = () => {
    const store = setupStore()
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>
        <ContextProvider>{children}</ContextProvider>
      </Provider>
    )
    const { result } = renderHook(() => useMetricsStepValidationCheckContext(), { wrapper })

    return { result, store }
  }

  const setDuplicatedDataToStore = (store: ToolkitStore) => {
    store.dispatch(addADeploymentFrequencySetting())
    duplicatedData.map((data) => {
      store.dispatch(updateDeploymentFrequencySettings(data))
    })
    store.dispatch(addALeadTimeForChanges())
    duplicatedData.map((data) => {
      store.dispatch(updateLeadTimeForChanges(data))
    })
  }

  it('should return initial ValidationContext ', () => {
    const { result } = renderHook(() => useMetricsStepValidationCheckContext())

    expect(result.current?.deploymentFrequencySettingsErrorMessages).toEqual([])
    expect(result.current?.leadTimeForChangesErrorMessages).toEqual([])
    expect(result.current?.clearErrorMessage(1, 'label', DEPLOYMENT_FREQUENCY_SETTINGS)).toBe(null)
    expect(result.current?.clearErrorMessage(1, 'label', LEAD_TIME_FOR_CHANGES)).toBe(null)
    expect(
      result.current?.checkDuplicatedPipeline(
        [{ id: 1, organization: '', pipelineName: '', step: '' }],
        DEPLOYMENT_FREQUENCY_SETTINGS
      )
    ).toBe(null)
    expect(
      result.current?.checkDuplicatedPipeline(
        [{ id: 1, organization: '', pipelineName: '', step: '' }],
        LEAD_TIME_FOR_CHANGES
      )
    ).toBe(null)
    expect(result.current?.isPipelineValid(DEPLOYMENT_FREQUENCY_SETTINGS)).toBe(false)
    expect(result.current?.isPipelineValid(LEAD_TIME_FOR_CHANGES)).toBe(false)
    expect(result.current?.getDuplicatedPipeLineIds([{ id: 1, organization: '', pipelineName: '', step: '' }])).toEqual(
      []
    )
  })

  it('should return useMetricsStepValidationCheckContext correctly ', () => {
    const { result } = setup()

    expect(result.current?.deploymentFrequencySettingsErrorMessages).toEqual([])
    expect(result.current?.clearErrorMessage).toBeInstanceOf(Function)
    expect(result.current?.checkDuplicatedPipeline).toBeInstanceOf(Function)
    expect(result.current?.isPipelineValid).toBeInstanceOf(Function)
  })

  it('should clear error message when call clearErrorMessage given error message', () => {
    const { result } = setup()

    act(() => {
      result.current?.isPipelineValid(DEPLOYMENT_FREQUENCY_SETTINGS)
      result.current?.isPipelineValid(LEAD_TIME_FOR_CHANGES)
    })

    expect(result.current?.deploymentFrequencySettingsErrorMessages).toEqual(requiredDataErrorMessages)
    expect(result.current?.leadTimeForChangesErrorMessages).toEqual(requiredDataErrorMessages)

    act(() => {
      result.current?.clearErrorMessage(0, 'organization', DEPLOYMENT_FREQUENCY_SETTINGS)
      result.current?.clearErrorMessage(0, 'organization', LEAD_TIME_FOR_CHANGES)
    })

    expect(result.current?.deploymentFrequencySettingsErrorMessages).toEqual(updatedRequiredDataErrorMessages)
    expect(result.current?.leadTimeForChangesErrorMessages).toEqual(updatedRequiredDataErrorMessages)
  })

  it('should return duplicated error message correctly when call checkDuplicatedPipeLine given not duplicated data', () => {
    const { result, store } = setup()
    act(() => {
      setDuplicatedDataToStore(store)
    })

    act(() => {
      result.current?.checkDuplicatedPipeline(duplicatedPipelineSettings, DEPLOYMENT_FREQUENCY_SETTINGS)
      result.current?.checkDuplicatedPipeline(duplicatedPipelineSettings, LEAD_TIME_FOR_CHANGES)
    })

    expect(result.current?.deploymentFrequencySettingsErrorMessages).toEqual(duplicatedDataErrorMessages)
    expect(result.current?.leadTimeForChangesErrorMessages).toEqual(duplicatedDataErrorMessages)
  })

  it('should return empty message correctly when change the duplicated data given duplicated data', () => {
    const { result, store } = setup()
    act(() => {
      setDuplicatedDataToStore(store)
    })

    act(() => {
      result.current?.checkDuplicatedPipeline(duplicatedPipelineSettings, DEPLOYMENT_FREQUENCY_SETTINGS)
      result.current?.checkDuplicatedPipeline(duplicatedPipelineSettings, LEAD_TIME_FOR_CHANGES)
    })

    expect(result.current?.deploymentFrequencySettingsErrorMessages).toEqual(duplicatedDataErrorMessages)
    expect(result.current?.leadTimeForChangesErrorMessages).toEqual(duplicatedDataErrorMessages)

    act(() => {
      store.dispatch(updateDeploymentFrequencySettings({ updateId: 1, label: 'step', value: 'changedMockstep' }))
      store.dispatch(updateLeadTimeForChanges({ updateId: 1, label: 'step', value: 'changedMockstep' }))
    })

    act(() => {
      result.current?.checkDuplicatedPipeline(notDuplicatedPipelineSettings, DEPLOYMENT_FREQUENCY_SETTINGS)
      result.current?.checkDuplicatedPipeline(notDuplicatedPipelineSettings, LEAD_TIME_FOR_CHANGES)
    })

    expect(result.current?.deploymentFrequencySettingsErrorMessages).toEqual(emptyErrorMessages)
    expect(result.current?.leadTimeForChangesErrorMessages).toEqual(emptyErrorMessages)
  })

  it('should return true when call isPipelineValid given valid data', () => {
    const { result, store } = setup()
    act(() => {
      store.dispatch(
        updateDeploymentFrequencySettings({ updateId: 0, label: 'organization', value: 'mockOrganization' })
      )
      store.dispatch(
        updateDeploymentFrequencySettings({ updateId: 0, label: 'pipelineName', value: 'mockPipelineName' })
      )
      store.dispatch(updateDeploymentFrequencySettings({ updateId: 0, label: 'step', value: 'mockstep' }))
      store.dispatch(updateLeadTimeForChanges({ updateId: 0, label: 'organization', value: 'mockOrganization' }))
      store.dispatch(updateLeadTimeForChanges({ updateId: 0, label: 'pipelineName', value: 'mockPipelineName' }))
      store.dispatch(updateLeadTimeForChanges({ updateId: 0, label: 'step', value: 'mockstep' }))
    })

    act(() => {
      expect(result.current?.isPipelineValid(DEPLOYMENT_FREQUENCY_SETTINGS)).toBe(true)
      expect(result.current?.isPipelineValid('LeadTimeForChanges')).toBe(true)
    })

    expect(result.current?.deploymentFrequencySettingsErrorMessages).toEqual([emptyErrorMessages[0]])
    expect(result.current?.leadTimeForChangesErrorMessages).toEqual([emptyErrorMessages[0]])
  })

  it('should return false when call isPipelineValid given duplicated data', () => {
    const { result, store } = setup()
    act(() => {
      setDuplicatedDataToStore(store)
    })

    act(() => {
      expect(result.current?.isPipelineValid(DEPLOYMENT_FREQUENCY_SETTINGS)).toBe(false)
      expect(result.current?.isPipelineValid('LeadTimeForChanges')).toBe(false)
    })

    expect(result.current?.deploymentFrequencySettingsErrorMessages).toEqual(duplicatedDataErrorMessages)
    expect(result.current?.leadTimeForChangesErrorMessages).toEqual(duplicatedDataErrorMessages)
  })

  it('should return false when call isPipelineValid given empty data', () => {
    const { result } = setup()

    act(() => {
      expect(result.current?.isPipelineValid(DEPLOYMENT_FREQUENCY_SETTINGS)).toBe(false)
      expect(result.current?.isPipelineValid('LeadTimeForChanges')).toBe(false)
    })
    expect(result.current?.deploymentFrequencySettingsErrorMessages).toEqual(requiredDataErrorMessages)
    expect(result.current?.leadTimeForChangesErrorMessages).toEqual(requiredDataErrorMessages)
  })

  it('multiple situation test', async () => {
    const { result, store } = setup()
    act(() => {
      setDuplicatedDataToStore(store)
      store.dispatch(addADeploymentFrequencySetting())
      store.dispatch(addALeadTimeForChanges())
    })

    act(() => {
      expect(result.current?.isPipelineValid(DEPLOYMENT_FREQUENCY_SETTINGS)).toBe(false)
      expect(result.current?.isPipelineValid(LEAD_TIME_FOR_CHANGES)).toBe(false)
    })

    act(() => {
      store.dispatch(addADeploymentFrequencySetting())
      store.dispatch(addALeadTimeForChanges())
    })

    act(() => {
      result.current?.checkDuplicatedPipeline(
        [...duplicatedPipelineSettings, ...emptyPipelineSettings],
        DEPLOYMENT_FREQUENCY_SETTINGS
      )
      result.current?.checkDuplicatedPipeline(
        [...duplicatedPipelineSettings, ...emptyPipelineSettings],
        LEAD_TIME_FOR_CHANGES
      )
    })

    expect(result.current?.deploymentFrequencySettingsErrorMessages).toEqual([
      ...duplicatedDataErrorMessages,
      {
        id: 2,
        error: requiredDataErrorMessages[0].error,
      },
      {
        id: 3,
        error: emptyErrorMessages[0].error,
      },
    ])
    expect(result.current?.leadTimeForChangesErrorMessages).toEqual([
      ...duplicatedDataErrorMessages,
      {
        id: 2,
        error: requiredDataErrorMessages[0].error,
      },
      {
        id: 3,
        error: emptyErrorMessages[0].error,
      },
    ])
  })
})
