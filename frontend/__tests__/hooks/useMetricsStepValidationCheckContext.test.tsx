import { ContextProvider, useMetricsStepValidationCheckContext } from '@src/hooks/useMetricsStepValidationCheckContext';
import { setupStore } from '../utils/setupStoreUtil';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import React from 'react';

describe('useMetricsStepValidationCheckContext', () => {
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

  it('should return initial ValidationContext ', () => {
    const { result } = renderHook(() => useMetricsStepValidationCheckContext());

    expect(
      result.current?.getDuplicatedPipeLineIds([{ id: 0, organization: '', pipelineName: '', step: '', branches: [] }]),
    ).toEqual([]);
  });

  it('should return empty id when params is empty array', () => {
    const { result } = setup();

    expect(result.current?.getDuplicatedPipeLineIds([])).toEqual([]);
  });

  it('should return duplicate id when call getDuplicatedPipeLineIds given duplicated data', () => {
    const { result } = setup();

    expect(
      result.current?.getDuplicatedPipeLineIds([
        { id: 0, organization: 'mockOrganization', pipelineName: 'mockPipelineName', step: 'mockstep', branches: [] },
        { id: 1, organization: 'mockOrganization', pipelineName: 'mockPipelineName', step: 'mockstep', branches: [] },
      ]),
    ).toEqual([0, 1]);
  });
});
