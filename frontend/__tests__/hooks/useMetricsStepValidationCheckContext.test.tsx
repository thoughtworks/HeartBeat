import { ContextProvider, useMetricsStepValidationCheckContext } from '@src/hooks/useMetricsStepValidationCheckContext';
import { addADeploymentFrequencySetting, updateDeploymentFrequencySettings } from '@src/context/Metrics/metricsSlice';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { act, renderHook } from '@testing-library/react';
import { setupStore } from '../utils/setupStoreUtil';
import { Provider } from 'react-redux';
import React from 'react';

describe('useMetricsStepValidationCheckContext', () => {
  const DEPLOYMENT_FREQUENCY_SETTINGS = 'DeploymentFrequencySettings';
  const LEAD_TIME_FOR_CHANGES = 'LeadTimeForChanges';

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
  ];

  const setup = () => {
    const store = setupStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>
        <ContextProvider>{children}</ContextProvider>
      </Provider>
    );
    const { result } = renderHook(() => useMetricsStepValidationCheckContext(), { wrapper });

    return { result, store };
  };

  const setDuplicatedDataToStore = (store: ToolkitStore) => {
    store.dispatch(addADeploymentFrequencySetting());
    duplicatedData.map((data) => {
      store.dispatch(updateDeploymentFrequencySettings(data));
    });
  };

  it('should return initial ValidationContext ', () => {
    const { result } = renderHook(() => useMetricsStepValidationCheckContext());

    expect(result.current?.isPipelineValid(DEPLOYMENT_FREQUENCY_SETTINGS)).toBe(false);
    expect(result.current?.isPipelineValid(LEAD_TIME_FOR_CHANGES)).toBe(false);
    expect(
      result.current?.getDuplicatedPipeLineIds([{ id: 1, organization: '', pipelineName: '', step: '', branches: [] }]),
    ).toEqual([]);
  });

  it('should return useMetricsStepValidationCheckContext correctly ', () => {
    const { result } = setup();

    expect(result.current?.isPipelineValid).toBeInstanceOf(Function);
  });

  it('should return true when call isPipelineValid given valid data', () => {
    const { result, store } = setup();
    act(() => {
      store.dispatch(
        updateDeploymentFrequencySettings({ updateId: 0, label: 'organization', value: 'mockOrganization' }),
      );
      store.dispatch(
        updateDeploymentFrequencySettings({ updateId: 0, label: 'pipelineName', value: 'mockPipelineName' }),
      );
      store.dispatch(updateDeploymentFrequencySettings({ updateId: 0, label: 'step', value: 'mockstep' }));
    });

    act(() => {
      expect(result.current?.isPipelineValid(DEPLOYMENT_FREQUENCY_SETTINGS)).toBe(true);
    });
  });

  it('should return false when call isPipelineValid given duplicated data', () => {
    const { result, store } = setup();
    act(() => {
      setDuplicatedDataToStore(store);
    });

    act(() => {
      expect(result.current?.isPipelineValid(DEPLOYMENT_FREQUENCY_SETTINGS)).toBe(false);
    });
  });

  it('should return false when call isPipelineValid given empty data', () => {
    const { result } = setup();

    act(() => {
      expect(result.current?.isPipelineValid(DEPLOYMENT_FREQUENCY_SETTINGS)).toBe(false);
    });
  });

  it('multiple situation test', async () => {
    const { result, store } = setup();
    act(() => {
      setDuplicatedDataToStore(store);
      store.dispatch(addADeploymentFrequencySetting());
    });

    act(() => {
      expect(result.current?.isPipelineValid(DEPLOYMENT_FREQUENCY_SETTINGS)).toBe(false);
    });

    act(() => {
      store.dispatch(addADeploymentFrequencySetting());
    });
  });
});
