import { MOCK_SOURCE_CONTROL_VERIFY_ERROR_CASE_TEXT, MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS } from '../fixtures';
import { useVerifySourceControlTokenEffect } from '@src/hooks/useVerifySourceControlTokenEffect';
import { sourceControlClient } from '@src/clients/sourceControl/SourceControlClient';
import { ContextProvider } from '@src/hooks/useMetricsStepValidationCheckContext';
import { act, renderHook, waitFor } from '@testing-library/react';
import { setupStore } from '../utils/setupStoreUtil';
import { Provider } from 'react-redux';
import { HttpStatusCode } from 'axios';
import React from 'react';

describe('use verify sourceControl token', () => {
  const setup = () => {
    const store = setupStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>
        <ContextProvider>{children}</ContextProvider>
      </Provider>
    );
    const { result } = renderHook(() => useVerifySourceControlTokenEffect(), { wrapper });

    return { result };
  };

  it('should initial data state when render hook', async () => {
    const { result } = setup();

    expect(result.current.isLoading).toEqual(false);
  });

  it('should set error message when get verify sourceControl throw error', async () => {
    sourceControlClient.verifyToken = jest.fn().mockResolvedValue({
      code: HttpStatusCode.NoContent,
    });
    const { result } = setup();

    act(() => {
      result.current.verifyToken(MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toEqual(false);
    });
    await waitFor(() => expect(result.current.verifiedError).toBeUndefined());
  });

  it('should set error message when get verify sourceControl response status 401', async () => {
    sourceControlClient.verifyToken = jest.fn().mockResolvedValue({
      code: HttpStatusCode.Unauthorized,
      errorTitle: MOCK_SOURCE_CONTROL_VERIFY_ERROR_CASE_TEXT,
    });
    const { result } = setup();

    act(() => {
      result.current.verifyToken(MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toEqual(false);
    });
    await waitFor(() => {
      expect(result.current.verifiedError).toEqual(MOCK_SOURCE_CONTROL_VERIFY_ERROR_CASE_TEXT);
    });
  });

  it('should clear error message when call clearErrorMessage', async () => {
    sourceControlClient.verifyToken = jest.fn().mockResolvedValue({
      code: HttpStatusCode.Unauthorized,
      errorTitle: MOCK_SOURCE_CONTROL_VERIFY_ERROR_CASE_TEXT,
    });
    const { result } = setup();

    await act(() => result.current.verifyToken(MOCK_SOURCE_CONTROL_VERIFY_REQUEST_PARAMS));
    await act(() => result.current.clearVerifiedError());

    await waitFor(() => {
      expect(result.current.verifiedError).toEqual('');
    });
  });
});
