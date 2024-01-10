import { act, renderHook } from '@testing-library/react';
import { useVerifyPipelineToolEffect } from '@src/hooks/useVerifyPipelineToolEffect';
import { pipelineToolClient } from '@src/clients/pipeline/PipelineToolClient';
import { ERROR_MESSAGE_TIME_DURATION, MOCK_PIPELINE_VERIFY_REQUEST_PARAMS, VERIFY_FAILED } from '../fixtures';
import { InternalServerException } from '@src/exceptions/InternalServerException';
import { HttpStatusCode } from 'axios';

describe('use verify pipelineTool state', () => {
  it('should initial data state when render hook', async () => {
    const { result } = renderHook(() => useVerifyPipelineToolEffect());

    expect(result.current.isLoading).toEqual(false);
  });
  it('should set error message when get verify pipelineTool throw error', async () => {
    jest.useFakeTimers();
    pipelineToolClient.verifyPipelineTool = jest.fn().mockImplementation(() => {
      throw new Error('error');
    });
    const { result } = renderHook(() => useVerifyPipelineToolEffect());

    expect(result.current.isLoading).toEqual(false);

    act(() => {
      result.current.verifyPipelineTool(MOCK_PIPELINE_VERIFY_REQUEST_PARAMS);
      jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION);
    });

    expect(result.current.errorMessage).toEqual('');
  });

  it('should set error message when get verify pipeline response status 500', async () => {
    pipelineToolClient.verifyPipelineTool = jest.fn().mockImplementation(() => {
      throw new InternalServerException('error message', HttpStatusCode.InternalServerError);
    });
    const { result } = renderHook(() => useVerifyPipelineToolEffect());

    act(() => {
      result.current.verifyPipelineTool(MOCK_PIPELINE_VERIFY_REQUEST_PARAMS);
    });

    expect(result.current.errorMessage).toEqual(
      `${MOCK_PIPELINE_VERIFY_REQUEST_PARAMS.type} ${VERIFY_FAILED}: error message`
    );
  });
});
