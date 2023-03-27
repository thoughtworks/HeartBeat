import { act, renderHook } from '@testing-library/react'
import { ContextProvider, useMetricsStepValidationCheckContext } from '@src/hooks/useMetricsStepValidationCheckContext'
import React from 'react'
import { addADeploymentFrequencySetting, updateDeploymentFrequencySettings } from '@src/context/Metrics/metricsSlice'
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
  }

  it('should return initial ValidationContext ', () => {
    const { result } = renderHook(() => useMetricsStepValidationCheckContext())

    expect(result.current?.errorMessages).toEqual([])
    expect(result.current?.clearErrorMessage(1, 'label')).toBe(null)
    expect(result.current?.checkDuplicatedPipeLine()).toBe(null)
    expect(result.current?.isPipelineValid()).toBe(false)
  })

  it('should return useMetricsStepValidationCheckContext correctly ', () => {
    const { result } = setup()

    expect(result.current?.errorMessages).toEqual([])
    expect(result.current?.clearErrorMessage).toBeInstanceOf(Function)
    expect(result.current?.checkDuplicatedPipeLine).toBeInstanceOf(Function)
    expect(result.current?.isPipelineValid).toBeInstanceOf(Function)
  })

  it('should clear error message when call clearErrorMessage given error message', () => {
    const { result } = setup()

    act(() => {
      result.current?.isPipelineValid()
    })

    expect(result.current?.errorMessages).toEqual([
      {
        id: 0,
        error: {
          organization: 'organization is required',
          pipelineName: 'pipelineName is required',
          steps: 'steps is required',
        },
      },
    ])

    act(() => {
      result.current?.clearErrorMessage(0, 'organization')
    })

    expect(result.current?.errorMessages).toEqual([
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
      result.current?.checkDuplicatedPipeLine()
    })

    expect(result.current?.errorMessages).toEqual(duplicatedDataErrorMessages)
  })

  it('should return empty message correctly when change the duplicated data given duplicated data', () => {
    const { result, store } = setup()
    act(() => {
      setDuplicatedDataToStore(store)
    })

    act(() => {
      result.current?.checkDuplicatedPipeLine()
    })

    expect(result.current?.errorMessages).toEqual(duplicatedDataErrorMessages)

    act(() => {
      store.dispatch(updateDeploymentFrequencySettings({ updateId: 1, label: 'steps', value: 'changedMockSteps' }))
    })

    act(() => {
      result.current?.checkDuplicatedPipeLine()
    })

    expect(result.current?.errorMessages).toEqual([
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
    ])
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
    })

    act(() => {
      expect(result.current?.isPipelineValid()).toBe(true)
    })

    expect(result.current?.errorMessages).toEqual([{ id: 0, error: { organization: '', pipelineName: '', steps: '' } }])
  })

  it('should return false when call isPipelineValid given duplicated data', () => {
    const { result, store } = setup()
    act(() => {
      setDuplicatedDataToStore(store)
    })

    act(() => {
      expect(result.current?.isPipelineValid()).toBe(false)
    })

    expect(result.current?.errorMessages).toEqual(duplicatedDataErrorMessages)
  })

  it('should return false when call isPipelineValid given empty data', () => {
    const { result } = setup()

    act(() => {
      expect(result.current?.isPipelineValid()).toBe(false)
    })
    expect(result.current?.errorMessages).toEqual([
      {
        id: 0,
        error: {
          organization: 'organization is required',
          pipelineName: 'pipelineName is required',
          steps: 'steps is required',
        },
      },
    ])
  })

  it('multiple situation test', async () => {
    const { result, store } = setup()
    act(() => {
      setDuplicatedDataToStore(store)
      store.dispatch(addADeploymentFrequencySetting())
    })

    act(() => {
      expect(result.current?.isPipelineValid()).toBe(false)
    })

    act(() => {
      store.dispatch(addADeploymentFrequencySetting())
    })

    act(() => {
      result.current?.checkDuplicatedPipeLine()
    })

    expect(result.current?.errorMessages).toEqual([
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
