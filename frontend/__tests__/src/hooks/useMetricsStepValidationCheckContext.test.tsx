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
  const duplicatedData = [
    {
      updateId: 0,
      label: 'organization',
      value: 'mockOrganization',
    },
    { updateId: 0, label: 'pipelineName', value: 'mockPipelineName' },
    { updateId: 0, label: 'steps', value: 'mockSteps' },
    { updateId: 1, label: 'organization', value: 'mockOrganization' },
    { updateId: 1, label: 'pipelineName', value: 'mockPipelineName' },
    { updateId: 1, label: 'steps', value: 'mockSteps' },
  ]

  const duplicatedDataErrorMessages = [
    {
      id: 0,
      error: {
        organization: 'duplicated organization',
        pipelineName: 'duplicated pipelineName',
        steps: 'duplicated steps',
      },
    },
    {
      id: 1,
      error: {
        organization: 'duplicated organization',
        pipelineName: 'duplicated pipelineName',
        steps: 'duplicated steps',
      },
    },
  ]

  const requiredDataErrorMessages = [
    {
      id: 0,
      error: {
        organization: 'organization is required',
        pipelineName: 'pipelineName is required',
        steps: 'steps is required',
      },
    },
  ]

  const emptyErrorMessages = [
    {
      id: 0,
      error: {
        organization: '',
        pipelineName: '',
        steps: '',
      },
    },
    {
      id: 1,
      error: {
        organization: '',
        pipelineName: '',
        steps: '',
      },
    },
  ]

  const duplicatedPipelineSettings = [
    { id: 0, organization: 'mockOrganization', pipelineName: 'mockPipelineName', steps: 'mockSteps' },
    { id: 1, organization: 'mockOrganization', pipelineName: 'mockPipelineName', steps: 'mockSteps' },
  ]

  const notDuplicatedPipelineSettings = [
    { id: 0, organization: 'mockOrganization', pipelineName: 'mockPipelineName', steps: 'mockSteps' },
    { id: 1, organization: 'mockOrganization', pipelineName: 'mockPipelineName', steps: 'changedMockSteps' },
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
    expect(result.current?.clearErrorMessage(1, 'label', 'DeploymentFrequencySettings')).toBe(null)
    expect(result.current?.clearErrorMessage(1, 'label', 'LeadTimeForChanges')).toBe(null)
    expect(
      result.current?.checkDuplicatedPipeline(
        [{ id: 1, organization: '', pipelineName: '', steps: '' }],
        'DeploymentFrequencySettings'
      )
    ).toBe(null)
    expect(
      result.current?.checkDuplicatedPipeline(
        [{ id: 1, organization: '', pipelineName: '', steps: '' }],
        'LeadTimeForChanges'
      )
    ).toBe(null)
    expect(result.current?.isPipelineValid('DeploymentFrequencySettings')).toBe(false)
    expect(result.current?.isPipelineValid('LeadTimeForChanges')).toBe(false)
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
      result.current?.isPipelineValid('DeploymentFrequencySettings')
      result.current?.isPipelineValid('LeadTimeForChanges')
    })

    expect(result.current?.deploymentFrequencySettingsErrorMessages).toEqual(requiredDataErrorMessages)
    expect(result.current?.leadTimeForChangesErrorMessages).toEqual(requiredDataErrorMessages)

    act(() => {
      result.current?.clearErrorMessage(0, 'organization', 'DeploymentFrequencySettings')
      result.current?.clearErrorMessage(0, 'organization', 'LeadTimeForChanges')
    })

    expect(result.current?.deploymentFrequencySettingsErrorMessages).toEqual([
      {
        id: 0,
        error: {
          organization: '',
          pipelineName: 'pipelineName is required',
          steps: 'steps is required',
        },
      },
    ])
    expect(result.current?.leadTimeForChangesErrorMessages).toEqual([
      {
        id: 0,
        error: {
          organization: '',
          pipelineName: 'pipelineName is required',
          steps: 'steps is required',
        },
      },
    ])
  })

  it('should return duplicated error message correctly when call checkDuplicatedPipeLine given not duplicated data', () => {
    const { result, store } = setup()
    act(() => {
      setDuplicatedDataToStore(store)
    })

    act(() => {
      result.current?.checkDuplicatedPipeline(duplicatedPipelineSettings, 'DeploymentFrequencySettings')
      result.current?.checkDuplicatedPipeline(duplicatedPipelineSettings, 'LeadTimeForChanges')
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
      result.current?.checkDuplicatedPipeline(duplicatedPipelineSettings, 'DeploymentFrequencySettings')
      result.current?.checkDuplicatedPipeline(duplicatedPipelineSettings, 'LeadTimeForChanges')
    })

    expect(result.current?.deploymentFrequencySettingsErrorMessages).toEqual(duplicatedDataErrorMessages)
    expect(result.current?.leadTimeForChangesErrorMessages).toEqual(duplicatedDataErrorMessages)

    act(() => {
      store.dispatch(updateDeploymentFrequencySettings({ updateId: 1, label: 'steps', value: 'changedMockSteps' }))
      store.dispatch(updateLeadTimeForChanges({ updateId: 1, label: 'steps', value: 'changedMockSteps' }))
    })

    act(() => {
      result.current?.checkDuplicatedPipeline(notDuplicatedPipelineSettings, 'DeploymentFrequencySettings')
      result.current?.checkDuplicatedPipeline(notDuplicatedPipelineSettings, 'LeadTimeForChanges')
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
      store.dispatch(updateDeploymentFrequencySettings({ updateId: 0, label: 'steps', value: 'mockSteps' }))
      store.dispatch(updateLeadTimeForChanges({ updateId: 0, label: 'organization', value: 'mockOrganization' }))
      store.dispatch(updateLeadTimeForChanges({ updateId: 0, label: 'pipelineName', value: 'mockPipelineName' }))
      store.dispatch(updateLeadTimeForChanges({ updateId: 0, label: 'steps', value: 'mockSteps' }))
    })

    act(() => {
      expect(result.current?.isPipelineValid('DeploymentFrequencySettings')).toBe(true)
      expect(result.current?.isPipelineValid('LeadTimeForChanges')).toBe(true)
    })

    expect(result.current?.deploymentFrequencySettingsErrorMessages).toEqual([
      { id: 0, error: { organization: '', pipelineName: '', steps: '' } },
    ])
    expect(result.current?.leadTimeForChangesErrorMessages).toEqual([
      { id: 0, error: { organization: '', pipelineName: '', steps: '' } },
    ])
  })

  it('should return false when call isPipelineValid given duplicated data', () => {
    const { result, store } = setup()
    act(() => {
      setDuplicatedDataToStore(store)
    })

    act(() => {
      expect(result.current?.isPipelineValid('DeploymentFrequencySettings')).toBe(false)
      expect(result.current?.isPipelineValid('LeadTimeForChanges')).toBe(false)
    })

    expect(result.current?.deploymentFrequencySettingsErrorMessages).toEqual(duplicatedDataErrorMessages)
    expect(result.current?.leadTimeForChangesErrorMessages).toEqual(duplicatedDataErrorMessages)
  })

  it('should return false when call isPipelineValid given empty data', () => {
    const { result } = setup()

    act(() => {
      expect(result.current?.isPipelineValid('DeploymentFrequencySettings')).toBe(false)
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
      expect(result.current?.isPipelineValid('DeploymentFrequencySettings')).toBe(false)
      expect(result.current?.isPipelineValid('LeadTimeForChanges')).toBe(false)
    })

    act(() => {
      store.dispatch(addADeploymentFrequencySetting())
      store.dispatch(addALeadTimeForChanges())
    })

    act(() => {
      result.current?.checkDuplicatedPipeline(
        [
          { id: 0, organization: 'mockOrganization', pipelineName: 'mockPipelineName', steps: 'mockSteps' },
          { id: 1, organization: 'mockOrganization', pipelineName: 'mockPipelineName', steps: 'mockSteps' },
          { id: 2, organization: '', pipelineName: '', steps: '' },
          { id: 3, organization: '', pipelineName: '', steps: '' },
        ],
        'DeploymentFrequencySettings'
      )
      result.current?.checkDuplicatedPipeline(
        [
          { id: 0, organization: 'mockOrganization', pipelineName: 'mockPipelineName', steps: 'mockSteps' },
          { id: 1, organization: 'mockOrganization', pipelineName: 'mockPipelineName', steps: 'mockSteps' },
          { id: 2, organization: '', pipelineName: '', steps: '' },
          { id: 3, organization: '', pipelineName: '', steps: '' },
        ],
        'LeadTimeForChanges'
      )
    })

    expect(result.current?.deploymentFrequencySettingsErrorMessages).toEqual([
      ...duplicatedDataErrorMessages,
      {
        id: 2,
        error: {
          organization: 'organization is required',
          pipelineName: 'pipelineName is required',
          steps: 'steps is required',
        },
      },
      {
        id: 3,
        error: {
          organization: '',
          pipelineName: '',
          steps: '',
        },
      },
    ])
    expect(result.current?.leadTimeForChangesErrorMessages).toEqual([
      ...duplicatedDataErrorMessages,
      {
        id: 2,
        error: {
          organization: 'organization is required',
          pipelineName: 'pipelineName is required',
          steps: 'steps is required',
        },
      },
      {
        id: 3,
        error: {
          organization: '',
          pipelineName: '',
          steps: '',
        },
      },
    ])
  })
})
