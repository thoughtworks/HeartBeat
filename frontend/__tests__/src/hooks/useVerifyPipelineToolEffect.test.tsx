import { act, renderHook, waitFor } from '@testing-library/react';
import { useVerifyPipelineToolEffect } from '@src/hooks/useVerifyPipelineToolEffect';
import { pipelineToolClient } from '@src/clients/pipeline/PipelineToolClient';
import { MOCK_PIPELINE_VERIFY_REQUEST_PARAMS, VERIFY_FAILED } from '../fixtures';
import { InternalServerException } from '@src/exceptions/InternalServerException';
import { HttpStatusCode } from 'axios';

describe('use verify pipelineTool state', () => {
  it('should initial data state when render hook', async () => {
    const { result } = renderHook(() => useVerifyPipelineToolEffect());

    expect(result.current.isLoading).toEqual(false);
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

  it('should clear error message when error message exists', async () => {
    pipelineToolClient.verifyPipelineTool = jest.fn().mockImplementation(() => {
      throw new InternalServerException('error message', HttpStatusCode.InternalServerError);
    });
    const { result } = renderHook(() => useVerifyPipelineToolEffect());

    act(() => {
      result.current.verifyPipelineTool(MOCK_PIPELINE_VERIFY_REQUEST_PARAMS);
    });

    result.current.clearErrorMessage();

    await waitFor(() => {
      expect(result.current.errorMessage).toEqual('');
    });
  });
});
