import { useGetPipelineToolInfoEffect } from '@src/hooks/useGetPipelineToolInfoEffect';
import { pipelineToolClient } from '@src/clients/pipeline/PipelineToolClient';
import { MOCK_BUILD_KITE_GET_INFO_RESPONSE } from '../fixtures';
import { renderHook, waitFor } from '@testing-library/react';
import { setupStore } from '../utils/setupStoreUtil';
import { Provider } from 'react-redux';
import { HttpStatusCode } from 'axios';
import { ReactNode } from 'react';
import React from 'react';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: (selector: <TSelected>() => TSelected) => {
    const originalUseSelector = jest.requireActual('react-redux').useSelector;
    if (selector.name === 'isPipelineToolVerified') {
      return true;
    } else {
      return originalUseSelector(selector);
    }
  },
}));

const store = setupStore();
const Wrapper = ({ children }: { children: ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

const clientSpy = jest.fn();
const clientOkMock = jest.fn().mockImplementation(async () => {
  clientSpy();
  const response = {
    code: HttpStatusCode.Ok,
    data: MOCK_BUILD_KITE_GET_INFO_RESPONSE,
    errorTittle: '',
    errorMessage: '',
  };

  return response;
});

beforeEach(() => {
  pipelineToolClient.getInfo = clientOkMock;
  clientSpy.mockClear();
});

describe('use get pipelineTool info side effect', () => {
  it('should return success data and loading state when client goes happy path', async () => {
    const { result } = renderHook(() => useGetPipelineToolInfoEffect(), { wrapper: Wrapper });

    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
    });
    expect(clientSpy).toBeCalled();
  });

  it('should not make duplicated call when hook rerenders', async () => {
    const { result, rerender } = renderHook(() => useGetPipelineToolInfoEffect(), { wrapper: Wrapper });
    rerender();

    await waitFor(() => {
      expect(result.current.isLoading).toBeFalsy();
    });
    expect(clientSpy).toBeCalledTimes(1);
  });
});
